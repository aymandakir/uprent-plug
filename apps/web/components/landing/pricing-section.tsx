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
    <section className="bg-neutral-900 py-24 md:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16 text-center animate-on-scroll"
        >
          <h2 className="mb-4 text-h2 font-heading font-bold text-white">
            {t.title}
          </h2>
          <p className="text-body-lg text-white/70">{t.subtitle}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
              className={`relative card animate-on-scroll ${
                plan.popular
                  ? 'ring-2 ring-white/30 scale-105'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-lg bg-white px-4 py-1 text-caption font-medium text-black uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-h3 font-heading font-bold text-white">{plan.name}</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-h1 font-heading font-bold text-white">{plan.price}</span>
                  <span className="text-body text-white/60">{plan.period === 'forever' ? 'forever' : plan.period === 'per month' ? '/month' : plan.period}</span>
                </div>
                <p className="text-body-sm text-white/70">{plan.description}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" />
                    <span className="text-body text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`flex w-full items-center justify-center gap-2 ${
                  plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
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
            className="mt-8 text-center text-body-sm text-white/60 animate-on-scroll"
          >
            {t.disclaimer}
          </motion.p>
        )}
      </div>
    </section>
  );
}
