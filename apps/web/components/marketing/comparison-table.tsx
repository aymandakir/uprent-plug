"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { name: "Sources Monitored", uprentPlus: "1,500+", findify: "500+", rentbird: "300+", rentslam: "1,000+" },
  { name: "Alert Speed", uprentPlus: "15 sec", findify: "30 sec", rentbird: "60 sec", rentslam: "30 sec" },
  { name: "AI Application Letters", uprentPlus: true, findify: true, rentbird: false, rentslam: true },
  { name: "Contract AI Review", uprentPlus: true, findify: false, rentbird: true, rentslam: false },
  { name: "iOS/Android Apps", uprentPlus: true, findify: false, rentbird: false, rentslam: false },
  { name: "Family Sharing", uprentPlus: "5 members", findify: "3 members", rentbird: false, rentslam: false },
  { name: "Search Profiles", uprentPlus: "5", findify: "2", rentbird: "1", rentslam: "4" },
  { name: "Monthly Price", uprentPlus: "€14.99", findify: "€19.99", rentbird: "€29.99", rentslam: "€19.98" },
  { name: "Money-back Guarantee", uprentPlus: "7 days", findify: "3 days", rentbird: "14 days", rentslam: "14 days" }
];

export function ComparisonTable() {
  const renderCell = (value: string | boolean, highlight = false) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className={`mx-auto h-6 w-6 ${highlight ? "text-green-500" : "text-gray-400"}`} />
      ) : (
        <X className={`mx-auto h-6 w-6 ${highlight ? "text-red-400" : "text-gray-300"}`} />
      );
    }
    return <span className={highlight ? "font-bold text-brand-600" : ""}>{value}</span>;
  };

  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Why Uprent Plus Beats the Competition
          </h2>
          <p className="text-xl text-gray-600">We took the best from each competitor and made it better.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full overflow-hidden rounded-2xl bg-white shadow-xl">
            <thead>
              <tr className="bg-gradient-to-r from-brand-400 to-accent-400 text-white">
                <th className="px-6 py-4 text-left font-semibold">Feature</th>
                <th className="px-6 py-4 text-center font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    Uprent Plus <span className="rounded-full bg-white/20 px-2 py-1 text-xs">YOU</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center font-semibold">Findify</th>
                <th className="px-6 py-4 text-center font-semibold">Rentbird</th>
                <th className="px-6 py-4 text-center font-semibold">RentSlam</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <motion.tr
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{feature.name}</td>
                  <td className="bg-brand-50 px-6 py-4 text-center">{renderCell(feature.uprentPlus, true)}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{renderCell(feature.findify)}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{renderCell(feature.rentbird)}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{renderCell(feature.rentslam)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-8 py-4 text-lg font-semibold text-white shadow-glow transition-all duration-200 hover:scale-105 hover:bg-brand-500"
          >
            Start Your Free Trial
          </a>
        </div>
      </div>
    </section>
  );
}

