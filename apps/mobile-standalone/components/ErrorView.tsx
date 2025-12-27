import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorViewProps {
  message: string;
  icon?: string;
  // Extended props for backward compatibility
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorView({
  message,
  icon,
  title = 'Something went wrong',
  onRetry,
  retryLabel = 'Retry',
}: ErrorViewProps) {
  return (
    <View style={styles.container}>
      {icon ? (
        <Text style={styles.icon}>{icon}</Text>
      ) : (
        <Ionicons name="alert-circle-outline" size={64} color="#ff4444" />
      )}
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#000000',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 150,
    alignItems: 'center',
    marginTop: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});

