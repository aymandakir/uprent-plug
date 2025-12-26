import { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { PropertyMatch } from '@/types/property';
import { useSaveProperty, useUnsaveProperty } from '@/hooks/use-matches';
import { useToast } from '@/hooks/use-toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48; // padding on both sides

interface PropertyCardProps {
  match: PropertyMatch;
  onPress: () => void;
  isSaved?: boolean;
}

export const PropertyCard = memo(function PropertyCard({ match, onPress, isSaved: initialSaved }: PropertyCardProps) {
  const property = match.property;
  const images = property?.images || property?.photos || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saved, setSaved] = useState(initialSaved || false);
  const toast = useToast();

  const saveMutation = useSaveProperty();
  const unsaveMutation = useUnsaveProperty();

  if (!property) return null;

  const handleSave = async () => {
    const wasSaved = saved;
    // Optimistic update
    setSaved(!saved);

    try {
      if (wasSaved) {
        await unsaveMutation.mutateAsync({ propertyId: property.id });
        toast.show.success('Property unsaved');
      } else {
        await saveMutation.mutateAsync({ propertyId: property.id });
        toast.show.success('Property saved');
      }
    } catch (error) {
      // Revert on error
      setSaved(wasSaved);
      toast.show.error('Failed to update property');
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image Carousel */}
      {images.length > 0 ? (
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {images.slice(0, 5).map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            ))}
          </ScrollView>
          
          {/* Image dots */}
          {images.length > 1 && (
            <View style={styles.dotsContainer}>
              {images.slice(0, 5).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentImageIndex === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Match Score Badge */}
          <View style={styles.matchBadge}>
            <Text style={styles.matchScore}>{match.match_score}%</Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={(e) => {
              e.stopPropagation();
              handleSave();
            }}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={24}
              color={saved ? '#ff4444' : '#ffffff'}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.imageContainer, styles.placeholderImage]}>
          <Image
            source={{ uri: 'https://picsum.photos/800/600?random=' + property.id }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          />
          <View style={styles.matchBadge}>
            <Text style={styles.matchScore}>{match.match_score}%</Text>
          </View>
        </View>
      )}

      {/* Property Info */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.price}>€{property.price_monthly.toLocaleString()}/mo</Text>
          {property.size_sqm && (
            <Text style={styles.size}>{property.size_sqm}m²</Text>
          )}
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {property.address}
        </Text>

        <View style={styles.details}>
          {property.bedrooms && (
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={16} color="#888888" />
              <Text style={styles.detailText}>{property.bedrooms}</Text>
            </View>
          )}
          {property.bathrooms && (
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={16} color="#888888" />
              <Text style={styles.detailText}>{property.bathrooms}</Text>
            </View>
          )}
          {property.property_type && (
            <Text style={styles.propertyType}>{property.property_type}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: 240,
    position: 'relative',
  },
  image: {
    width: CARD_WIDTH,
    height: 240,
  },
  placeholderImage: {
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: '#ffffff',
    width: 20,
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  matchScore: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  size: {
    fontSize: 16,
    color: '#888888',
  },
  address: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#888888',
  },
  propertyType: {
    fontSize: 14,
    color: '#888888',
    textTransform: 'capitalize',
  },
});