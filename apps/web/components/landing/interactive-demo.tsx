'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bell, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

export function InteractiveDemo() {
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
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            See RentFusion in action
          </h2>
          <p className="text-xl text-gray-600">
            Watch as new listings appear in real-time and get instant alerts
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          {/* Property Feed Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Property Feed</h3>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                Live
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{property.title}</h4>
                      <p className="text-gray-600">{property.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">€{property.price}</p>
                      <p className="text-sm text-gray-500">/month</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 text-sm text-gray-600">
                    <span>🛏️ {property.bedrooms} bedrooms</span>
                    <span>📐 {property.area}m²</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => setShowLetterModal(true)}
              className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-purple-700"
            >
              <FileText className="mr-2 inline h-5 w-5" />
              Generate AI Letter
            </button>
          </div>

          {/* Notification Badge */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 100, y: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-0 top-0 rounded-xl bg-blue-600 p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3 text-white">
                  <Bell className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">New match in {property.city}!</p>
                    <p className="text-sm text-blue-100">€{property.price}/month</p>
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
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>

      {/* Letter Modal */}
      {showLetterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
          onClick={() => setShowLetterModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-2xl font-bold text-gray-900">AI Generated Letter</h3>
            <div className="mb-6 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-6">
              <p className="text-gray-700">
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
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
