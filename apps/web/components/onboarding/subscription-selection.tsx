'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SubscriptionSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 search profile',
      'Email alerts',
      'Basic filters',
      'Community support',
    ],
    cta: 'Start exploring',
    popular: false,
  },
  {
    id: 'basic',
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
    cta: 'Start 7-day free trial',
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || '',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '€24.99',
    period: 'per month',
    description: 'Everything you need',
    features: [
      'Unlimited profiles',
      'SMS + Push + Email alerts',
      'All filters + custom rules',
      'Unlimited AI letters',
      'Contract review',
      'Neighborhood insights',
      '24/7 priority support',
    ],
    cta: 'Start 7-day free trial',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || '',
  },
];

export function SubscriptionSelection({ onNext, onBack }: SubscriptionSelectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      onNext();
      return;
    }

    setLoading(true);
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan?.priceId) {
      toast.error('Plan configuration error');
      setLoading(false);
      return;
    }

    try {
      // Get user ID
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      const { user } = await response.json();

      // Create Stripe checkout session
      const checkoutResponse = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.id,
        }),
      });

      const { url } = await checkoutResponse.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h2 className="text-h2 font-heading font-bold text-white">Choose your plan</h2>
        <p className="mt-2 text-body text-white/70">
          Start free, upgrade anytime. All plans include a 7-day free trial.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-6 transition-all cursor-pointer ${
                isSelected
                  ? 'border-electric-blue bg-electric-blue/10'
                  : plan.popular
                  ? 'border-white/20 bg-neutral-900'
                  : 'border-white/10 bg-neutral-900 hover:border-white/20'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-blue px-3 py-1 text-caption font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-h3 font-heading font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-h1 font-heading font-bold text-white">{plan.price}</span>
                  <span className="text-body text-white/60">/{plan.period}</span>
                </div>
                <p className="text-body-sm text-white/70">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-electric-blue flex-shrink-0 mt-0.5" />
                    <span className="text-body-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading}
                className={`w-full rounded-lg px-4 py-3 text-body font-medium transition-all ${
                  plan.popular || isSelected
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4 justify-center">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        {selectedPlan === 'free' && (
          <button
            onClick={() => handleSelectPlan('free')}
            className="btn-primary flex items-center gap-2"
          >
            Continue with Free
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-body-sm text-white/60">
        All paid plans include a 7-day free trial. Cancel anytime.
      </p>
    </div>
  );
}

