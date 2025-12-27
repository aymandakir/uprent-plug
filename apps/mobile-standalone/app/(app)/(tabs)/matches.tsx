import { useState, useCallback, useEffect } from 'react';
import { storage } from '@/utils/storage';
import { haptic } from '@/utils/haptics';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMatches, type MatchFilters, type MatchSortOption } from '@/hooks/use-matches';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/LoadingSkeleton';
import { ErrorView } from '@/components/ErrorView';
import { EmptyState } from '@/components/EmptyState';
import { OfflineBanner } from '@/components/OfflineBanner';

export default function MatchesScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState<MatchFilters>();
  const [sort, setSort] = useState<MatchSortOption>({ field: 'match_score', order: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const { data: matches = [], isLoading, error, refetch, isRefetching } = useMatches(filters, sort);

  // Load saved filter preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      const savedFilters = await storage.loadFilterPreferences();
      if (savedFilters) {
        setFilters(savedFilters);
      }
    };
    loadPreferences();
  }, []);

  // Save filter preferences when they change
  useEffect(() => {
    if (filters) {
      storage.saveFilterPreferences(filters).catch(console.error);
    }
  }, [filters]);

  const handleFilterApply = useCallback((newFilters: MatchFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  }, []);

  const handleSortSelect = useCallback((newSort: MatchSortOption) => {
    setSort(newSort);
    setShowSort(false);
  }, []);

  // Memoize renderItem callback for FlashList
  const renderPropertyCard = useCallback(
    ({ item }: { item: any }) => (
      <PropertyCard
        match={item}
        onPress={() => router.push(`/(app)/property/${item.property_id}`)}
      />
    ),
    [router]
  );

  // Loading state
  if (isLoading && !matches.length) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
        </View>
        <View style={styles.container}>
          {[1, 2, 3].map((i) => (
            <PropertyCardSkeleton key={i} />
          ))}
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
          title="Failed to load matches"
          message={error.message || 'Something went wrong. Please try again.'}
          onRetry={refetch}
        />
      </View>
    );
  }

  // Empty state
  if (!matches || matches.length === 0) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowSort(true)}
            >
              <Ionicons name="swap-vertical-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(true)}
            >
              <Ionicons name="filter-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#ffffff" />
          }
        >
          <EmptyState
            icon="flash-outline"
            title="No matches yet"
            message="Create a search profile to start receiving property matches."
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OfflineBanner />
      {/* Header with Filters and Sort */}
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              haptic.light();
              setShowSort(true);
            }}
          >
            <Ionicons name="swap-vertical-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              haptic.light();
              setShowFilters(true);
            }}
          >
            <Ionicons name="filter-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Matches List */}
      <FlashList
        data={matches}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#ffffff" />
        }
        onEndReachedThreshold={0.5}
        estimatedItemSize={300}
      />

      {/* Filters Modal */}
      <FiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleFilterApply}
        currentFilters={filters}
      />

      {/* Sort Modal */}
      <SortModal
        visible={showSort}
        onClose={() => setShowSort(false)}
        onSelect={handleSortSelect}
        currentSort={sort}
      />
    </View>
  );
}

function FiltersModal({
  visible,
  onClose,
  onApply,
  currentFilters,
}: {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: MatchFilters) => void;
  currentFilters?: MatchFilters;
}) {
  const [filters] = useState<MatchFilters>(currentFilters || {});

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Add filter inputs here - simplified for now */}
            <Text style={styles.modalText}>Filter options coming soon...</Text>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={() => onApply(filters)}
            >
              <Text style={styles.modalButtonTextPrimary}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SortModal({
  visible,
  onClose,
  onSelect,
  currentSort,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (sort: MatchSortOption) => void;
  currentSort: MatchSortOption;
}) {
  const sortOptions: MatchSortOption[] = [
    { field: 'match_score', order: 'desc' },
    { field: 'matched_at', order: 'desc' },
    { field: 'price_monthly', order: 'asc' },
    { field: 'price_monthly', order: 'desc' },
  ];

  const getSortLabel = (sort: MatchSortOption) => {
    if (sort.field === 'match_score') return 'Match Score (Highest)';
    if (sort.field === 'matched_at') return 'Newest Listings';
    if (sort.field === 'price_monthly' && sort.order === 'asc') return 'Price (Low to High)';
    if (sort.field === 'price_monthly' && sort.order === 'desc') return 'Price (High to Low)';
    return 'Match Score';
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {sortOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sortOption,
                  currentSort.field === option.field && currentSort.order === option.order && styles.sortOptionActive,
                ]}
                onPress={() => onSelect(option)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    currentSort.field === option.field && currentSort.order === option.order && styles.sortOptionTextActive,
                  ]}
                >
                  {getSortLabel(option)}
                </Text>
                {currentSort.field === option.field && currentSort.order === option.order && (
                  <Ionicons name="checkmark" size={24} color="#ffffff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
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
    gap: 12,
  },
  filterButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#000000',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalBody: {
    padding: 24,
  },
  modalText: {
    color: '#888888',
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#ffffff',
  },
  modalButtonSecondary: {
    backgroundColor: '#333333',
  },
  modalButtonTextPrimary: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#333333',
  },
  sortOptionActive: {
    backgroundColor: '#444444',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#888888',
  },
  sortOptionTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});