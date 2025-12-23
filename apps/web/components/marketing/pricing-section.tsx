"use client";

import Link from "next/link";

const plans = [
  {
    tier: "Free Trial",
    price: "€0",
    detail: "7 days, no card",
    perks: ["1 search profile", "Email only", "100 properties/week", "Manual applications"]
  },
  {
    tier: "Basic",
    price: "€14.99",
    detail: "Most popular",
    perks: [
      "3 search profiles",
      "Email + Push",
      "Unlimited properties",
      "AI letters (5/mo)",
      "Family sharing (3)",
      "15s alerts",
      "No ads"
    ]
  },
  {
    tier: "Premium",
    price: "€24.99",
    detail: "Fastest path to keys",
    perks: [
      "5 search profiles",
      "Email + Push + SMS + Telegram",
      "Unlimited AI letters",
      "Contract AI review + human check",
      "Priority scraping (10s)",
      "Family sharing (5)",
      "Viewing scheduler",
      "Dedicated support"
    ]
  }
];

export function PricingSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Pricing that beats them all</h2>
          <p className="text-lg text-gray-600">Simple, fair, and faster.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className="rounded-2xl border border-white/10 bg-white/70 p-6 shadow-xl backdrop-blur"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-secondary">{plan.tier}</p>
              <p className="mt-2 text-4xl font-bold">
                {plan.price}
                <span className="text-lg font-semibold text-gray-400">/mo</span>
              </p>
              <p className="text-gray-600">{plan.detail}</p>
              <ul className="mt-4 space-y-2 text-gray-800">
                {plan.perks.map((perk) => (
                  <li key={perk}>✓ {perk}</li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-6 inline-flex w-full justify-center rounded-full bg-brand-400 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-500"
              >
                Choose {plan.tier}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

