import { useState, useCallback } from 'react';
import { haptic } from '@/utils/haptics';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSavedProperties, useUnsaveProperty } from '@/hooks/use-saved';
import { SavedPropertyCard } from '@/components/SavedPropertyCard';
import { PropertyGridSkeleton } from '@/components/LoadingSkeleton';
import { ErrorView } from '@/components/ErrorView';
import { EmptyState } from '@/components/EmptyState';
import { OfflineBanner } from '@/components/OfflineBanner';

const NUM_COLUMNS = 2;

export default function SavedScreen() {
  const router = useRouter();
  const { data: savedProperties = [], isLoading, error, refetch, isRefetching } = useSavedProperties();
  const unsaveMutation = useUnsaveProperty();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Loading state
  if (isLoading && !savedProperties.length) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <View style={styles.header}>
          <Text style={styles.title}>Saved Properties</Text>
        </View>
        <View style={styles.skeletonContainer}>
          <PropertyGridSkeleton />
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <ErrorView
          title="Failed to load saved properties"
          message={error.message || 'Something went wrong. Please try again.'}
          onRetry={refetch}
        />
      </View>
    );
  }


  const handleSelect = useCallback(
    (propertyId: string) => {
      if (!selectionMode) return;

      haptic.selection();
      setSelectedIds((prev) => {
        const newSelected = new Set(prev);
        if (newSelected.has(propertyId)) {
          newSelected.delete(propertyId);
        } else {
          newSelected.add(propertyId);
        }

        if (newSelected.size === 0) {
          setSelectionMode(false);
        }

        return newSelected;
      });
    },
    [selectionMode]
  );

  const handleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === savedProperties.length) {
        return new Set();
      } else {
        return new Set(savedProperties.map((sp) => sp.property_id));
      }
    });
  }, [savedProperties]);

  const handleUnsave = useCallback(
    (propertyId: string) => {
      haptic.medium();
      unsaveMutation.mutate({ propertyId });
      setSelectedIds((prev) => {
        if (prev.has(propertyId)) {
          const newSelected = new Set(prev);
          newSelected.delete(propertyId);
          return newSelected;
        }
        return prev;
      });
    },
    [unsaveMutation]
  );

  const handleBatchUnsave = useCallback(() => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      'Remove Properties',
      `Remove ${selectedIds.size} saved ${selectedIds.size === 1 ? 'property' : 'properties'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            selectedIds.forEach((propertyId) => {
              handleUnsave(propertyId);
            });
            setSelectedIds(new Set());
            setSelectionMode(false);
          },
        },
      ]
    );
  }, [selectedIds.size, handleUnsave]);

  const handleCancelSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

  // Memoize renderItem callback for FlashList
  const renderSavedPropertyCard = useCallback(
    ({ item }: { item: any }) => (
      <SavedPropertyCard
        savedProperty={item}
        onPress={() => router.push(`/(app)/property/${item.property_id}`)}
        onUnsave={() => handleUnsave(item.property_id)}
        selected={selectedIds.has(item.property_id)}
        onSelect={() => handleSelect(item.property_id)}
      />
    ),
    [router, handleUnsave, handleSelect, selectedIds]
  );

  if (error) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <ErrorView
          title="Failed to load saved properties"
          message={(error as { message?: string })?.message || 'Something went wrong. Please try again.'}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OfflineBanner />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saved Properties</Text>
        {selectionMode ? (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={styles.headerButtonText}>
                {selectedIds.size === savedProperties.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelSelection}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/matches')}>
            <Ionicons name="add-circle-outline" size={28} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Batch Actions Bar */}
      {selectionMode && selectedIds.size > 0 && (
        <View style={styles.batchActions}>
          <Text style={styles.batchActionsText}>
            {selectedIds.size} {selectedIds.size === 1 ? 'property' : 'properties'} selected
          </Text>
          <TouchableOpacity
            style={styles.batchActionButton}
            onPress={handleBatchUnsave}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
            <Text style={styles.batchActionButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Properties Grid */}
      {savedProperties.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#ffffff" />
          }
        >
          <EmptyState
            icon="heart-outline"
            title="No saved properties"
            message="Start browsing matches and save properties you like"
            actionLabel="Browse Matches"
            onAction={() => router.push('/(app)/(tabs)/matches')}
          />
        </ScrollView>
      ) : (
        <FlashList
          data={savedProperties}
          renderItem={renderSavedPropertyCard}
          numColumns={NUM_COLUMNS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#ffffff" />
          }
          estimatedItemSize={200}
        />
      )}
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  batchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  batchActionsText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  batchActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  batchActionButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  skeletonContainer: {
    padding: 24,
  },
  listContent: {
    padding: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
});