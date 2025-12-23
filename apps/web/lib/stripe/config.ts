import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,

  // Product/Price IDs (create these in Stripe Dashboard)
  prices: {
    basic: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID,
    },
    premium: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID,
    },
  },

  // Webhook secret
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// Price details for UI
export const PRICING_TIERS = {
  free: {
    name: 'Free Trial',
    price: 0,
    currency: '€',
    interval: 'forever',
    features: [
      '1 search profile',
      'Email notifications only',
      '100 properties/week',
      'Manual applications',
      'Ads shown',
    ],
    limits: {
      searchProfiles: 1,
      aiLetters: 0,
      familyMembers: 0,
    },
  },
  basic: {
    name: 'Basic',
    price: 14.99,
    currency: '€',
    interval: 'month',
    stripeMonthlyPriceId: STRIPE_CONFIG.prices.basic.monthly,
    popular: true,
    features: [
      '3 search profiles',
      'Email + Push notifications',
      'Unlimited properties',
      '5 AI letters/month',
      'Family sharing (3 members)',
      '15-second alerts',
      'No ads',
    ],
    limits: {
      searchProfiles: 3,
      aiLetters: 5,
      familyMembers: 3,
    },
  },
  premium: {
    name: 'Premium',
    price: 24.99,
    currency: '€',
    interval: 'month',
    stripeMonthlyPriceId: STRIPE_CONFIG.prices.premium.monthly,
    features: [
      '5 search profiles',
      'All notification channels',
      'Unlimited AI letters',
      'Contract AI review + lawyer',
      'Priority scraping (10s alerts)',
      'Family sharing (5 members)',
      'Viewing scheduler',
      'Dedicated support',
    ],
    limits: {
      searchProfiles: 5,
      aiLetters: -1, // Unlimited
      familyMembers: 5,
    },
  },
} as const;

