import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import * as SecureStore from 'expo-secure-store';
import type { User, Session } from '@supabase/supabase-js';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);

  // Load onboarding status
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
        setHasCompletedOnboardingState(value === 'true');
      } catch (error) {
        console.error('Error loading onboarding status:', error);
      }
    };
    loadOnboardingStatus();
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user profile exists when session changes
      if (session?.user) {
        try {
          await api.auth.getMe();
        } catch (error) {
          // Profile will be created by database trigger, but we can check here
          console.log('Profile check:', error);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
      }

      return {};
    } catch (error: any) {
      return { error: error.message || 'An error occurred during sign in' };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Profile will be auto-created by database trigger
      // Mark onboarding as not completed for new users
      await setHasCompletedOnboarding(false);

      return {};
    } catch (error: any) {
      return { error: error.message || 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      // Clear onboarding status on sign out
      await SecureStore.deleteItemAsync(ONBOARDING_KEY);
      setHasCompletedOnboardingState(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      return { error: error.message || 'An error occurred during password reset' };
    }
  };

  const setHasCompletedOnboarding = async (completed: boolean) => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, String(completed));
      setHasCompletedOnboardingState(completed);
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

