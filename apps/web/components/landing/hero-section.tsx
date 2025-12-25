'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const searchSuggestions = [
    'Amsterdam Centrum',
    'Rotterdam Kralingen',
    'Utrecht Oud-Zuid',
    'Den Haag Centrum',
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 h-96 w-96 rounded-full bg-blue-400/30 mix-blend-multiply blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-400/30 mix-blend-multiply blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
        >
          <span className="text-sm font-semibold text-white">
            Trusted by 10,000+ renters 🇳🇱
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl"
        >
          Find Your Dutch Rental in 15 Seconds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-xl text-blue-50 md:text-2xl"
        >
          AI-powered alerts for 1,500+ sources. Never miss a listing again.
        </motion.p>

        {/* Interactive Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mb-12 max-w-2xl"
        >
          <div className="relative">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-2xl">
              <Search className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Amsterdam, Rotterdam, Utrecht..."
                className="flex-1 border-0 bg-transparent text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-white p-2 shadow-xl"
              >
                {searchSuggestions
                  .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="w-full rounded-lg px-4 py-3 text-left hover:bg-gray-50"
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
          className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-3xl"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => setShowVideo(true)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/50"
          >
            <Play className="h-5 w-5" />
            Watch Demo
          </button>
        </motion.div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
