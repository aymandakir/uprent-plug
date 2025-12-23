'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { PRICING_TIERS } from '@/lib/stripe/config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (priceId: string) => {
    // TODO: Replace with actual user ID from auth context/session
    // Example: const userId = await getCurrentUserId();
    const userId = 'YOUR_USER_ID'; // Get from auth context
    
    if (!userId || userId === 'YOUR_USER_ID') {
      toast.error('Please log in to subscribe');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId,
        }),
      });

      const data = await res.json() as { url?: string; error?: string };
      const { url, error } = data;

      if (error) throw new Error(error);

      // Redirect to Stripe Checkout
      if (url && typeof window !== 'undefined') {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            No hidden fees. Cancel anytime. 7-day free trial on all paid plans.
          </p>

          {/* Yearly toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !isYearly ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                isYearly ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(PRICING_TIERS).map(([key, tier]) => {
            const isPopular = 'popular' in tier && tier.popular;
            const price = isYearly && tier.price > 0 ? tier.price * 0.8 * 12 : tier.price;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  isPopular ? 'ring-2 ring-brand-400 scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-brand-400 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Tier name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-gray-900">
                        {tier.currency}{Math.floor(price)}
                      </span>
                      {price % 1 !== 0 && (
                        <span className="text-2xl font-bold text-gray-900">
                          .{((price % 1) * 100).toFixed(0)}
                        </span>
                      )}
                      {tier.price > 0 && (
                        <span className="text-gray-600">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {tier.price === 0 && (
                      <p className="text-sm text-gray-500 mt-1">No credit card required</p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA button */}
                  <button
                    onClick={() => {
                      if (tier.price === 0) {
                        router.push('/register');
                      } else {
                        const priceId = 'stripeMonthlyPriceId' in tier 
                          ? tier.stripeMonthlyPriceId 
                          : '';
                        handleSubscribe(priceId);
                      }
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isPopular
                        ? 'bg-brand-400 hover:bg-brand-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {tier.price === 0 ? 'Start Free Trial' : 'Get Started'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ below pricing */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white rounded-lg p-6 shadow-sm">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I cancel anytime?
              </summary>
              <p className="mt-3 text-gray-600">
                Yes! Cancel your subscription anytime from your account settings. You'll retain access until the end of your billing period.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-sm">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Do you offer refunds?
              </summary>
              <p className="mt-3 text-gray-600">
                We offer a 7-day money-back guarantee. If you're not satisfied within the first week, we'll refund you in full.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-sm">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="mt-3 text-gray-600">
                We accept all major credit cards (Visa, Mastercard, Amex), iDEAL (for Dutch customers), and PayPal.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

