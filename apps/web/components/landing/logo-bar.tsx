'use client';

import { motion } from 'framer-motion';

const universities = [
  { name: 'UvA', logo: '🏛️' },
  { name: 'TU Delft', logo: '🔬' },
  { name: 'Erasmus', logo: '📚' },
  { name: 'Leiden', logo: '🎓' },
  { name: 'Utrecht', logo: '✨' },
];

export function LogoBar() {
  return (
    <section className="border-b border-gray-200 bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-sm font-medium text-gray-600">
          Trusted by students and professionals at:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {universities.map((uni, index) => (
            <motion.div
              key={uni.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
            >
              <div className="text-4xl grayscale transition-all duration-300 hover:grayscale-0">
                {uni.logo}
              </div>
              <span className="text-sm font-semibold text-gray-700">{uni.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
