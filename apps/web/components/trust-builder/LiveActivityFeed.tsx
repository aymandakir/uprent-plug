"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin, Clock, PauseCircle, PlayCircle } from "lucide-react";
import clsx from "clsx";
import { bookingEvents } from "./utils/mockData";
import { listItemVariants, reducedMotionTransition } from "./utils/animations";
import type { BookingEvent } from "../../types/trust-builder";

export interface LiveActivityFeedProps {
  events?: BookingEvent[];
  ariaId?: string;
  autoCycleIntervalMs?: number;
  useLiveData?: boolean;
}

const typeCopy: Record<BookingEvent["type"], string> = {
  viewing_booked: "booked a viewing",
  home_found: "found a home",
  application_sent: "sent an application"
};

const FALLBACK_INTERVAL = 4000;

function formatRelative(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 min ago";
  return `${minutes} min ago`;
}

function formatFull(timestamp: string) {
  return new Date(timestamp).toLocaleString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short"
  });
}

export default function LiveActivityFeed({
  events = bookingEvents,
  ariaId = "uprent-live-activity",
  autoCycleIntervalMs = FALLBACK_INTERVAL,
  useLiveData = false
}: LiveActivityFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pauseButtonRef = useRef<HTMLButtonElement>(null);
  const isInView = useInView(containerRef, { margin: "-10% 0px", amount: 0.35 });
  const prefersReducedMotion = useReducedMotion();
  const [items, setItems] = useState<BookingEvent[]>(() => events.slice(0, 8));
  const [cursor, setCursor] = useState(8);
  const [paused, setPaused] = useState(false);
  const [showFullTime, setShowFullTime] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const pool = useMemo(() => {
    const source = useLiveData && events.length ? events : bookingEvents;
    return source.length < 12 ? [...source, ...bookingEvents].slice(0, 24) : source;
  }, [events, useLiveData]);

  const cycle = useCallback(() => {
    if (prefersReducedMotion) return;
    setItems((current) => {
      const nextEvent = pool[cursor % pool.length];
      const nextList = [...current.slice(1), nextEvent];
      return nextList;
    });
    setCursor((c) => (c + 1) % pool.length);
  }, [cursor, pool, prefersReducedMotion]);

  useEffect(() => {
    if (paused || !isInView || prefersReducedMotion) return;
    const id = setInterval(cycle, autoCycleIntervalMs);
    return () => clearInterval(id);
  }, [cycle, paused, isInView, autoCycleIntervalMs, prefersReducedMotion]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const toggleHint = () => {
      setShowScrollHint(node.scrollHeight > node.clientHeight && node.scrollTop < 8);
    };
    toggleHint();
    node.addEventListener("scroll", toggleHint);
    window.addEventListener("resize", toggleHint);
    return () => {
      node.removeEventListener("scroll", toggleHint);
      window.removeEventListener("resize", toggleHint);
    };
  }, [items.length]);

  const handlePauseToggle = () => setPaused((p) => !p);

  return (
    <section
      ref={containerRef}
      aria-labelledby={`${ariaId}-label`}
      aria-live="polite"
      data-testid="live-activity-feed"
      className="relative h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p id={`${ariaId}-label`} className="text-sm uppercase tracking-[0.2em] text-secondary">
            Real-time social proof
          </p>
          <h2 className="text-xl font-bold text-neutral-900">Recent Uprent activity</h2>
        </div>
        <button
          ref={pauseButtonRef}
          onClick={handlePauseToggle}
          onKeyDown={(e) => e.key === " " && (e.preventDefault(), handlePauseToggle())}
          data-testid="pause-feed"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary hover:-translate-y-0.5 hover:shadow-md"
          aria-pressed={paused}
          aria-label={paused ? "Resume live activity feed" : "Pause live activity feed"}
        >
          {paused ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerEnter={() => setShowFullTime(true)}
        onPointerLeave={() => setShowFullTime(false)}
        onFocusCapture={() => pauseButtonRef.current?.focus()}
        ref={scrollRef}
        className={clsx(
          "relative max-h-[400px] overflow-y-auto rounded-2xl p-4 pr-2",
          "glass text-neutral-50",
          "scroll-smooth"
        )}
        style={{ willChange: "transform, opacity" }}
      >
        <AnimatePresence initial={false}>
          <ul className="space-y-3">
            {items.map((event, index) => (
              <motion.li
                key={`${event.user}-${event.timestamp}-${index}`}
                className={clsx(
                  "flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3",
                  "backdrop-blur-md shadow-sm hover:shadow-md transition",
                  "hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary/40"
                )}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={prefersReducedMotion ? 0 : index * 0.08}
                transition={prefersReducedMotion ? reducedMotionTransition : undefined}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 text-neutral-900 font-bold uppercase"
                  aria-hidden
                >
                  {event.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">
                    {event.user}{" "}
                    <span className="text-neutral-700">just {typeCopy[event.type]}</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2 py-1 text-neutral-800">
                      <MapPin size={12} />
                      {event.city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {showFullTime ? formatFull(event.timestamp) : formatRelative(event.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-50/90 via-neutral-50/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-50/70 via-neutral-50/30 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-neutral-50/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.08)]" />
        {showScrollHint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center text-xs text-neutral-600">
            <span className="rounded-full bg-white/70 px-3 py-1 shadow">Scroll to view more</span>
          </div>
        )}
      </div>
    </section>
  );
}

