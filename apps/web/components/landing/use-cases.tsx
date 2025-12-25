'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GraduationCap, Globe, Users } from 'lucide-react';
import type { Translation } from '@/lib/translations/en';

interface UseCasesProps {
  translations?: Translation['useCases'];
}

const iconMap = {
  'For Students': GraduationCap,
  'For Expats': Globe,
  'For Families': Users,
} as const;

export function UseCases({ translations }: UseCasesProps = {}) {
  const defaultT = {
    title: 'Built for every renter',
    tabs: [
      {
        label: 'For Students',
        title: 'Overwhelmed searching 50+ sites daily?',
        description: 'Set criteria once. We alert you instantly.',
        highlight: '€14.99/month student plan',
      },
      {
        label: 'For Expats',
        title: "Need Dutch application letters but don't speak the language?",
        description: 'AI writes perfect letters in Dutch, English, or 27 other languages',
        highlight: 'Multi-language support',
      },
      {
        label: 'For Families',
        title: 'Need 3+ bedrooms in good school districts?',
        description: 'Advanced filters + neighborhood insights',
        highlight: 'Family-friendly search criteria',
      },
    ],
  };

  const t = translations || defaultT;
  const [activeTab, setActiveTab] = useState(0);

  const activeCase = t.tabs[activeTab];
  const Icon = iconMap[activeCase.label as keyof typeof iconMap] || GraduationCap;

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

        {/* Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {t.tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`rounded-full px-6 py-3 font-semibold transition-all duration-200 ${
                activeTab === index
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 shadow-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{activeCase.label}</h3>
                  <p className="text-gray-600">{activeCase.highlight}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-lg font-semibold text-red-600">❌ {activeCase.title}</p>
                  <p className="text-xl text-gray-700">✅ {activeCase.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
