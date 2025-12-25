'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bell, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Translation } from '@/lib/translations/en';

interface InteractiveDemoProps {
  translations?: Translation['interactiveDemo'];
}

const mockProperties = [
  {
    id: 1,
    title: 'Modern 2BR Apartment in Amsterdam Centrum',
    price: 1850,
    city: 'Amsterdam',
    bedrooms: 2,
    area: 65,
  },
  {
    id: 2,
    title: 'Cozy Studio Near UvA Campus',
    price: 1200,
    city: 'Amsterdam',
    bedrooms: 1,
    area: 35,
  },
  {
    id: 3,
    title: 'Family Home in Utrecht Oud-Zuid',
    price: 2200,
    city: 'Utrecht',
    bedrooms: 3,
    area: 95,
  },
];

export function InteractiveDemo({ translations }: InteractiveDemoProps = {}) {
  const defaultT = {
    title: 'See Uprent Plus in action',
    subtitle: 'Real-time property feed showing new listings',
    notification: 'New match in {city}!',
    cta: 'Generate AI Letter',
    live: 'Live',
  };

  const t = translations || defaultT;
  
  const [currentProperty, setCurrentProperty] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProperty((prev) => (prev + 1) % mockProperties.length);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 4000);

    // Show initial notification after 2 seconds
    setTimeout(() => setShowNotification(true), 2000);
    setTimeout(() => setShowNotification(false), 5000);

    return () => clearInterval(interval);
  }, []);

  const property = mockProperties[currentProperty];

  return (
    <section className="relative bg-black py-24 md:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-12 text-center animate-on-scroll"
        >
          <h2 className="mb-4 text-h2 font-heading font-bold text-white">
            {t.title}
          </h2>
          <p className="text-body-lg text-white/70">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          {/* Property Feed Card */}
          <div className="card">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-h3 font-heading font-semibold text-white">Property Feed</h3>
              <div className="flex items-center gap-2 text-body-sm text-electric-blue">
                <div className="h-2 w-2 animate-pulse rounded-full bg-electric-blue"></div>
                {t.live}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="text-h4 font-heading font-semibold text-white">{property.title}</h4>
                      <p className="text-body-sm text-white/60">{property.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-heading font-bold text-white">€{property.price}</p>
                      <p className="text-body-sm text-white/50">/month</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 text-body-sm text-white/70">
                    <span>🛏️ {property.bedrooms} bedrooms</span>
                    <span>📐 {property.area}m²</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => setShowLetterModal(true)}
              className="mt-6 w-full btn-primary flex items-center justify-center gap-2"
            >
              <FileText className="h-5 w-5" />
              {t.cta}
            </button>
          </div>

          {/* Notification Badge */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 100, y: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-0 top-0 rounded-lg border border-white/20 bg-electric-blue p-4 shadow-glow"
              >
                <div className="flex items-center gap-3 text-white">
                  <Bell className="h-5 w-5" />
                  <div>
                    <p className="text-body-sm font-medium">{t.notification.replace('{city}', property.city)}</p>
                    <p className="text-caption text-white/70">€{property.price}/month</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          className="mt-12 text-center animate-on-scroll"
        >
          <Link href="/register" className="btn-primary inline-flex items-center gap-2">
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>

      {/* Letter Modal */}
      {showLetterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          onClick={() => setShowLetterModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-h3 font-heading font-bold text-white">AI Generated Letter</h3>
            <div className="mb-6 max-h-96 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-6">
              <p className="text-body text-white/80">
                Dear Landlord,
                <br />
                <br />
                I am writing to express my strong interest in the {property.title} located in{' '}
                {property.city}. With my stable income and excellent rental history, I am confident
                that I would be an ideal tenant for your property.
                <br />
                <br />
                I am particularly drawn to this apartment because of its excellent location and the
                modern amenities it offers. I am a responsible professional who takes great pride in
                maintaining my living space and respecting my neighbors.
                <br />
                <br />
                I would be delighted to schedule a viewing at your earliest convenience. Thank you
                for considering my application.
                <br />
                <br />
                Sincerely,
                <br />
                [Your Name]
              </p>
            </div>
            <button
              onClick={() => setShowLetterModal(false)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
