import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import * as SecureStore from 'expo-secure-store';
import type { User, Session } from '@supabase/supabase-js';
import { storage } from '@/utils/storage';
import { hasCompletedOnboarding as checkOnboardingInSupabase } from '@/lib/profile';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDING_KEY = 'has_completed_onboarding';

/**
 * Convert technical error messages to user-friendly messages
 */
function getUserFriendlyErrorMessage(errorMessage: string, action: string): string {
  const lowerMessage = errorMessage.toLowerCase();
  
  // Network errors
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('connection')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  // Authentication errors
  if (lowerMessage.includes('invalid login credentials') || lowerMessage.includes('invalid credentials')) {
    return 'The email or password you entered is incorrect. Please try again.';
  }
  
  if (lowerMessage.includes('email not confirmed') || lowerMessage.includes('email not verified')) {
    return 'Please verify your email address before signing in. Check your inbox for a confirmation email.';
  }
  
  if (lowerMessage.includes('user already registered') || lowerMessage.includes('already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (lowerMessage.includes('password')) {
    if (lowerMessage.includes('weak') || lowerMessage.includes('too short')) {
      return 'Password is too weak. Please use at least 6 characters.';
    }
    return 'There was an issue with the password. Please check and try again.';
  }
  
  if (lowerMessage.includes('email')) {
    if (lowerMessage.includes('invalid') || lowerMessage.includes('format')) {
      return 'Please enter a valid email address.';
    }
    return 'There was an issue with the email address. Please check and try again.';
  }
  
  if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  
  // Default: return original message if it's already user-friendly, otherwise generic message
  if (errorMessage.length < 100 && !errorMessage.includes('supabase') && !errorMessage.includes('postgres')) {
    return errorMessage;
  }
  
  return `Unable to ${action}. Please try again. If the problem persists, contact support.`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);

  // Load onboarding status from both SecureStore (for immediate UI) and Supabase (source of truth)
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        // First check SecureStore for immediate UI response
        const storedValue = await SecureStore.getItemAsync(ONBOARDING_KEY);
        const storedOnboarding = storedValue === 'true';
        
        // If we have a user, also check Supabase (source of truth)
        if (user) {
          const supabaseOnboarding = await checkOnboardingInSupabase(user.id);
          // Use Supabase value as source of truth
          setHasCompletedOnboardingState(supabaseOnboarding);
          // Sync SecureStore with Supabase value
          if (supabaseOnboarding !== storedOnboarding) {
            await SecureStore.setItemAsync(ONBOARDING_KEY, String(supabaseOnboarding));
          }
        } else {
          // No user, just use SecureStore value
          setHasCompletedOnboardingState(storedOnboarding);
        }
      } catch (error) {
        console.error('Error loading onboarding status:', error);
        // Fallback to SecureStore if Supabase check fails
        try {
          const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
          setHasCompletedOnboardingState(value === 'true');
        } catch (fallbackError) {
          console.error('Error loading onboarding from SecureStore:', fallbackError);
        }
      }
    };
    
    // Only load if we have a user, or if we want to check SecureStore for logged-out state
    loadOnboardingStatus();
  }, [user]);

  // Initialize auth state
  useEffect(() => {
    console.log('🔄 AuthContext: Starting session check');

    const checkSession = async () => {
      console.log('🔄 AuthContext: Calling supabase.auth.getSession()');
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('🔄 AuthContext: Session result:', data?.session ? 'HAS_SESSION' : 'NO_SESSION');
        console.log('🔄 AuthContext: Error:', error ? error.message : 'NONE');
        
        if (error) {
          console.error('❌ AuthContext: Error getting initial session:', error);
          // Don't show alert on initial load - just log and continue
        }
        
        if (data?.session) {
          console.log('🔄 AuthContext: Setting user and session from initial check');
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log('🔄 AuthContext: No session, setting user to null');
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        console.error('❌ AuthContext session error:', err);
        setSession(null);
        setUser(null);
      } finally {
        console.log('✅ AuthContext: Setting loading=false after initial session check');
        setLoading(false);
      }
    };

    checkSession();

    // Optional, non-blocking profile check
    const checkProfile = async (userId: string) => {
      try {
        console.log('🔄 AuthContext: Checking user profile for:', userId);
        const { data: profile, error } = await supabase
          .from('users')
          .select('id, full_name, subscription_tier, onboarding_completed')
          .eq('id', userId)
          .single();

        if (error) {
          console.log('⚠️ AuthContext: Profile not found:', error.message);
          // Don't throw - profile can be created later
        } else {
          console.log('✅ AuthContext: Profile loaded:', profile);
          // Update onboarding status from profile if available
          if (profile?.onboarding_completed !== undefined) {
            setHasCompletedOnboardingState(profile.onboarding_completed);
            // Sync to SecureStore
            try {
              await SecureStore.setItemAsync(ONBOARDING_KEY, String(profile.onboarding_completed));
            } catch (storeError) {
              console.error('Error syncing onboarding to SecureStore:', storeError);
            }
          }
        }
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error) {
          console.log('⚠️ AuthContext: Profile check failed (non-blocking):', (error as { message: string }).message);
        } else {
          console.log('⚠️ AuthContext: Profile check failed (non-blocking):', error);
        }
      }
    };

    // Listen for auth changes
    console.log('🔄 AuthContext: Setting up onAuthStateChange listener');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 AuthContext: onAuthStateChange fired, event:', event, 'hasSession:', !!session);
      
      // Set session and user immediately
      setSession(session);
      setUser(session?.user ?? null);
      
      // Set loading to false IMMEDIATELY - don't wait for profile check
      console.log('✅ AuthContext: Setting loading=false after onAuthStateChange (immediate)');
      setLoading(false);
      
      // Check profile in background (non-blocking)
      if (session?.user) {
        checkProfile(session.user.id); // Don't await - runs in background
      }
    });

    return () => {
      console.log('🔄 AuthContext: Cleaning up auth state change listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        const userFriendlyMessage = getUserFriendlyErrorMessage(error.message, 'sign in');
        Alert.alert('Sign In Failed', userFriendlyMessage);
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        console.log('✅ User signed in successfully:', data.user.email);
      }

      return {};
    } catch (error: any) {
      console.error('Sign in exception:', error);
      const errorMessage = error?.message || 'An unexpected error occurred during sign in';
      Alert.alert('Error', 'Something went wrong. Please try again.');
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        const userFriendlyMessage = getUserFriendlyErrorMessage(error.message, 'sign up');
        Alert.alert('Sign Up Failed', userFriendlyMessage);
        return { error: error.message };
      }

      // Profile will be auto-created by database trigger
      // Mark onboarding as not completed for new users
      try {
        await setHasCompletedOnboarding(false);
      } catch (onboardingError) {
        console.error('Error setting onboarding status:', onboardingError);
        // Don't fail sign up if onboarding status fails
      }

      console.log('✅ User signed up successfully:', email);
      return {};
    } catch (error: any) {
      console.error('Sign up exception:', error);
      const errorMessage = error?.message || 'An unexpected error occurred during sign up';
      Alert.alert('Error', 'Something went wrong. Please try again.');
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      
      // Clear onboarding status on sign out
      try {
        await SecureStore.deleteItemAsync(ONBOARDING_KEY);
        setHasCompletedOnboardingState(false);
      } catch (storageError) {
        console.error('Error clearing onboarding status:', storageError);
        // Don't fail sign out if storage clear fails
        setHasCompletedOnboardingState(false);
      }
      
      // Clear app state (but keep preferences)
      try {
        await storage.clearDraftLetter();
      } catch (storageError) {
        console.error('Error clearing draft letter:', storageError);
        // Don't fail sign out if storage clear fails
      }
      
      console.log('✅ User signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state to prevent stuck sessions
      setUser(null);
      setSession(null);
      setHasCompletedOnboardingState(false);
      
      // Show error but don't crash the app
      Alert.alert(
        'Sign Out Error',
        'There was an issue signing out, but you have been logged out locally. Please restart the app if you experience issues.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        const userFriendlyMessage = getUserFriendlyErrorMessage(error.message, 'password reset');
        Alert.alert('Password Reset Failed', userFriendlyMessage);
        return { error: error.message };
      }

      Alert.alert(
        'Check Your Email',
        'If an account exists with this email, you will receive a password reset link shortly.'
      );
      console.log('✅ Password reset email sent to:', email);
      return {};
    } catch (error: any) {
      console.error('Password reset exception:', error);
      const errorMessage = error?.message || 'An unexpected error occurred during password reset';
      Alert.alert('Error', 'Something went wrong. Please try again.');
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const setHasCompletedOnboarding = async (completed: boolean) => {
    try {
      // Update local state immediately
      setHasCompletedOnboardingState(completed);
      await SecureStore.setItemAsync(ONBOARDING_KEY, String(completed));

      // If we have a user, also update Supabase (source of truth)
      if (user) {
        try {
          const { error } = await supabase
            .from('users')
            .update({
              onboarding_completed: completed,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating onboarding in Supabase:', error);
            // Don't throw - we've already updated local state
          }
        } catch (supabaseError) {
          console.error('Error syncing onboarding to Supabase:', supabaseError);
          // Don't throw - we've already updated local state
        }
      }
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

