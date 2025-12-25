'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Bell,
  FileText,
  Shield,
  MapPin,
  User,
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-time monitoring',
    description: 'Track 1,500+ sources continuously, 24/7',
  },
  {
    icon: Bell,
    title: 'Push notifications',
    description: 'Instant alerts on iOS, Android, and email',
  },
  {
    icon: FileText,
    title: 'AI letter generation',
    description: 'Professional application letters in seconds',
  },
  {
    icon: Shield,
    title: 'Contract review',
    description: 'Premium tier includes AI-powered contract analysis',
  },
  {
    icon: MapPin,
    title: 'Neighborhood insights',
    description: 'Get data on schools, transport, and amenities',
  },
  {
    icon: User,
    title: 'Multi-profile management',
    description: 'Manage multiple search criteria at once',
  },
];

export function FeaturesGrid() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Everything you need to win the Dutch rental market
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
