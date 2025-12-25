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
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-12 text-center animate-on-scroll"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
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
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl animate-on-scroll"
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
