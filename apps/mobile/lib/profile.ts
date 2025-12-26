/**
 * Profile helper functions for user profile operations
 */

import { supabase } from './supabase';
import { logger } from '@/utils/logger';

/**
 * Mark onboarding as complete for the current user
 * Updates the onboarding_completed field in the users table
 */
export async function markOnboardingComplete(userId: string): Promise<void> {
  try {
    logger.log('Marking onboarding complete for user:', userId);

    const { error } = await supabase
      .from('users')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      logger.error('Error marking onboarding complete:', error);
      throw error;
    }

    logger.log('Successfully marked onboarding complete');
  } catch (error: unknown) {
    logger.error('Failed to mark onboarding complete:', error);
    throw error;
  }
}

/**
 * Check if user has completed onboarding
 * Reads onboarding_completed from the users table
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

    if (error) {
      logger.error('Error checking onboarding status:', error);
      return false;
    }

    if (!data) {
      // No row yet: user has not completed onboarding; this is not an error
      return false;
    }

    return data.onboarding_completed ?? false;
  } catch (error: unknown) {
    logger.error('Failed to check onboarding status:', error);
    return false;
  }
}

