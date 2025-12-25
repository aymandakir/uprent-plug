'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does the 15-second alert work?',
    answer:
      'Our AI monitors 1,500+ rental sources continuously. When a new listing matches your criteria, you receive an instant notification via push, email, or SMS—usually within 15 seconds of the listing going live.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use bank-level encryption, never share your data with third parties, and comply with GDPR. Your search criteria and personal information are completely private.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      "Yes! All plans can be cancelled at any time with no penalties. You'll continue to have access until the end of your billing period.",
  },
  {
    question: 'Do you support English?',
    answer:
      'Yes, RentFusion is fully available in English. Our AI letter generator supports 29 languages, including Dutch, English, Spanish, French, German, and more.',
  },
  {
    question: 'What sources do you monitor?',
    answer:
      'We monitor major platforms like Funda, Pararius, and Kamernet, plus 1,000+ agency websites and property portals across the Netherlands. We add new sources regularly.',
  },
  {
    question: 'How does the AI letter generator work?',
    answer:
      'Simply select a property and click "Generate Letter". Our AI creates a personalized, professional application letter in your chosen language, tailored to the property details. You can edit it before sending.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
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
                    transition={{ duration: 0.2 }}
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
