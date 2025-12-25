'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Translation } from '@/lib/translations/en';

interface SocialProofProps {
  translations?: Translation['socialProof'];
}

export function SocialProof({ translations }: SocialProofProps = {}) {
  const defaultT = {
    title: 'Renters are finding homes faster with Uprent Plus',
    testimonials: [
      {
        quote: 'I found my apartment in 3 days after searching for 2 months',
        name: 'Sarah M.',
        role: 'Student',
        city: 'Amsterdam',
      },
      {
        quote: 'The AI letter generation saved me hours of writing applications',
        name: 'Marco R.',
        role: 'Software Engineer',
        city: 'Rotterdam',
      },
      {
        quote: 'Finally found a place that accepts pets thanks to the advanced filters',
        name: 'Linda K.',
        role: 'Designer',
        city: 'Utrecht',
      },
    ],
    metrics: {
      users: '10,000+ Active Users',
      listings: '50,000+ Listings Monitored',
      timeToFind: '3 Days Average Time to Find Rental',
    },
  };

  const t = translations || defaultT;
  
  const testimonials = t.testimonials.map((testimonial, index) => ({
    ...testimonial,
    image: ['👩‍💼', '👨‍💻', '👩‍🎓'][index] || '👤',
  }));

  const metrics = [
    { label: t.metrics.users.split(' ')[0], sublabel: t.metrics.users.split(' ').slice(1).join(' ') },
    { label: t.metrics.listings.split(' ')[0], sublabel: t.metrics.listings.split(' ').slice(1).join(' ') },
    { label: t.metrics.timeToFind.split(' ').slice(0, 2).join(' '), sublabel: t.metrics.timeToFind.split(' ').slice(2).join(' ') },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
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

        {/* Testimonials */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
              className={`rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 animate-on-scroll ${
                index === currentTestimonial
                  ? 'ring-2 ring-blue-500 scale-105'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-4xl">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.city}</p>
                </div>
              </div>
              <p className="text-gray-700">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>

        {/* Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid gap-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 md:grid-cols-3 animate-on-scroll"
        >
          {metrics.map((metric, index) => (
            <div key={metric.label} className="text-center text-white">
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                className="mb-2 text-4xl font-bold md:text-5xl"
              >
                {metric.label}
              </motion.p>
              <p className="text-blue-100">{metric.sublabel}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
