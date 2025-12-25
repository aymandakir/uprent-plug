'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Translation } from '@/lib/translations/en';

interface HeroSectionProps {
  translations?: Translation['hero'];
}

export function HeroSection({ translations }: HeroSectionProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Default translations (English) if not provided
  const t = translations || {
    badge: 'Built for Uprent 🚀',
    title: 'Find Your Dutch Rental in 15 Seconds',
    subtitle: 'AI-powered alerts for 1,500+ sources. Never miss a listing again.',
    cta: {
      primary: 'Start Free Trial',
      secondary: 'Watch Demo',
    },
    trustBadge: 'Trusted by 10,000+ renters 🇳🇱',
    searchPlaceholder: 'Search Amsterdam, Rotterdam, Utrecht...',
  };

  const searchSuggestions = [
    'Amsterdam Centrum',
    'Rotterdam Kralingen',
    'Utrecht Oud-Zuid',
    'Den Haag Centrum',
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden gradient-hero">
      <div className="relative z-10 mx-auto max-w-content px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm"
        >
          <span className="text-caption font-medium text-white/80 uppercase tracking-wider">
            {t.trustBadge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 font-heading font-bold text-white text-hero md:text-[64px] lg:text-[72px]"
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-12 max-w-narrow text-body-lg text-white/80 md:text-xl"
        >
          {t.subtitle}
        </motion.p>

        {/* Interactive Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mb-12 max-w-2xl"
        >
          <div className="relative">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Search className="h-5 w-5 text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="input flex-1 border-0 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-0 focus:scale-100"
              />
            </div>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-white/10 bg-neutral-900 p-2 shadow-glow"
              >
                {searchSuggestions
                  .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="w-full rounded-lg px-4 py-3 text-left text-white/80 hover:bg-white/5 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 flex flex-col items-center justify-center gap-4"
        >
          <Link href="/register" className="btn-primary group inline-flex items-center gap-2">
            {t.cta.primary}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
