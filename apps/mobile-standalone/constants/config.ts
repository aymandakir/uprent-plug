/**
 * Application configuration constants
 */

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// API Endpoints
export const API_ENDPOINTS = {
  health: '/api/health',
  auth: {
    me: '/api/auth/me',
    signout: '/api/auth/signout',
    deleteAccount: '/api/auth/delete-account',
  },
  ai: {
    generateLetter: '/api/ai/generate-letter',
    analyzeContract: '/api/ai/analyze-contract',
  },
  notifications: {
    sendEmail: '/api/notifications/send-email',
    sendSMS: '/api/notifications/send-sms',
  },
  stripe: {
    createCheckoutSession: '/api/stripe/create-checkout-session',
    createPortalSession: '/api/stripe/create-portal-session',
  },
} as const;

