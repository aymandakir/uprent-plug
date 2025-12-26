import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '@/hooks/use-notifications';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorView } from '@/components/ErrorView';
import { EmptyState } from '@/components/EmptyState';
import { OfflineBanner } from '@/components/OfflineBanner';
import type { Notification } from '@/types/notifications';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'match', label: 'Matches' },
  { id: 'application_update', label: 'Applications' },
  { id: 'system', label: 'System' },
] as const;

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function groupNotificationsByDate(notifications: Notification[]) {
  const groups: { [key: string]: Notification[] } = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((notification) => {
    const date = new Date(notification.created_at);
    if (date >= today) {
      groups.Today.push(notification);
    } else if (date >= yesterday) {
      groups.Yesterday.push(notification);
    } else if (date >= weekAgo) {
      groups['This Week'].push(notification);
    } else {
      groups.Older.push(notification);
    }
  });

  return Object.entries(groups).filter(([_, items]) => items.length > 0);
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'match':
      return 'flash';
    case 'price_drop':
      return 'trending-down';
    case 'application_update':
      return 'document-text';
    default:
      return 'notifications';
  }
}

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

function NotificationCard({ notification, onPress, onMarkAsRead, onDelete }: NotificationCardProps) {
  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={[styles.swipeAction, styles.swipeActionDelete]}
        onPress={onDelete}
      >
        <Ionicons name="trash-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={[styles.swipeAction, styles.swipeActionRead]}
        onPress={onMarkAsRead}
      >
        <Ionicons name="checkmark-circle-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={!notification.read ? renderLeftActions : undefined}
      overshootRight={false}
      overshootLeft={false}
    >
      <TouchableOpacity
        style={[styles.notificationCard, !notification.read && styles.notificationCardUnread]}
        onPress={onPress}
      >
        <View style={styles.notificationIcon}>
          <Ionicons
            name={getNotificationIcon(notification.type) as any}
            size={24}
            color={notification.read ? '#888888' : '#ffffff'}
          />
        </View>
        <View style={styles.notificationContent}>
          <Text
            style={[
              styles.notificationTitle,
              !notification.read && styles.notificationTitleUnread,
            ]}
          >
            {notification.title}
          </Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.notificationTime}>
            {formatRelativeTime(notification.created_at)}
          </Text>
        </View>
        {!notification.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Swipeable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('all');
  const { data: notifications = [], isLoading, error, refetch, isRefetching } = useNotifications(
    activeTab === 'all' ? undefined : activeTab
  );
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const groupedNotifications = groupNotificationsByDate(notifications);

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read) {
      markAsRead.mutate({ notificationId: notification.id });
    }

    // Navigate based on type
    if (notification.data?.propertyId) {
      router.push(`/(app)/property/${notification.data.propertyId}`);
    } else if (notification.data?.applicationId) {
      router.push(`/(app)/(tabs)/saved`); // Navigate to applications
    } else if (notification.data?.matchId) {
      router.push(`/(app)/(tabs)/matches`);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  if (error) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <ErrorView
          title="Failed to load notifications"
          message={error.message || 'Something went wrong. Please try again.'}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <OfflineBanner />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && notifications.some((n) => !n.read) && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllButton}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      {isLoading && !notifications.length ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonMessage} />
              </View>
            </View>
          ))}
        </View>
      ) : groupedNotifications.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#ffffff" />
          }
        >
          <EmptyState
            icon="notifications-outline"
            title="No notifications yet"
            message="Your notifications will appear here"
          />
        </ScrollView>
      ) : (
        <FlashList
          data={groupedNotifications}
          renderItem={({ item: [groupName, groupNotifications] }) => (
            <View style={styles.group}>
              <Text style={styles.groupTitle}>{groupName}</Text>
              {groupNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onPress={() => handleNotificationPress(notification)}
                  onMarkAsRead={() => markAsRead.mutate({ notificationId: notification.id })}
                  onDelete={() => deleteNotification.mutate({ notificationId: notification.id })}
                />
              ))}
            </View>
          )}
          estimatedItemSize={100}
          keyExtractor={(item) => item[0]}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#ffffff" />
          }
        />
      )}
    </GestureHandlerRootView>
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
  markAllButton: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  notificationCardUnread: {
    borderColor: '#333333',
    backgroundColor: '#1a1a1a',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 4,
  },
  notificationTitleUnread: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666666',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0084ff',
    alignSelf: 'center',
    marginLeft: 8,
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  swipeAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  swipeActionRead: {
    backgroundColor: '#4CAF50',
  },
  swipeActionDelete: {
    backgroundColor: '#F44336',
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333333',
  },
  skeletonContent: {
    flex: 1,
    gap: 8,
  },
  skeletonTitle: {
    height: 16,
    width: '60%',
    backgroundColor: '#333333',
    borderRadius: 4,
  },
  skeletonMessage: {
    height: 14,
    width: '80%',
    backgroundColor: '#333333',
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
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
});