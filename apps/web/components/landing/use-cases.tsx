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

        {/* Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {t.tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`rounded-lg px-6 py-3 font-display font-medium text-body transition-all duration-200 ${
                activeTab === index
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10'
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
            <div className="card p-8 md:p-12">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-lg bg-white/10 border border-white/20 p-4 text-white">
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-h3 font-heading font-bold text-white">{activeCase.label}</h3>
                  <p className="text-body-sm text-white/70">{activeCase.highlight}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-body-lg font-medium text-accent-red">❌ {activeCase.title}</p>
                  <p className="text-body-lg text-white/90">✅ {activeCase.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
