import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/use-dashboard';
import { ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { data, isLoading, error, refetch, isRefetching } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const userName = data?.userName || user?.email?.split('@')[0] || 'User';

  if (isLoading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading dashboard</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = data?.stats || {
    activeSearches: 0,
    newMatches: 0,
    applications: 0,
    savedProperties: 0,
  };

  const activities = data?.activities || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing || isRefetching} onRefresh={onRefresh} tintColor="#ffffff" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/(app)/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
            {stats.newMatches > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.newMatches > 9 ? '9+' : stats.newMatches}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => router.push('/(app)/(tabs)/profile')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards - Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
        style={styles.statsScroll}
      >
        <View style={[styles.statCard, { backgroundColor: '#1a1a1a' }]}>
          <Ionicons name="search" size={24} color="#ffffff" />
          <Text style={styles.statValue}>{stats.activeSearches}</Text>
          <Text style={styles.statLabel}>Active Searches</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#1a1a1a' }]}>
          <Ionicons name="flash" size={24} color="#ffffff" />
          <Text style={styles.statValue}>{stats.newMatches}</Text>
          <Text style={styles.statLabel}>New Matches</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#1a1a1a' }]}>
          <Ionicons name="heart" size={24} color="#ffffff" />
          <Text style={styles.statValue}>{stats.savedProperties}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#1a1a1a' }]}>
          <Ionicons name="document-text" size={24} color="#ffffff" />
          <Text style={styles.statValue}>{stats.applications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(app)/(tabs)/matches')}
          >
            <Ionicons name="add-circle-outline" size={32} color="#ffffff" />
            <Text style={styles.quickActionText}>Create Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(app)/(tabs)/matches')}
          >
            <Ionicons name="flash" size={32} color="#ffffff" />
            <Text style={styles.quickActionText}>Browse Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(app)/generate-letter')}
          >
            <Ionicons name="create-outline" size={32} color="#ffffff" />
            <Text style={styles.quickActionText}>AI Letter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(app)/(tabs)/saved')}
          >
            <Ionicons name="list-outline" size={32} color="#ffffff" />
            <Text style={styles.quickActionText}>Applications</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {activities.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#666666" />
            <Text style={styles.emptyStateText}>No recent activity</Text>
            <Text style={styles.emptyStateSubtext}>Your matches and saved properties will appear here</Text>
          </View>
        ) : (
          <View style={styles.activitiesList}>
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityItem}
                onPress={() => {
                  if (activity.propertyId) {
                    router.push(`/(app)/property/${activity.propertyId}`);
                  }
                }}
              >
                {activity.thumbnail ? (
                  <Image source={{ uri: activity.thumbnail }} style={styles.activityThumbnail} />
                ) : (
                  <View style={[styles.activityThumbnail, styles.activityThumbnailPlaceholder]}>
                    <Ionicons name="home-outline" size={24} color="#666666" />
                  </View>
                )}
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle} numberOfLines={1}>
                    {activity.title}
                  </Text>
                  <Text style={styles.activitySubtitle} numberOfLines={1}>
                    {activity.subtitle}
                  </Text>
                  <Text style={styles.activityTime}>
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsScroll: {
    marginBottom: 32,
  },
  statsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  statCard: {
    width: CARD_WIDTH,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888888',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 48 - 12) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  quickActionText: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 12,
    textAlign: 'center',
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  activityThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  activityThumbnailPlaceholder: {
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
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
});