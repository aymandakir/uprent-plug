import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

// Load environment variables (Expo reads from .env file automatically)
// In Expo, process.env.EXPO_PUBLIC_* variables are available at runtime
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
      logger.error(
        'Missing Supabase credentials. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env file'
      );
      logger.error('Current values:', {
        url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
        key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
      });
    } else {
      logger.log('Supabase credentials loaded:', {
        url: `${supabaseUrl.substring(0, 30)}...`,
        keyLength: supabaseAnonKey.length,
      });
    }

// SecureStore has a 2048 byte limit per item
// Use AsyncStorage for large session data, SecureStore only for small critical tokens
const SECURE_STORE_MAX_SIZE = 2048;
const SECURE_STORE_PREFIX = 'secure_';
const ASYNC_STORAGE_PREFIX = 'supabase_';

/**
 * Hybrid storage adapter that uses:
 * - AsyncStorage for large data (sessions, user data)
 * - SecureStore for small critical secrets (tokens < 2048 bytes)
 */
const HybridStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      // Check if it's a secure item (small token)
      const secureKey = `${SECURE_STORE_PREFIX}${key}`;
      const secureValue = await SecureStore.getItemAsync(secureKey);
      if (secureValue) {
        return secureValue;
      }

      // Otherwise, get from AsyncStorage
      const asyncKey = `${ASYNC_STORAGE_PREFIX}${key}`;
      const asyncValue = await AsyncStorage.getItem(asyncKey);
      return asyncValue;
    } catch (error: any) {
      // If SecureStore fails due to size, try AsyncStorage
      if (error?.message?.includes('2048') || error?.message?.includes('size')) {
        try {
          const asyncKey = `${ASYNC_STORAGE_PREFIX}${key}`;
          return await AsyncStorage.getItem(asyncKey);
        } catch (asyncError) {
          logger.error('Error getting item from AsyncStorage:', asyncError);
          return null;
        }
      }
      logger.error('Error getting item from storage:', error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // Approximate size: UTF-16 encoding means ~2 bytes per character
      // Use string length as approximation (most characters are 1-2 bytes)
      const valueSize = value.length * 2;
      
      // Use SecureStore for small critical data (< 2048 bytes)
      // Typically refresh tokens and small secrets
      if (valueSize < SECURE_STORE_MAX_SIZE && key.includes('token')) {
        const secureKey = `${SECURE_STORE_PREFIX}${key}`;
        try {
          await SecureStore.setItemAsync(secureKey, value);
          // Also remove from AsyncStorage if it exists there
          const asyncKey = `${ASYNC_STORAGE_PREFIX}${key}`;
          await AsyncStorage.removeItem(asyncKey);
          return;
        } catch (secureError: any) {
          // If SecureStore fails (size limit or other), fall back to AsyncStorage
          if (secureError?.message?.includes('2048') || secureError?.message?.includes('size')) {
            logger.warn(`Item too large for SecureStore (${valueSize} bytes), using AsyncStorage for key: ${key}`);
          } else {
            logger.warn('SecureStore error, falling back to AsyncStorage:', secureError?.message);
          }
        }
      }

      // Use AsyncStorage for large data (sessions, user data, etc.)
      const asyncKey = `${ASYNC_STORAGE_PREFIX}${key}`;
      await AsyncStorage.setItem(asyncKey, value);
      
      // Remove from SecureStore if it exists there
      const secureKey = `${SECURE_STORE_PREFIX}${key}`;
      try {
        await SecureStore.deleteItemAsync(secureKey);
      } catch {
        // Ignore if it doesn't exist
      }
    } catch (error) {
      logger.error('Error setting item in storage:', error);
      throw error;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      // Remove from both stores
      const secureKey = `${SECURE_STORE_PREFIX}${key}`;
      const asyncKey = `${ASYNC_STORAGE_PREFIX}${key}`;
      
      await Promise.all([
        SecureStore.deleteItemAsync(secureKey).catch(() => {
          // Ignore if it doesn't exist
        }),
        AsyncStorage.removeItem(asyncKey).catch(() => {
          // Ignore if it doesn't exist
        }),
      ]);
    } catch (error) {
      logger.error('Error removing item from storage:', error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: HybridStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-client-info': 'uprent-plus-mobile',
    },
  },
});

// Test connection on initialization (non-blocking)
if (supabaseUrl && supabaseAnonKey) {
  (async () => {
    try {
      const { error } = await supabase.from('users').select('id').limit(1);
      if (error) {
        logger.error('Supabase connection test failed:', error.message);
        logger.error('Error details:', {
          code: error.code,
          message: error.message,
          hint: error.hint,
        });
      } else {
        logger.log('Supabase connection test successful');
      }
    } catch (error: unknown) {
      logger.error('Supabase connection error:', error);
      logger.error('This might be a network issue or incorrect URL');
    }
  })();
}
