import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Terms of Service</Text>
          
          <Text style={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using Uprent Plus, you accept and agree to be bound by these Terms
              of Service. If you do not agree with any part of these terms, you may not use our service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Service Description</Text>
            <Text style={styles.sectionText}>
              Uprent Plus is a property rental platform that provides property listings, matching
              services, and related tools to help users find rental properties. We aggregate and
              display property information from various sources.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.sectionText}>
              To use certain features, you must register for an account. You are responsible for
              maintaining the security of your account credentials and for all activities that occur
              under your account. You must immediately notify us of any unauthorized use of your account.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Subscription and Payment</Text>
            <Text style={styles.sectionText}>
              Some features require a paid subscription. Subscription fees are charged in advance
              and are generally non-refundable. We reserve the right to modify our pricing with
              reasonable notice to existing subscribers.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. User Responsibilities</Text>
            <Text style={styles.sectionText}>
              You agree to use the service only for lawful purposes. You will not attempt to gain
              unauthorized access to our systems, interfere with service operations, or use the
              service in any way that could damage, disable, or impair the platform.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Disclaimer of Warranties</Text>
            <Text style={styles.sectionText}>
              The service is provided "as is" without warranties of any kind. We do not guarantee
              the accuracy, completeness, or reliability of property listings. We are not responsible
              for the outcome of any rental applications or transactions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              To the maximum extent permitted by law, Uprent Plus shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the service.
              Our total liability shall not exceed the amount you paid for the service in the past
              12 months.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All content, features, trademarks, and intellectual property rights in the service are
              owned by Uprent Plus or our licensors. You may not copy, modify, or create derivative
              works without our express written permission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Termination</Text>
            <Text style={styles.sectionText}>
              We may suspend or terminate your account at any time for violations of these Terms or
              for any other reason we deem necessary. You may cancel your account at any time through
              your account settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these Terms at any time. Material changes will be
              communicated to users. Continued use of the service after changes constitutes acceptance
              of the updated Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Governing Law</Text>
            <Text style={styles.sectionText}>
              These Terms are governed by the laws of the jurisdiction in which Uprent Plus operates.
              Any disputes arising from these Terms shall be resolved through binding arbitration
              or in the appropriate courts.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Contact Information</Text>
            <Text style={styles.sectionText}>
              For questions about these Terms, please contact us through the app support channels
              or visit our website for contact information.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#aaaaaa',
    lineHeight: 24,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

