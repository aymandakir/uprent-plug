import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

const HAS_SEEN_CAROUSEL_KEY = 'has_seen_carousel';

// Route constants
const CAROUSEL_ROUTE = '/(auth)/onboarding-carousel';
const SIGN_IN_ROUTE = '/(auth)/sign-in';
const TABS_ROUTE = '/(app)/(tabs)';
const ONBOARDING_ROUTE = '/(auth)/onboarding';

export default function Index() {
  const router = useRouter();
  const { user, loading, hasCompletedOnboarding } = useAuthContext();
  const hasNavigatedRef = useRef(false);
  const [hasSeenCarousel, setHasSeenCarousel] = useState<boolean | null>(null);

  // Check if user has seen the carousel
  useEffect(() => {
    async function checkCarouselStatus() {
      try {
        const seen = await SecureStore.getItemAsync(HAS_SEEN_CAROUSEL_KEY);
        setHasSeenCarousel(seen === 'true');
      } catch (error) {
        console.error('Error checking carousel status:', error);
        setHasSeenCarousel(false); // Default to not seen on error
      }
    }
    checkCarouselStatus();
  }, []);

  useEffect(() => {
    if (loading || hasSeenCarousel === null || hasNavigatedRef.current) return;

    // First-time user: show carousel
    if (!hasSeenCarousel && !user) {
      hasNavigatedRef.current = true;
      router.replace(CAROUSEL_ROUTE);
      return;
    }

    // User exists: route based on onboarding status
    if (user) {
      hasNavigatedRef.current = true;
      if (hasCompletedOnboarding) {
        router.replace(TABS_ROUTE);
      } else {
        router.replace(ONBOARDING_ROUTE);
      }
      return;
    }

    // Returning user (no session): show sign-in
    if (!user && hasSeenCarousel) {
      hasNavigatedRef.current = true;
      router.replace(SIGN_IN_ROUTE);
    }
  }, [user, loading, hasCompletedOnboarding, hasSeenCarousel, router]);

  // Reset navigation flag when user logs out
  useEffect(() => {
    if (!user) {
      hasNavigatedRef.current = false;
    }
  }, [user]);

  // Show loading indicator while checking auth and carousel status
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
