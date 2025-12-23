"use client";

export function FAQ() {
  const faqs = [
    { q: "Do I need a credit card for the trial?", a: "No. Start free, no card required." },
    { q: "Is the data real-time?", a: "Yes. We monitor 1,500+ sources continuously and refresh every few seconds." },
    { q: "Can I cancel anytime?", a: "Absolutely. Cancel in one click in your dashboard." }
  ];
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">FAQs</h2>
          <p className="text-lg text-gray-600">Quick answers before you join.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <summary className="cursor-pointer text-lg font-semibold text-gray-900">{item.q}</summary>
              <p className="mt-2 text-gray-700">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

