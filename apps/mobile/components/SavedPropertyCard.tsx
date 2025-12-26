import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import type { SavedProperty } from '@/types/property';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2; // 2 columns with gap

interface SavedPropertyCardProps {
  savedProperty: SavedProperty;
  onPress: () => void;
  onUnsave: () => void;
  selected?: boolean;
  onSelect?: () => void;
}

export const SavedPropertyCard = memo(function SavedPropertyCard({
  savedProperty,
  onPress,
  onUnsave,
  selected,
  onSelect,
}: SavedPropertyCardProps) {
  const property = savedProperty.property;
  const images = property?.images || property?.photos || [];
  const mainImage = images[0];

  if (!property) return null;

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect ? onSelect : onPress}
      onLongPress={onSelect}
      activeOpacity={0.9}
    >
      {/* Image */}
      {mainImage ? (
        <Image
          source={{ uri: mainImage }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="home-outline" size={32} color="#666666" />
        </View>
      )}

      {/* Selection Indicator */}
      {selected && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onUnsave();
          }}
        >
          <Ionicons name="heart" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* Property Info */}
      <View style={styles.content}>
        <Text style={styles.price}>€{property.price_monthly.toLocaleString()}/mo</Text>
        <Text style={styles.address} numberOfLines={1}>
          {property.address}
        </Text>
        <View style={styles.details}>
          {property.bedrooms && (
            <Text style={styles.detail}>{property.bedrooms} bed</Text>
          )}
          {property.size_sqm && (
            <Text style={styles.detail}>· {property.size_sqm}m²</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: 160,
  },
  placeholderImage: {
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
  },
  actions: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    fontSize: 12,
    color: '#888888',
  },
});
