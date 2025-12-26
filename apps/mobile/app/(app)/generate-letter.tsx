import { useState, useEffect } from 'react';
import { storage, type DraftLetterData } from '@/utils/storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import { useGenerateLetter } from '@/hooks/use-letter-generator';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useProperty } from '@/hooks/use-property';
import { useToast } from '@/hooks/use-toast';
import { useNetwork } from '@/hooks/use-network';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const LANGUAGES = [
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
] as const;

const LENGTHS = [
  { value: 'short', label: 'Short (150-200 words)' },
  { value: 'medium', label: 'Medium (250-350 words)' },
  { value: 'long', label: 'Long (400-500 words)' },
] as const;

export default function GenerateLetterScreen() {
  const { propertyId } = useLocalSearchParams<{ propertyId?: string }>();
  const { data: property } = useProperty(propertyId || '');
  const { data: userProfile } = useUserProfile();
  const generateLetter = useGenerateLetter();

  const [language, setLanguage] = useState('nl');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'enthusiastic'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [keyPoints, setKeyPoints] = useState('');
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [occupation, setOccupation] = useState('');
  const [income, setIncome] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const toast = useToast();
  const { isOffline } = useNetwork();

  // Load draft data on mount
  useEffect(() => {
    const loadDraft = async () => {
      const draft = await storage.loadDraftLetter();
      if (draft && draft.propertyId === propertyId) {
        setLanguage(draft.language);
        setTone(draft.tone);
        setLength(draft.length);
        setKeyPoints(draft.keyPoints);
        setFullName(draft.fullName);
        setOccupation(draft.occupation);
        setIncome(draft.income);
      } else if (userProfile?.full_name) {
        setFullName(userProfile.full_name);
      }
    };
    loadDraft();
  }, [userProfile, propertyId]);

  // Save draft data when form changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (propertyId) {
        const draft: DraftLetterData = {
          propertyId,
          language,
          tone,
          length,
          keyPoints,
          fullName,
          occupation,
          income,
          timestamp: new Date().toISOString(),
        };
        storage.saveDraftLetter(draft).catch(console.error);
      }
    }, 1000); // Debounce: save 1 second after last change

    return () => clearTimeout(timeoutId);
  }, [propertyId, language, tone, length, keyPoints, fullName, occupation, income]);

  const handleGenerate = async () => {
    if (!propertyId) {
      toast.show.error('Error', 'Property ID is required');
      return;
    }

    if (isOffline) {
      toast.show.error('Offline', 'AI letter generation requires an internet connection');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateLetter.mutateAsync({
        propertyId,
        language,
        tone,
        length,
        includePoints: keyPoints.split('\n').filter(Boolean),
        additionalInfo: keyPoints,
      });

      setGeneratedLetter(response.content);
      // Clear draft after successful generation
      await storage.clearDraftLetter();
      toast.show.success('Letter generated successfully');
    } catch (error: any) {
      toast.show.error(
        'Generation Failed',
        error.message || 'Failed to generate letter. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLetter) return;
    await Clipboard.setStringAsync(generatedLetter);
    toast.show.success('Copied', 'Letter copied to clipboard');
  };

  const handleShare = async () => {
    if (!generatedLetter) return;
    try {
      await Sharing.shareAsync(generatedLetter);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleEmail = () => {
    if (!generatedLetter || !property) return;
    const subject = `Application for ${property.address || 'Property'}`;
    const body = encodeURIComponent(generatedLetter);
    Linking.openURL(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
  };

  const handleRegenerate = () => {
    setGeneratedLetter(null);
    handleGenerate();
  };

  const selectedLanguage = LANGUAGES.find((l) => l.code === language)?.name || 'Dutch';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Generate Application Letter',
          headerShown: true,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerBackTitle: 'Back',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Property Context */}
          {property && (
            <View style={styles.propertyContext}>
              <Text style={styles.propertyContextLabel}>Property</Text>
              <Text style={styles.propertyContextText}>{property.address}</Text>
              {property.price_monthly && (
                <Text style={styles.propertyContextSubtext}>
                  €{property.price_monthly.toLocaleString()}/month
                </Text>
              )}
            </View>
          )}

          {/* Form */}
          {!generatedLetter ? (
            <>
              {/* Language Selector */}
              <View style={styles.section}>
                <Text style={styles.label}>Language</Text>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => setShowLanguagePicker(!showLanguagePicker)}
                >
                  <Text style={styles.pickerText}>{selectedLanguage}</Text>
                  <Ionicons name="chevron-down" size={20} color="#888888" />
                </TouchableOpacity>
                {showLanguagePicker && (
                  <View style={styles.languageList}>
                    <ScrollView style={styles.languageScroll}>
                      {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                          key={lang.code}
                          style={[
                            styles.languageOption,
                            language === lang.code && styles.languageOptionActive,
                          ]}
                          onPress={() => {
                            setLanguage(lang.code);
                            setShowLanguagePicker(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.languageOptionText,
                              language === lang.code && styles.languageOptionTextActive,
                            ]}
                          >
                            {lang.name}
                          </Text>
                          {language === lang.code && (
                            <Ionicons name="checkmark" size={20} color="#ffffff" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
              )}
              </View>

              {/* Tone Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Tone</Text>
                <View style={styles.optionsRow}>
                  {TONES.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[styles.optionButton, tone === t.value && styles.optionButtonActive]}
                      onPress={() => setTone(t.value)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          tone === t.value && styles.optionButtonTextActive,
                        ]}
                      >
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                ))}
                </View>
              </View>

              {/* Length Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Length</Text>
                <View style={styles.optionsColumn}>
                  {LENGTHS.map((l) => (
                    <TouchableOpacity
                      key={l.value}
                      style={[styles.optionButton, length === l.value && styles.optionButtonActive]}
                      onPress={() => setLength(l.value)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          length === l.value && styles.optionButtonTextActive,
                        ]}
                      >
                        {l.label}
                      </Text>
                    </TouchableOpacity>
                ))}
                </View>
              </View>

              {/* Personal Info */}
              <View style={styles.section}>
                <Text style={styles.label}>Personal Information</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#666666"
                  value={fullName}
                  onChangeText={setFullName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Occupation"
                  placeholderTextColor="#666666"
                  value={occupation}
                  onChangeText={setOccupation}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Monthly Income (optional)"
                  placeholderTextColor="#666666"
                  value={income}
                  onChangeText={setIncome}
                keyboardType="numeric"
              />
              </View>

              {/* Key Points */}
              <View style={styles.section}>
                <Text style={styles.label}>Key Points to Mention</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g., Current living situation, employment, why this property..."
                  placeholderTextColor="#666666"
                  value={keyPoints}
                  onChangeText={setKeyPoints}
                  multiline
                  numberOfLines={4}
                textAlignVertical="top"
              />
              </View>

              {/* Generate Button */}
              <TouchableOpacity
                style={[styles.generateButton, (isGenerating || !propertyId || isOffline) && styles.generateButtonDisabled]}
                onPress={handleGenerate}
                disabled={isGenerating || !propertyId || isOffline}
              >
                {isGenerating ? (
                  <LoadingSpinner message="" />
                ) : (
                  <Text style={styles.generateButtonText}>
                    {isOffline ? 'Requires Internet' : 'Generate Letter'}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            /* Preview */
            <>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>Generated Letter</Text>
                <Text style={styles.previewCharCount}>
                  {generatedLetter.length} characters
                </Text>
              </View>

              <TextInput
                style={[styles.input, styles.textArea, styles.previewText]}
                value={generatedLetter}
                onChangeText={setGeneratedLetter}
                multiline
                textAlignVertical="top"
                editable
              />

              {/* Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                  <Ionicons name="copy-outline" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                  <Ionicons name="share-outline" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
                  <Ionicons name="mail-outline" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Email</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate}>
                <Ionicons name="refresh-outline" size={20} color="#ffffff" />
                <Text style={styles.regenerateButtonText}>Regenerate</Text>
              </TouchableOpacity>
            </>
          )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  propertyContext: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  propertyContextLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  propertyContextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  propertyContextSubtext: {
    fontSize: 14,
    color: '#888888',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  pickerText: {
    fontSize: 16,
    color: '#ffffff',
  },
  languageList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#333333',
    maxHeight: 200,
  },
  languageScroll: {
    maxHeight: 200,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  languageOptionActive: {
    backgroundColor: '#333333',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#888888',
  },
  languageOptionTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionsColumn: {
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionButtonActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  optionButtonText: {
    fontSize: 16,
    color: '#888888',
  },
  optionButtonTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  generateButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  previewCharCount: {
    fontSize: 14,
    color: '#888888',
  },
  previewText: {
    minHeight: 300,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  regenerateButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});