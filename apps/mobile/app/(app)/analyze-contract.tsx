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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useAnalyzeContract } from '@/hooks/use-contract-analyzer';
import { useUserProfile } from '@/hooks/use-user-profile';
import { PremiumGate } from '@/components/PremiumGate';

export default function AnalyzeContractScreen() {
  const router = useRouter();
  const { data: userProfile } = useUserProfile();
  const analyzeContract = useAnalyzeContract();
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isPremium = userProfile?.subscription_tier === 'premium';

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
        setAnalysisResult(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a document first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Read file content
      // Note: For PDF files, you would need a PDF parsing library like react-native-pdf
      // For now, this is a placeholder - the API accepts text directly
      // In production, extract text from PDF/DOC using appropriate libraries
      const response = await fetch(selectedFile.uri);
      const text = await response.text();

      // If the API endpoint supports file upload, use FormData instead
      // For now, assuming text extraction is handled server-side or we accept text input
      const result = await analyzeContract.mutateAsync({
        text: text || 'Contract text content', // Placeholder - needs proper extraction
        language: 'nl',
      });

      setAnalysisResult(result);
    } catch (error: any) {
      Alert.alert(
        'Analysis Failed',
        error.message || 'Failed to analyze contract. Please try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: handleAnalyze },
        ]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpgrade = () => {
    // Navigate to subscription/settings
    router.push('/(app)/(tabs)/profile');
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  };

  if (!isPremium) {
    return (
      <PremiumGate feature="Contract Analyzer">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contract Analyzer</Text>
          <View style={{ width: 40 }} />
        </View>
      </PremiumGate>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contract Analyzer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!analysisResult ? (
          <>
            {/* Upload Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upload Contract</Text>
              <Text style={styles.sectionSubtitle}>
                Upload a PDF, DOC, or DOCX file to analyze
              </Text>

              {selectedFile ? (
                <View style={styles.fileInfo}>
                  <Ionicons name="document-text" size={32} color="#ffffff" />
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {selectedFile.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handlePickDocument}>
                    <Text style={styles.changeFileText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument}>
                  <Ionicons name="cloud-upload-outline" size={48} color="#ffffff" />
                  <Text style={styles.uploadButtonText}>Choose File</Text>
                  <Text style={styles.uploadButtonSubtext}>
                    PDF, DOC, or DOCX (max 10MB)
                  </Text>
                </TouchableOpacity>
              )}

              {selectedFile && (
                <TouchableOpacity
                  style={[
                    styles.analyzeButton,
                    isAnalyzing && styles.analyzeButtonDisabled,
                  ]}
                  onPress={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <ActivityIndicator color="#000000" />
                  ) : (
                    <Text style={styles.analyzeButtonText}>Analyze Contract</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <View style={styles.analysisProgress}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.analysisProgressText}>Analyzing contract...</Text>
                <Text style={styles.analysisProgressSubtext}>
                  This may take 30-60 seconds
                </Text>
              </View>
            )}
          </>
        ) : (
          /* Results */
          <>
            {/* Overall Score */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Safety Score</Text>
              <View style={styles.scoreContainer}>
                <View
                  style={[
                    styles.scoreCircle,
                    { borderColor: getRiskColor(analysisResult.overallScore) },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreValue,
                      { color: getRiskColor(analysisResult.overallScore) },
                    ]}
                  >
                    {analysisResult.overallScore}
                  </Text>
                  <Text style={styles.scoreLabel}>/ 100</Text>
                </View>
                <View style={styles.riskBadge}>
                  <Text
                    style={[
                      styles.riskBadgeText,
                      { color: getRiskColor(analysisResult.overallScore) },
                    ]}
                  >
                    {getRiskLevel(analysisResult.overallScore).toUpperCase()} RISK
                  </Text>
                </View>
              </View>
            </View>

            {/* Summary */}
            {analysisResult.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.summaryText}>{analysisResult.summary}</Text>
              </View>
            )}

            {/* Red Flags */}
            {analysisResult.redFlags && analysisResult.redFlags.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🚨 Red Flags ({analysisResult.redFlags.length})
                </Text>
                {analysisResult.redFlags.map((flag: any, index: number) => (
                  <View key={index} style={styles.flagCard}>
                    <Text style={styles.flagTitle}>{flag.title}</Text>
                    <Text style={styles.flagDescription}>{flag.description}</Text>
                    {flag.recommendation && (
                      <Text style={styles.flagRecommendation}>
                        💡 {flag.recommendation}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Yellow Flags */}
            {analysisResult.yellowFlags && analysisResult.yellowFlags.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  ⚠️ Yellow Flags ({analysisResult.yellowFlags.length})
                </Text>
                {analysisResult.yellowFlags.map((flag: any, index: number) => (
                  <View key={index} style={styles.flagCard}>
                    <Text style={styles.flagTitle}>{flag.title}</Text>
                    <Text style={styles.flagDescription}>{flag.description}</Text>
                    {flag.recommendation && (
                      <Text style={styles.flagRecommendation}>
                        💡 {flag.recommendation}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {analysisResult.recommendations.map((rec: string, index: number) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setAnalysisResult(null);
                  setSelectedFile(null);
                }}
              >
                <Ionicons name="refresh-outline" size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>Analyze Another</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
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
  premiumGateContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  premiumGate: {
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 12,
  },
  premiumDescription: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 32,
  },
  benefitsList: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#ffffff',
  },
  upgradeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    color: '#888888',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: '#888888',
  },
  changeFileText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  analysisProgress: {
    alignItems: 'center',
    padding: 32,
  },
  analysisProgressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
  },
  analysisProgressSubtext: {
    fontSize: 14,
    color: '#888888',
    marginTop: 8,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#888888',
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  riskBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginTop: 8,
  },
  flagCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  flagTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  flagDescription: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 8,
  },
  flagRecommendation: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  actionsSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
