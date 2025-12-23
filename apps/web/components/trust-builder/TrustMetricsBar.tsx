"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Calendar, Home, Star, TrendingUp } from "lucide-react";
import clsx from "clsx";
import { metricVariants, iconPulse } from "./utils/animations";
import PropTypes from "prop-types";

type MetricKey = "homesFound" | "viewingsBooked" | "successRate" | "trustpilot";

export interface TrustMetricsBarProps {
  initialValues?: Partial<Record<MetricKey, number>>;
  onInteraction?: (metric: MetricKey, type: "hover" | "click") => void;
  className?: string;
}

interface MetricConfig {
  key: MetricKey;
  label: string;
  baseValue: number;
  icon: JSX.Element;
  format?: (value: number) => string;
  increment?: number;
  intervalMs?: number;
}

const numberFmt = new Intl.NumberFormat("nl-NL");
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function useCountUp({
  end,
  duration = 2500,
  start = 0,
  shouldStart = false,
  onUpdate
}: {
  start?: number;
  end: number;
  duration?: number;
  shouldStart?: boolean;
  onUpdate?: (value: number) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(start);
  const startRef = useRef<number>(start);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!shouldStart) return;
    startRef.current = prefersReducedMotion ? end : start;
    setValue(startRef.current);
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const eased = prefersReducedMotion
        ? 1
        : progress === 1
          ? 1
          : 1 - Math.pow(2, -10 * progress);
      const next = Math.floor(start + (end - start) * eased);
      setValue(next);
      onUpdate?.(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      startTimeRef.current = undefined;
    };
  }, [start, end, duration, shouldStart, prefersReducedMotion, onUpdate]);

  return value;
}

const metricsConfig: MetricConfig[] = [
  {
    key: "homesFound",
    label: "Homes Found Today",
    baseValue: 1247,
    icon: <Home className="text-primary" strokeWidth={2.5} />
  },
  {
    key: "viewingsBooked",
    label: "Viewings Booked This Week",
    baseValue: 327,
    icon: <Calendar className="text-secondary" strokeWidth={2.5} />
  },
  {
    key: "successRate",
    label: "Success Rate",
    baseValue: 94,
    icon: <TrendingUp className="text-primary" strokeWidth={2.5} />,
    format: (v) => `${v}%`
  },
  {
    key: "trustpilot",
    label: "Trustpilot Score",
    baseValue: 4.7,
    icon: <Star className="text-accent" strokeWidth={2.5} />,
    format: (v) => `${v.toFixed(1)}/5 • 39 reviews`
  }
];

function MetricCard({
  config,
  value,
  onInteraction
}: {
  config: MetricConfig;
  value: number;
  onInteraction?: (metric: MetricKey, type: "hover" | "click") => void;
}) {
  const formatted = config.format?.(value) ?? numberFmt.format(value);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      data-testid={`metric-${config.key}`}
      className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-5 shadow-glow transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
      variants={metricVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ y: -4, boxShadow: "0 20px 45px -18px rgba(78, 205, 196, 0.35)" }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => onInteraction?.(config.key, "hover")}
      onPointerDown={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onClick={() => onInteraction?.(config.key, "click")}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mb-3 flex items-center justify-between">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: prefersReducedMotion ? 0 : [0, 5, 0] }}
          transition={{ ...iconPulse, delay: 0.1 }}
          className="rounded-full bg-white/80 p-2 group-hover:rotate-[5deg]"
        >
          {config.icon}
        </motion.div>
        {config.key === "successRate" && (
          <span className="inline-flex items-center text-xs font-semibold text-primary">
            ↑ steady growth
          </span>
        )}
      </div>
      <div className="text-4xl font-bold text-gradient-brand leading-tight">{formatted}</div>
      <p className="mt-2 text-sm text-neutral-600">{config.label}</p>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/60 via-secondary/60 to-accent/60 opacity-0 transition group-hover:opacity-100" />
      {ripple && !prefersReducedMotion && (
        <span
          className="pointer-events-none absolute block h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-md animate-[ripple_0.6s_ease-out]"
          style={{ left: ripple.x, top: ripple.y }}
          onAnimationEnd={() => setRipple(null)}
        />
      )}
    </motion.div>
  );
}

function MetricCardWithCount({
  metric,
  shouldStart,
  onInteraction,
  liveIncrement
}: {
  metric: MetricConfig;
  shouldStart: boolean;
  onInteraction?: (metric: MetricKey, type: "hover" | "click") => void;
  liveIncrement: number;
}) {
  const [liveValue, setLiveValue] = useState(metric.baseValue);
  const count = useCountUp({
    start: Math.max(0, metric.baseValue - 40),
    end: metric.baseValue,
    shouldStart
  });

  useEffect(() => {
    if (liveIncrement === 0 || !shouldStart) return;
    const id = setInterval(() => {
      setLiveValue((v) => v + liveIncrement);
    }, 10000);
    return () => clearInterval(id);
  }, [liveIncrement, shouldStart]);

  const value =
    metric.key === "trustpilot" ? Number(metric.baseValue.toFixed(1)) : Math.max(count, liveValue);

  return <MetricCard config={metric} value={value} onInteraction={onInteraction} />;
}

function TrustMetricsBarComponent({ initialValues, onInteraction, className }: TrustMetricsBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setReady(true), 200);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  const values = useMemo(() => {
    return metricsConfig.map((metric) => {
      const candidate = initialValues?.[metric.key];
      const startValue = isFiniteNumber(candidate) ? candidate : metric.baseValue;
      if (startValue > 100_000) {
        console.warn(`Metric ${metric.key} value unusually high: ${startValue}`);
      }
      const liveIncrement =
        metric.key === "homesFound" ? 3 : metric.key === "viewingsBooked" ? 1 : 0;
      return { ...metric, baseValue: startValue, liveIncrement };
    });
  }, [initialValues]);

  return (
    <div ref={ref} className={clsx("w-full", className)} data-testid="trust-metrics-bar">
      {!ready && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((metric) => (
            <div
              key={metric.key}
              className="h-32 rounded-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] animate-[shimmer_1.6s_infinite]"
              aria-label="Loading metric"
            />
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((metric) => (
          <MetricCardWithCount
            key={metric.key}
            metric={metric}
            liveIncrement={metric.liveIncrement}
            shouldStart={ready && inView}
            onInteraction={onInteraction}
          />
        ))}
      </div>
    </div>
  );
}

export const TrustMetricsBar = memo(TrustMetricsBarComponent);

TrustMetricsBarComponent.propTypes = {
  initialValues: PropTypes.object,
  onInteraction: PropTypes.func,
  className: PropTypes.string
};

export default TrustMetricsBar;

