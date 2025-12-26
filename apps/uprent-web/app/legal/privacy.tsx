import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Privacy Policy</Text>
          
          <Text style={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.sectionText}>
              Uprent Plus ("we," "our," or "us") is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our mobile application and services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information you provide directly (name, email, phone number, property
              preferences), information collected automatically (device information, usage data,
              location data with your permission), and information from third-party sources (property
              listing data, analytics providers).
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use your information to provide and improve our services, process your requests,
              send property match notifications, communicate about your account, personalize your
              experience, and for analytics and security purposes.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Information Sharing</Text>
            <Text style={styles.sectionText}>
              We do not sell your personal information. We may share your information with service
              providers who assist in operations, when required by law, to protect rights and safety,
              or with your explicit consent. Aggregated, anonymized data may be shared for analytics.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Security</Text>
            <Text style={styles.sectionText}>
              We implement industry-standard security measures including encryption, secure storage,
              and access controls to protect your personal information. However, no method of
              transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Your Privacy Rights</Text>
            <Text style={styles.sectionText}>
              You have the right to access, update, correct, or delete your personal information
              through your account settings or by contacting us. You may also opt out of certain
              communications and request a copy of your data in a portable format.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Data Retention</Text>
            <Text style={styles.sectionText}>
              We retain your personal information for as long as necessary to provide our services
              and comply with legal obligations. When you delete your account, we will delete or
              anonymize your personal information, subject to legal retention requirements.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
            <Text style={styles.sectionText}>
              Our service may contain links to or integrate with third-party services. We are not
              responsible for the privacy practices of these third parties. We encourage you to
              review their privacy policies before providing any information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Cookies and Tracking Technologies</Text>
            <Text style={styles.sectionText}>
              We use cookies, local storage, and similar tracking technologies to enhance your
              experience, analyze usage patterns, and deliver personalized content. You can control
              these technologies through your device settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Children's Privacy</Text>
            <Text style={styles.sectionText}>
              Our service is not intended for individuals under 18 years of age. We do not knowingly
              collect personal information from children. If we become aware that we have collected
              information from a child, we will take steps to delete it promptly.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. International Data Transfers</Text>
            <Text style={styles.sectionText}>
              Your information may be transferred to and processed in countries other than your
              country of residence. These countries may have data protection laws that differ from
              those in your country. We take appropriate safeguards to protect your information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Changes to This Policy</Text>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by posting the updated policy in the app and updating the "Last updated" date.
              Your continued use of the service after changes constitutes acceptance of the updated policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have questions, concerns, or requests regarding this Privacy Policy or our
              privacy practices, please contact us through the app support channels or visit our
              website for contact information.
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

