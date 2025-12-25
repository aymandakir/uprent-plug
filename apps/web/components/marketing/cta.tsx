"use client";

import Link from "next/link";

export function CTA() {
  return (
    <section className="bg-gradient-to-r from-brand-400 to-accent-400 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Ready to be 15x faster than the crowd?</h2>
        <p className="text-lg text-white/90">
          Join Uprent Plus and get your first viewing within 7 days—or your next month is 50% off.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="rounded-full bg-white px-6 py-3 font-semibold text-brand-500 shadow-lg transition hover:-translate-y-0.5"
          >
            Start Free Trial
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

