'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Translation } from '@/lib/translations/en';

interface PricingSectionProps {
  translations?: Translation['pricing'];
}

export function PricingSection({ translations }: PricingSectionProps = {}) {
  const defaultT = {
    title: 'Simple, transparent pricing',
    subtitle: 'All plans include 7-day free trial',
    plans: [
      {
        name: 'Free',
        price: '€0',
        period: 'forever',
        description: 'Perfect for trying out',
        features: ['1 search profile', 'Email alerts', 'Basic filters', 'Community support'],
        cta: 'Get Started',
        popular: false,
      },
      {
        name: 'Basic',
        price: '€14.99',
        period: 'per month',
        description: 'For serious renters',
        features: [
          '3 search profiles',
          'Instant push notifications',
          'Advanced filters',
          'AI letter generation (10/month)',
          'Priority support',
        ],
        cta: 'Start Free Trial',
        popular: true,
      },
      {
        name: 'Premium',
        price: '€24.99',
        period: 'per month',
        description: 'Complete rental toolkit',
        features: [
          'Unlimited profiles',
          'SMS + Push + Email alerts',
          'All filters + custom rules',
          'Unlimited AI letters',
          'Contract review',
          'Neighborhood insights',
          '24/7 priority support',
        ],
        cta: 'Start Free Trial',
        popular: false,
      },
    ],
    disclaimer: 'No credit card required • Cancel anytime • 7-day free trial on all paid plans',
  };

  const t = translations || defaultT;
  const plans = t.plans;

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
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
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
              className={`relative rounded-2xl border-2 bg-white p-8 shadow-lg animate-on-scroll ${
                plan.popular
                  ? 'border-blue-600 ring-4 ring-blue-100 scale-105'
                  : 'border-gray-200 hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period === 'forever' ? 'forever' : plan.period === 'per month' ? '/month' : plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
                {plan.popular && <ArrowRight className="h-5 w-5" />}
              </Link>
            </motion.div>
          ))}
        </div>

        {t.disclaimer && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-8 text-center text-sm text-gray-600 animate-on-scroll"
          >
            {t.disclaimer}
          </motion.p>
        )}
      </div>
    </section>
  );
}
