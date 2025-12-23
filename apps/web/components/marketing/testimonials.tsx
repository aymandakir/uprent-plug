"use client";

export function Testimonials() {
  const items = [
    { name: "Sophie, Utrecht", quote: "Got a viewing in 12 minutes after listing went live." },
    { name: "Lars, Amsterdam", quote: "AI letter got me 3 replies in one afternoon." },
    { name: "Emma, Rotterdam", quote: "Contract review spotted hidden fees—saved me €600." }
  ];
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Loved by fast movers</h2>
          <p className="text-lg text-gray-600">Real renters, real wins.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.name} className="rounded-2xl border border-white/60 bg-white p-5 shadow-sm">
              <p className="text-gray-700">“{item.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-gray-900">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

