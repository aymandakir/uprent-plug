/**
 * Color constants for Uprent Plus mobile app
 * Dark theme optimized
 */

export const Colors = {
  dark: {
    background: '#000000',
    card: '#1A1A1A',
    cardBorder: '#2D2D2D',
    primary: '#6366F1', // Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#EC4899', // Pink
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#2D2D2D',
    borderLight: '#404040',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  light: {
    background: '#FFFFFF',
    card: '#F9FAFB',
    cardBorder: '#E5E7EB',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#EC4899',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#D1D5DB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
} as const;

// Default to dark theme
export const AppColors = Colors.dark;

