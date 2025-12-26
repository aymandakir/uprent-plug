import { useState } from 'react';
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
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorView } from '@/components/ErrorView';
import { EmptyState } from '@/components/EmptyState';
import { OfflineBanner } from '@/components/OfflineBanner';
import type { SavedProperty } from '@/types/property';

const NUM_COLUMNS = 2;

export default function SavedScreen() {
  const router = useRouter();
  const { data: savedProperties = [], isLoading, error, refetch, isRefetching } = useSavedProperties();
  const unsaveMutation = useUnsaveProperty();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleLongPress = () => {
    setSelectionMode(true);
  };

  const handleSelect = (propertyId: string) => {
    if (!selectionMode) return;

    const newSelected = new Set(selectedIds);
    if (newSelected.has(propertyId)) {
      newSelected.delete(propertyId);
    } else {
      newSelected.add(propertyId);
    }
    setSelectedIds(newSelected);

    if (newSelected.size === 0) {
      setSelectionMode(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === savedProperties.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(savedProperties.map((sp) => sp.property_id)));
    }
  };

  const handleUnsave = (propertyId: string) => {
    unsaveMutation.mutate({ propertyId });
    if (selectedIds.has(propertyId)) {
      const newSelected = new Set(selectedIds);
      newSelected.delete(propertyId);
      setSelectedIds(newSelected);
    }
  };

  const handleBatchUnsave = () => {
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
  };

  const handleCancelSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

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
      {isLoading && !savedProperties.length ? (
        <View style={styles.skeletonContainer}>
          <LoadingSkeleton.PropertyGridSkeleton />
        </View>
      ) : savedProperties.length === 0 ? (
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
          renderItem={({ item }) => (
            <SavedPropertyCard
              savedProperty={item}
              onPress={() => router.push(`/(app)/property/${item.property_id}`)}
              onUnsave={() => handleUnsave(item.property_id)}
              selected={selectedIds.has(item.property_id)}
              onSelect={() => handleSelect(item.property_id)}
            />
          )}
          numColumns={NUM_COLUMNS}
          estimatedItemSize={280}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#ffffff" />
          }
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