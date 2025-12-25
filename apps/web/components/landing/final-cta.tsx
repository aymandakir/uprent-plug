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
    <section className="relative overflow-hidden bg-neutral-900 py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-narrow px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 text-h2 font-heading font-bold text-white animate-on-scroll"
        >
          {t.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="mb-12 text-body-lg text-white/70 animate-on-scroll"
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
            className="btn-primary inline-flex items-center gap-2"
          >
            {t.cta}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/register"
            className="text-body-sm text-white/60 hover:text-white underline transition-colors"
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
            className="flex flex-wrap items-center justify-center gap-6 text-body-sm text-white/60 animate-on-scroll"
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
