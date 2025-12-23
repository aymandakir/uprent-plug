import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Provider = "ga4" | "plausible";

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  provider?: Provider | Provider[];
}

const MIN_INTERVAL = 2000;

function sendBeacon(url: string, body: Record<string, unknown>) {
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return true;
  }
  return false;
}

export function useAnalytics(providers: Provider[] = ["ga4", "plausible"]) {
  const lastSentRef = useRef<Record<string, number>>({});
  const queueRef = useRef<AnalyticsEvent[]>([]);

  const flush = useCallback(() => {
    if (queueRef.current.length === 0) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    queueRef.current.splice(0).forEach((event) => {
      const targets = Array.isArray(event.provider) ? event.provider : providers;
      targets.forEach((provider) => {
        const payload = {
          name: event.name,
          properties: event.properties,
          ts: Date.now(),
          provider
        };
        const url =
          provider === "ga4"
            ? "/api/collect/ga4"
            : "/api/collect/plausible";
        const delivered = sendBeacon(url, payload);
        if (!delivered) {
          // eslint-disable-next-line no-console
          console.log(`[analytics:${provider}]`, payload);
        }
      });
    });
  }, [providers]);

  useEffect(() => {
    const handleOnline = () => flush();
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [flush]);

  const track = useCallback(
    (name: string, properties?: Record<string, unknown>) => {
      const now = Date.now();
      if (now - (lastSentRef.current[name] ?? 0) < MIN_INTERVAL) return;
      lastSentRef.current[name] = now;
      queueRef.current.push({ name, properties, provider: providers });
      flush();
    },
    [flush, providers]
  );

  return { track, flush };
}

export function useABTest(variants: string[], flagKey = "trust-builder-variant") {
  const [variant, setVariant] = useState<string>(() => {
    if (typeof window === "undefined") return variants[0] ?? "";
    const stored = window.localStorage.getItem(flagKey);
    if (stored && variants.includes(stored)) return stored;
    const chosen = variants[Math.floor(Math.random() * variants.length)] ?? variants[0] ?? "";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(flagKey, chosen);
    }
    return chosen;
  });

  useEffect(() => {
    if (!variants.includes(variant)) {
      const next = variants[0] ?? "";
      setVariant(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(flagKey, next);
      }
    }
  }, [variant, variants, flagKey]);

  return useMemo(() => ({ variant, setVariant }), [variant]);
}

