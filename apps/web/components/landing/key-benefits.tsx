'use client';

import { motion } from 'framer-motion';
import { Zap, Bot, Home } from 'lucide-react';
import type { Translation } from '@/lib/translations/en';

interface KeyBenefitsProps {
  translations?: Translation['keyBenefits'];
}

const iconMap = {
  '⚡': Zap,
  '🤖': Bot,
  '🏠': Home,
};

export function KeyBenefits({ translations }: KeyBenefitsProps = {}) {
  const defaultT = {
    title: 'Why Uprent Plus',
    items: [
      {
        icon: '⚡',
        title: '15-Second Alerts',
        description: 'Be first to apply with instant notifications',
      },
      {
        icon: '🤖',
        title: 'AI Application Letters',
        description: 'Personalized letters in 29 languages',
      },
      {
        icon: '🏠',
        title: '1,500+ Sources',
        description: 'Funda, Pararius, and 1,000+ agency sites',
      },
    ],
  };

  const t = translations || defaultT;

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {t.title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-12 text-center text-4xl font-bold text-gray-900 md:text-5xl animate-on-scroll"
          >
            {t.title}
          </motion.h2>
        )}
        <div className="grid gap-8 md:grid-cols-3">
          {t.items.map((benefit, index) => {
            const Icon = iconMap[benefit.icon as keyof typeof iconMap] || Zap;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl animate-on-scroll"
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
