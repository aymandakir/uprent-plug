/**
 * Onboarding carousel constants
 * Simple structure for Expo Go compatibility
 */

export const SLIDES = [
  {
    id: 1,
    title: 'Welcome to Uprent Plus',
    subtitle: 'Smart renting, reimagined',
    icon: '🏠', // Simple emoji
    gradient: ['#7C3AED', '#06B6D4'],
  },
  {
    id: 2,
    title: 'Find Your Perfect Match',
    subtitle: 'Browse thousands of properties tailored to your lifestyle',
    icon: '🔍',
    gradient: ['#06B6D4', '#3B82F6'],
  },
  {
    id: 3,
    title: 'Secure & Transparent',
    subtitle: 'All contracts verified, zero hidden fees',
    icon: '🔒',
    gradient: ['#3B82F6', '#EC4899'],
  },
  {
    id: 4,
    title: 'Connect Instantly',
    subtitle: 'Chat with landlords and tenants in real-time',
    icon: '💬',
    gradient: ['#EC4899', '#7C3AED'],
  },
  {
    id: 5,
    title: 'Ready to Get Started?',
    subtitle: 'Join thousands of happy renters',
    icon: '🚀',
    gradient: ['#7C3AED', '#06B6D4'],
  },
] as const;

export const COLORS = {
  primary: '#7C3AED',
  background: '#0F172A',
  cardBg: 'rgba(30, 41, 59, 0.6)',
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
} as const;

// Legacy exports for backwards compatibility (if any other files use these)
export const ONBOARDING_SLIDES = SLIDES;
export const TOTAL_SLIDES = SLIDES.length;
