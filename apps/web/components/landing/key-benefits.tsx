'use client';

import { motion } from 'framer-motion';
import { Zap, Bot, Home } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: '15-Second Alerts',
    description: 'Be first to apply with instant notifications when new properties match your criteria.',
  },
  {
    icon: Bot,
    title: 'AI Application Letters',
    description: 'Personalized letters generated in 29 languages. Save hours of writing time.',
  },
  {
    icon: Home,
    title: '1,500+ Sources',
    description: 'Monitor Funda, Pararius, and 1,000+ agency sites. Never miss a listing.',
  },
];

export function KeyBenefits() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
