import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading, hasCompletedOnboarding } = useAuthContext();

  useEffect(() => {
    if (!loading && user) {
      if (hasCompletedOnboarding) {
        router.replace('/(app)/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }
  }, [user, loading, hasCompletedOnboarding, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Uprent Plus</Text>
        <Text style={styles.hero}>Find your next home</Text>
        <Text style={styles.heroAccent}>15 seconds faster</Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Real-time alerts from 1,500+ sources</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureText}>AI-powered application letters</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Smart matching with score-based recommendations</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.buttonPrimaryText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={styles.buttonSecondaryText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 32,
  },
  hero: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroAccent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#888888',
    textAlign: 'center',
    marginBottom: 48,
  },
  features: {
    width: '100%',
    marginBottom: 48,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#ffffff',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});