'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GraduationCap, Globe, Users } from 'lucide-react';

const useCases = [
  {
    id: 'students',
    icon: GraduationCap,
    label: 'FOR STUDENTS',
    pain: 'Overwhelmed searching 50+ sites daily?',
    solution: 'Set criteria once. We alert you instantly.',
    highlight: '€14.99/month student plan',
    color: 'blue',
  },
  {
    id: 'expats',
    icon: Globe,
    label: 'FOR EXPATS',
    pain: "Need Dutch application letters but don't speak the language?",
    solution: 'AI writes perfect letters in Dutch, English, or 27 other languages',
    highlight: 'Multi-language support',
    color: 'green',
  },
  {
    id: 'families',
    icon: Users,
    label: 'FOR FAMILIES',
    pain: 'Need 3+ bedrooms in good school districts?',
    solution: 'Advanced filters + neighborhood insights',
    highlight: 'Family-friendly search criteria',
    color: 'purple',
  },
];

export function UseCases() {
  const [activeTab, setActiveTab] = useState('students');

  const activeCase = useCases.find((uc) => uc.id === activeTab) || useCases[0];
  const Icon = activeCase.icon;

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Built for everyone looking for a home
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => setActiveTab(useCase.id)}
              className={`rounded-full px-6 py-3 font-semibold transition-all duration-200 ${
                activeTab === useCase.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {useCase.label}
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
            transition={{ duration: 0.3 }}
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
                  <p className="mb-2 text-lg font-semibold text-red-600">❌ {activeCase.pain}</p>
                  <p className="text-xl text-gray-700">✅ {activeCase.solution}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
