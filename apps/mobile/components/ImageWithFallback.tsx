import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackIcon?: string;
  fallbackText?: string;
  fallbackColor?: string;
}

export const ImageWithFallback = ({
  source,
  style,
  fallbackIcon = 'image-outline',
  fallbackText,
  fallbackColor = '#666666',
  ...props
}: ImageWithFallbackProps) => {
  const [failed, setFailed] = useState(false);

  // Handle no source or failed load
  if (failed || !source || (typeof source === 'object' && 'uri' in source && !source.uri)) {
    return (
      <View style={[style, styles.fallback]}>
        {fallbackIcon ? (
          <Ionicons name={fallbackIcon as keyof typeof Ionicons.glyphMap} size={48} color={fallbackColor} />
        ) : (
          <Text style={[styles.fallbackText, { color: fallbackColor }]}>
            {fallbackText || '📷'}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  fallbackText: {
    fontSize: 48,
  },
});

