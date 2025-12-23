"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        autoPlay
        muted
        loop
        playsInline
        poster="/video-poster.jpg"
      >
        <source src="/amsterdam-timelapse.mp4" type="video/mp4" />
      </video>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50 opacity-70" />

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 h-72 w-72 rounded-full bg-brand-200 mix-blend-multiply blur-xl opacity-70"
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent-200 mix-blend-multiply blur-xl opacity-70"
          animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-brand-400" />
          <span className="text-sm font-semibold text-brand-600">
            #1 Fastest Rental Finder in Netherlands
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-7xl"
        >
          Find Your Dream Home in{" "}
          <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
            6 Days, Not 6 Months
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-xl text-gray-600 md:text-2xl"
        >
          AI monitors <strong className="text-brand-500">1,500+ sources</strong>. Get alerts in{" "}
          <strong className="text-accent-500">15 seconds</strong>. Join{" "}
          <strong>12,400+ successful renters</strong>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-400 px-8 py-4 text-lg font-semibold text-white shadow-glow transition-all duration-200 hover:scale-105 hover:bg-brand-500 hover:shadow-xl"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => setShowVideo(true)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-200 hover:border-brand-300 hover:bg-gray-50"
          >
            <Play className="h-5 w-5" />
            Watch 60s Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
        >
          {["No credit card required", "7-day free trial", "Cancel anytime"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-gray-900">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

