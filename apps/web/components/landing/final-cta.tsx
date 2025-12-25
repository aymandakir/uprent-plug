'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import type { Translation } from '@/lib/translations/en';

interface FinalCTAProps {
  translations?: Translation['finalCta'];
}

export function FinalCTA({ translations }: FinalCTAProps = {}) {
  const defaultT = {
    title: 'Ready to find your home?',
    subtitle: 'Join 10,000+ renters who found their place faster',
    cta: 'Visit Uprent.nl',
    demoLink: 'Try Uprent Plus Demo',
    disclaimer: 'No credit card required - 7-day trial - Cancel anytime',
  };

  const t = translations || defaultT;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 text-4xl font-bold text-white md:text-5xl animate-on-scroll"
        >
          {t.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="mb-8 text-xl text-blue-100 animate-on-scroll"
        >
          {t.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="mb-8 flex flex-col items-center gap-4 animate-on-scroll"
        >
          <Link
            href="https://uprent.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-3xl"
          >
            {t.cta}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/register"
            className="text-sm text-blue-100 hover:text-white underline"
          >
            {t.demoLink}
          </Link>
        </motion.div>

        {t.disclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100 animate-on-scroll"
          >
            {t.disclaimer.split(' - ').map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
