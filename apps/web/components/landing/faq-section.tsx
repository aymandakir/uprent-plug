'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Translation } from '@/lib/translations/en';

interface FAQSectionProps {
  translations?: Translation['faq'];
}

export function FAQSection({ translations }: FAQSectionProps = {}) {
  const defaultT = {
    title: 'Frequently asked questions',
    items: [
      {
        question: 'How does the 15-second alert work?',
        answer:
          'We monitor 1,500+ sources every 15 seconds and instantly notify you when a property matching your criteria is listed.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Yes. We use bank-level encryption (AES-256) and are GDPR compliant. Your data is never shared with third parties.',
      },
      {
        question: 'Can I cancel anytime?',
        answer: 'Absolutely. Cancel anytime with one click. No questions asked, no hidden fees.',
      },
      {
        question: 'Do you support English?',
        answer:
          'Yes! The platform is available in 29 languages including English, Dutch, German, and more.',
      },
      {
        question: 'What sources do you monitor?',
        answer:
          'We monitor Funda, Pararius, Kamernet, Facebook groups, and 1,000+ local agency websites across the Netherlands.',
      },
      {
        question: 'How does the AI letter generator work?',
        answer:
          'Our AI analyzes the property listing and your profile to generate personalized, professional application letters in your chosen language within seconds.',
      },
    ],
  };

  const t = translations || defaultT;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
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

        <div className="space-y-4">
          {t.items.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white animate-on-scroll"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-700">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
