import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Linking,
} from 'react-native';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProperty, useIsSaved } from '@/hooks/use-property';
import { useSaveProperty, useUnsaveProperty } from '@/hooks/use-matches';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorView } from '@/components/ErrorView';
import { useToast } from '@/hooks/use-toast';
import { OfflineBanner } from '@/components/OfflineBanner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id!);
  const { data: isSaved = false } = useIsSaved(id!);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saved, setSaved] = useState(isSaved);

  const saveMutation = useSaveProperty();
  const unsaveMutation = useUnsaveProperty();
  const toast = useToast();

  const images = property?.images || property?.photos || [];

  // Save to recently viewed when property loads
  useEffect(() => {
    if (id) {
      storage.addToRecentlyViewed(id).catch(console.error);
    }
  }, [id]);

  const handleShare = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/property/${id}`;
      await Share.share({
        message: `Check out this property: ${property?.address}\n${url}`,
        url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    const wasSaved = saved;
    // Optimistic update
    setSaved(!saved);

    try {
      if (wasSaved) {
        await unsaveMutation.mutateAsync({ propertyId: id });
        toast.show.success('Property unsaved');
      } else {
        await saveMutation.mutateAsync({ propertyId: id });
        toast.show.success('Property saved');
      }
    } catch (error) {
      // Revert on error
      setSaved(wasSaved);
      toast.show.error('Failed to update property');
    }
  };

  const handleContact = () => {
    // In production, this would open email or phone
    Linking.openURL(`mailto:landlord@example.com?subject=Inquiry about ${property?.address}`);
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Property Details',
            headerShown: true,
            headerStyle: { backgroundColor: '#000000' },
            headerTintColor: '#ffffff',
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.container}>
          <OfflineBanner />
          <LoadingSpinner message="Loading property details..." />
        </View>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Property Details',
            headerShown: true,
            headerStyle: { backgroundColor: '#000000' },
            headerTintColor: '#ffffff',
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.container}>
          <OfflineBanner />
          <ErrorView
            title={error ? "Failed to load property" : "Property not found"}
            message={error?.message || "This property doesn't exist or has been removed."}
            onRetry={() => router.back()}
            retryLabel="Go Back"
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: property.address || 'Property Details',
          headerShown: true,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerBackTitle: 'Back',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16, marginRight: 16 }}>
              <TouchableOpacity onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Ionicons
                  name={saved ? 'heart' : 'heart-outline'}
                  size={24}
                  color={saved ? '#ff4444' : '#ffffff'}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
      <OfflineBanner />
      {/* Image Gallery */}
      {images.length > 0 ? (
        <View style={styles.imageGallery}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {images.map((image, index) => (
              <ImageWithFallback
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
                fallbackIcon="home-outline"
              />
            ))}
          </ScrollView>

          {/* Image dots */}
          {images.length > 1 && (
            <View style={styles.imageDots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.imageDot,
                    currentImageIndex === index && styles.imageDotActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerActionsRight}>
              <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
                <Ionicons
                  name={saved ? 'heart' : 'heart-outline'}
                  size={24}
                  color={saved ? '#ff4444' : '#ffffff'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.imageGallery, styles.placeholderImage]}>
          <Ionicons name="home-outline" size={64} color="#666666" />
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Property Info */}
        <View style={styles.infoSection}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>€{property.price_monthly.toLocaleString()}/mo</Text>
            {property.size_sqm && (
              <Text style={styles.size}>{property.size_sqm}m²</Text>
            )}
          </View>

          <Text style={styles.address}>{property.address}</Text>
          {property.neighborhood && (
            <Text style={styles.neighborhood}>{property.neighborhood}, {property.city}</Text>
          )}

          <View style={styles.propertyDetails}>
            {property.bedrooms && (
              <View style={styles.detailItem}>
                <Ionicons name="bed-outline" size={20} color="#888888" />
                <Text style={styles.detailText}>{property.bedrooms} bed</Text>
              </View>
            )}
            {property.bathrooms && (
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={20} color="#888888" />
                <Text style={styles.detailText}>{property.bathrooms} bath</Text>
              </View>
            )}
            {property.property_type && (
              <Text style={styles.propertyType}>{property.property_type}</Text>
            )}
          </View>

          {property.available_from && (
            <View style={styles.availability}>
              <Text style={styles.availabilityText}>
                Available from {new Date(property.available_from).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        {property.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>
        )}

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {property.furnished && (
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Furnished</Text>
              </View>
            )}
            {property.pets_allowed && (
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Pets Allowed</Text>
              </View>
            )}
            {property.balcony && (
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Balcony</Text>
              </View>
            )}
            {property.elevator && (
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Elevator</Text>
              </View>
            )}
            {property.parking && (
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Parking</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push({
              pathname: '/(app)/generate-letter',
              params: { propertyId: id! },
            })}
          >
            <Ionicons name="create-outline" size={24} color="#000000" />
            <Text style={styles.primaryButtonText}>Generate Application Letter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleContact}>
            <Ionicons name="mail-outline" size={24} color="#ffffff" />
            <Text style={styles.secondaryButtonText}>Contact Landlord</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton} onPress={handleSave}>
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={24}
              color={saved ? '#ff4444' : '#ffffff'}
            />
            <Text style={[styles.tertiaryButtonText, saved && styles.tertiaryButtonTextActive]}>
              {saved ? 'Saved' : 'Save Property'}
            </Text>
          </TouchableOpacity>
        </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGallery: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  placeholderImage: {
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  imageDotActive: {
    backgroundColor: '#ffffff',
    width: 24,
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerActionsRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  infoSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  size: {
    fontSize: 18,
    color: '#888888',
  },
  address: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  neighborhood: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 16,
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 16,
    color: '#888888',
  },
  propertyType: {
    fontSize: 16,
    color: '#888888',
    textTransform: 'capitalize',
  },
  availability: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
  },
  availabilityText: {
    fontSize: 14,
    color: '#ffffff',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
  },
  actionsSection: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  tertiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  tertiaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  tertiaryButtonTextActive: {
    color: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#000000',
    fontWeight: '600',
  },
});