'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Bell,
  FileText,
  Shield,
  MapPin,
  User,
} from 'lucide-react';
import type { Translation } from '@/lib/translations/en';

interface FeaturesGridProps {
  translations?: Translation['features'];
}

const iconMap = {
  'Real-time monitoring': Activity,
  'Push notifications': Bell,
  'AI letter generation': FileText,
  'Contract review': Shield,
  'Neighborhood insights': MapPin,
  'Multi-profile management': User,
} as const;

export function FeaturesGrid({ translations }: FeaturesGridProps = {}) {
  const defaultT = {
    title: 'Everything you need to win the Dutch rental market',
    items: [
      {
        title: 'Real-time monitoring',
        description: 'Instant alerts for new listings',
      },
      {
        title: 'Push notifications',
        description: 'iOS & Android mobile alerts',
      },
      {
        title: 'AI letter generation',
        description: 'Personalized applications in seconds',
      },
      {
        title: 'Contract review',
        description: 'AI-powered lease analysis (Premium)',
      },
      {
        title: 'Neighborhood insights',
        description: 'Schools, transport, safety ratings',
      },
      {
        title: 'Multi-profile management',
        description: 'Search for multiple people or properties',
      },
    ],
  };

  const t = translations || defaultT;

  return (
    <section className="bg-black py-24 md:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16 text-center animate-on-scroll"
        >
          <h2 className="text-h2 font-heading font-bold text-white">
            {t.title}
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {t.items.map((feature, index) => {
            const Icon = iconMap[feature.title as keyof typeof iconMap] || Activity;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                className="card group animate-on-scroll"
              >
                <div className="mb-6 inline-flex rounded-lg bg-white/5 p-3 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black border border-white/10 group-hover:border-white/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-h4 font-heading font-semibold text-white">{feature.title}</h3>
                <p className="text-body text-white/70">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
