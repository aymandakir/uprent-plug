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
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-content px-6">
        {t.title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-16 text-center text-h2 font-heading font-bold text-white animate-on-scroll"
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
                className="card group animate-on-scroll"
              >
                <div className="mb-6 inline-flex rounded-lg bg-white/5 p-3 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black border border-white/10 group-hover:border-white/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-h3 font-heading font-semibold text-white">{benefit.title}</h3>
                <p className="text-body text-white/70">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
