'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Sophie van der Berg',
    role: 'Marketing Manager',
    city: 'Amsterdam',
    quote: 'I found my apartment in 3 days after searching for 2 months. RentFusion is a game-changer!',
    image: '👩‍💼',
  },
  {
    name: 'James Wilson',
    role: 'Software Engineer',
    city: 'Rotterdam',
    quote: 'The AI letter generator saved me so much time. Got 3 viewings in the first week!',
    image: '👨‍💻',
  },
  {
    name: 'Emma de Vries',
    role: 'Student',
    city: 'Utrecht',
    quote: 'As an international student, finding housing was overwhelming. RentFusion made it easy.',
    image: '👩‍🎓',
  },
];

const metrics = [
  { label: '10,000+', sublabel: 'Active Users' },
  { label: '50,000+', sublabel: 'Listings Monitored' },
  { label: '3 Days', sublabel: 'Average Time to Find Rental' },
];

export function SocialProof() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Renters are finding homes faster with RentFusion
          </h2>
        </motion.div>

        {/* Testimonials */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 ${
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 md:grid-cols-3"
        >
          {metrics.map((metric, index) => (
            <div key={metric.label} className="text-center text-white">
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
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
