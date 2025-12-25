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
    <section className="bg-black py-24 md:py-32">
      <div className="mx-auto max-w-narrow px-6">
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

        <div className="space-y-3">
          {t.items.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
              className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900 transition-all duration-200 hover:border-white/20 animate-on-scroll"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left transition-all duration-200 hover:bg-white/5 active:bg-white/10"
              >
                <span className="pr-8 text-body-lg font-medium text-white leading-relaxed">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-white/60 transition-transform duration-300 ease-out ${
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
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-body text-white/70 leading-relaxed">{faq.answer}</div>
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
