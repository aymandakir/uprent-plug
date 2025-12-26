import * as Haptics from 'expo-haptics';

/**
 * Haptic feedback utility functions
 * Provides consistent haptic feedback across the app
 */

export const haptic = {
  /**
   * Light impact - for small interactions like toggles, taps
   */
  light: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      // Silently fail if haptics not available
    });
  },

  /**
   * Medium impact - for buttons, selections
   */
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
      // Silently fail if haptics not available
    });
  },

  /**
   * Heavy impact - for important actions like save, delete
   */
  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {
      // Silently fail if haptics not available
    });
  },

  /**
   * Success feedback - for successful actions
   */
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
      // Silently fail if haptics not available
    });
  },

  /**
   * Error feedback - for errors or failures
   */
  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {
      // Silently fail if haptics not available
    });
  },

  /**
   * Warning feedback - for warnings
   */
  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {
      // Silently fail if haptics not available
    });
  },

  /**
   * Selection feedback - for selection changes
   */
  selection: () => {
    Haptics.selectionAsync().catch(() => {
      // Silently fail if haptics not available
    });
  },
};

