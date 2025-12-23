"use client";

export function FeaturesGrid() {
  const items = [
    { title: "15-second alerts", desc: "AI monitors 1,500+ sources and pings you instantly." },
    { title: "AI letters", desc: "Personalized Dutch/English letters that triple response rates." },
    { title: "Contract AI review", desc: "Flag unfair clauses with GPT+human experts." },
    { title: "Mobile + web", desc: "iOS, Android, and web—stay synced everywhere." }
  ];
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Built to convert faster</h2>
          <p className="text-lg text-gray-600">Everything you need to beat the queue.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

