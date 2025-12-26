import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useUserProfile } from '@/hooks/use-user-profile';
import Constants from 'expo-constants';

const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    interval: 'forever',
    features: [
      '1 search profile',
      'Email notifications only',
      '100 properties/week',
      'Manual applications',
      'Ads shown',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 14.99,
    interval: 'month',
    popular: true,
    features: [
      '3 search profiles',
      'Email + Push notifications',
      'Unlimited properties',
      '5 AI letters/month',
      'Family sharing (3 members)',
      '15-second alerts',
      'No ads',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 24.99,
    interval: 'month',
    features: [
      '5 search profiles',
      'All notification channels',
      'Unlimited AI letters',
      'Contract AI review',
      'Priority scraping (10s alerts)',
      'Family sharing (5 members)',
      'Viewing scheduler',
      'Dedicated support',
    ],
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { data: profile } = useUserProfile();
  const [loading, setLoading] = useState<string | null>(null);

  const currentTier = profile?.subscription_tier || 'free';

  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'free') {
      Alert.alert('Free Plan', 'You are already on the free plan');
      return;
    }

    if (currentTier === tierId) {
      Alert.alert('Current Plan', 'You are already subscribed to this plan');
      return;
    }

    setLoading(tierId);
    try {
      // Create Stripe Checkout session
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: tierId === 'basic' ? 'price_basic_monthly' : 'price_premium_monthly',
          successUrl: `${Constants.expoConfig?.scheme}://subscription/success`,
          cancelUrl: `${Constants.expoConfig?.scheme}://subscription/cancel`,
        }),
      });

      const { url } = await response.json();

      if (url) {
        // Open Stripe Checkout in browser
        const result = await WebBrowser.openBrowserAsync(url, {
          showInRecents: true,
        });

        if (result.type === 'dismiss') {
          // User cancelled or completed payment
          // Webhook will handle subscription update
          router.back();
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Subscription',
          headerShown: true,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerBackTitle: 'Back',
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 0 }}>
        <Text style={styles.subtitle}>Choose the plan that's right for you</Text>

        {PRICING_TIERS.map((tier) => {
          const isCurrentPlan = currentTier === tier.id;
          const isPopular = tier.popular === true;

          return (
            <View
              key={tier.id}
              style={[
                styles.tierCard,
                isPopular && styles.tierCardPopular,
                isCurrentPlan && styles.tierCardCurrent,
              ]}
            >
              {isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              {isCurrentPlan && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current Plan</Text>
                </View>
              )}

              <Text style={styles.tierName}>{tier.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>€{tier.price}</Text>
                {tier.price > 0 && (
                  <Text style={styles.priceInterval}>/{tier.interval}</Text>
                )}
              </View>

              <View style={styles.featuresList}>
                {tier.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {isCurrentPlan ? (
                <View style={styles.currentButton}>
                  <Text style={styles.currentButtonText}>Current Plan</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    isPopular && styles.subscribeButtonPopular,
                  ]}
                  onPress={() => handleSubscribe(tier.id)}
                  disabled={loading === tier.id}
                >
                  {loading === tier.id ? (
                    <ActivityIndicator color={isPopular ? '#000000' : '#ffffff'} />
                  ) : (
                    <Text
                      style={[
                        styles.subscribeButtonText,
                        isPopular && styles.subscribeButtonTextPopular,
                      ]}
                    >
                      {tier.price === 0 ? 'Current Plan' : 'Subscribe'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <Text style={styles.footerText}>
          All plans include a 7-day free trial. Cancel anytime.
        </Text>
      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 32,
  },
  tierCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
  },
  tierCardPopular: {
    borderColor: '#ffffff',
  },
  tierCardCurrent: {
    borderColor: '#4CAF50',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  currentBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceInterval: {
    fontSize: 18,
    color: '#888888',
    marginLeft: 4,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  subscribeButtonPopular: {
    backgroundColor: '#ffffff',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  subscribeButtonTextPopular: {
    color: '#000000',
  },
  currentButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  currentButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
});
