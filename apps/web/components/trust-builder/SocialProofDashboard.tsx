"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Lock, Users, Star, Activity } from "lucide-react";
import clsx from "clsx";
import LiveActivityFeed from "./LiveActivityFeed";
import { eventTaxonomy } from "./analytics.config";
import { useAnalytics, useABTest } from "./hooks/useAnalytics";
import type { BookingEvent } from "../../types/trust-builder";
import { bookingEvents } from "./utils/mockData";
import { TrustBuilderErrorBoundaryWithAnalytics } from "./ErrorBoundary";
import { useLiveActivity, useTrustCounters } from "./hooks/useTrustData";

const TrustMetricsBar = dynamic(() => import("./TrustMetricsBar"), {
  loading: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="h-32 rounded-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] animate-[shimmer_1.6s_infinite]"
        />
      ))}
    </div>
  ),
  ssr: false
});

export interface SocialProofDashboardProps {
  variant?: "homepage" | "pricing" | "compact";
  showTrustpilot?: boolean;
  autoRefresh?: boolean;
  cycleIntervalMs?: number;
  useLiveData?: boolean;
  style?: CSSProperties;
  className?: string;
}

function TrustBadges({ showTrustpilot }: { showTrustpilot: boolean }) {
  const badgeItems = [
    { label: "SSL Secured", icon: <Lock size={16} />, desc: "256-bit encryption" },
    { label: "GDPR Compliant", icon: <Shield size={16} />, desc: "EU privacy-first" },
    {
      label: "Dutch Housing Authority Verified",
      icon: <Activity size={16} />,
      desc: "Local compliance"
    }
  ];

  return (
    <div className="space-y-4">
      {showTrustpilot && (
        <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-glow">
          <div className="flex items-center gap-2">
            <Star className="text-accent" />
            <p className="font-semibold text-neutral-900">Trustpilot 4.7/5</p>
          </div>
          <p className="text-sm text-neutral-600">39 reviews • updated live</p>
          <div id="trustbox" className="mt-3" aria-label="Trustpilot widget" />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {badgeItems.map((badge) => (
          <div
            key={badge.label}
            className="flex items-start gap-3 rounded-xl border border-white/40 bg-white/60 p-3"
          >
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-neutral-900">
              {badge.icon}
            </span>
            <div>
              <p className="font-semibold text-neutral-900">{badge.label}</p>
              <p className="text-sm text-neutral-600">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4">
        <div className="flex items-center gap-2">
          <Users className="text-primary" />
          <p className="font-semibold text-neutral-900">Join 12,400+ renters</p>
        </div>
        <p className="text-sm text-neutral-600">Growing community of confident movers.</p>
      </div>
    </div>
  );
}

export default function SocialProofDashboard({
  variant = "homepage",
  showTrustpilot = true,
  autoRefresh = true,
  cycleIntervalMs = 4000,
  useLiveData = false,
  style,
  className
}: SocialProofDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.4 });
  const { track } = useAnalytics();
  const { variant: abVariant } = useABTest(["A", "B"]);
  const [widgetReady, setWidgetReady] = useState(false);
  const [events, setEvents] = useState<BookingEvent[]>(bookingEvents);
  const { events: liveEvents } = useLiveActivity(24);
  const counters = useTrustCounters();
  const noiseBg =
    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)";

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      setEvents((prev) => {
        const first = prev[0];
        if (!first) return prev;
        return [...prev.slice(1), first];
      });
    }, 15000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => {
      track(eventTaxonomy.socialProofViewed, { variant: abVariant });
    }, 3000);
    return () => clearTimeout(id);
  }, [inView, track, abVariant]);

  useEffect(() => {
    if (!widgetReady) return;
    track(eventTaxonomy.trustpilotWidgetClicked, { variant: abVariant });
  }, [widgetReady, track, abVariant]);

  const layoutStyles = useMemo(
    () =>
      variant === "compact"
        ? "grid gap-6"
        : "grid gap-6 lg:grid-cols-[1.4fr_0.9fr]",
    [variant]
  );

  return (
    <TrustBuilderErrorBoundaryWithAnalytics>
      <motion.section
        ref={containerRef}
        data-variant={abVariant}
        data-testid="social-proof-dashboard"
        className={clsx(
          "relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-neutral-50 to-white p-6 shadow-2xl shadow-primary/10",
          className
        )}
        style={{
          ...style,
          backgroundImage: `linear-gradient(135deg, rgba(255,107,107,0.06), rgba(78,205,196,0.05)), ${noiseBg}`,
          backgroundSize: "auto, 6px 6px"
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">Social proof</p>
          <h1 className="text-2xl font-bold text-neutral-900">
            Build instant trust with live Uprent signals
          </h1>
          <p className="text-neutral-600">
            Real-time activity, credibility metrics, and verified badges designed to convert free
            users into Confident plan subscribers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <TrustMetricsBar
            className="mb-6"
            initialValues={
              counters.data
                ? {
                    homesFound: Math.max(0, ((counters.data as any)?.lastHour ?? 0)) + 1000,
                    viewingsBooked: 327,
                    successRate: 94,
                    trustpilot: 4.7
                  }
                : undefined
            }
            onInteraction={(metric, type) =>
              track(eventTaxonomy.metricInteraction, { metric, type, variant: abVariant })
            }
          />
        </motion.div>

        <motion.div
          className={layoutStyles}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ staggerChildren: 0.1 }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <LiveActivityFeed
            events={useLiveData && liveEvents.length ? liveEvents : events}
            ariaId="trust-feed"
            autoCycleIntervalMs={cycleIntervalMs}
            useLiveData={useLiveData}
          />
          <div className="space-y-4">
            <TrustBadges showTrustpilot={showTrustpilot} />
            {showTrustpilot && (
              <Script
                id="trustpilot-script"
                strategy="lazyOnload"
                src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                onLoad={() => setWidgetReady(true)}
              />
            )}
          </div>
        </motion.div>
      </motion.section>
    </TrustBuilderErrorBoundaryWithAnalytics>
  );
}

export { LiveActivityFeed, TrustMetricsBar };

