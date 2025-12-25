'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Archive, Search, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import type { InAppNotification, NotificationType } from '@/types/notifications';

type FilterType = 'all' | 'unread' | NotificationType;

export default function NotificationsPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotifications();
    const cleanup = subscribeToNotifications();
    return cleanup;
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('channel', 'in_app')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter === 'unread') {
        query = query.eq('read', false);
      } else if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data } = await query;

      if (data) {
        setNotifications(data as any);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    let channel: any = null;
    
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        channel = supabase
          .channel(`notifications:${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const newNotification = payload.new as any;
              setNotifications((prev) => [newNotification, ...prev]);
            }
          )
          .subscribe();
      } catch (error) {
        console.error('Failed to subscribe to notifications:', error);
      }
    })();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true, readAt: new Date() } : n
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, readAt: new Date() }))
      );
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleBulkAction = async (action: 'read' | 'delete') => {
    if (selectedIds.size === 0) {
      toast.error('No notifications selected');
      return;
    }

    try {
      const ids = Array.from(selectedIds);
      if (action === 'read') {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true, read_at: new Date().toISOString() })
          .in('id', ids);

        if (error) throw error;

        setNotifications((prev) =>
          prev.map((n) =>
            ids.includes(n.id) ? { ...n, read: true, readAt: new Date() } : n
          )
        );
        toast.success(`${ids.length} notifications marked as read`);
      } else if (action === 'delete') {
        const { error } = await supabase.from('notifications').delete().in('id', ids);

        if (error) throw error;

        setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
        toast.success(`${ids.length} notifications deleted`);
      }

      setSelectedIds(new Set());
    } catch (error) {
      toast.error(`Failed to ${action} notifications`);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_match':
        return '⭐';
      case 'price_drop':
        return '💰';
      case 'application_update':
        return '📄';
      case 'message_received':
        return '💬';
      case 'viewing_reminder':
        return '📅';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'new_match':
        return 'bg-blue-500';
      case 'price_drop':
        return 'bg-green-500';
      case 'application_update':
        return 'bg-purple-500';
      case 'message_received':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const groupedNotifications = groupByDate(filteredNotifications);

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-content px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-heading font-bold text-white mb-2">Notifications</h1>
          <p className="text-body text-white/60">Stay updated on your matches, applications, and messages</p>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications..."
                  className="input w-full pl-10"
                />
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="input"
            >
              <option value="all">All notifications</option>
              <option value="unread">Unread only</option>
              <option value="new_match">Matches</option>
              <option value="application_update">Applications</option>
              <option value="message_received">Messages</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="card flex items-center justify-between">
              <span className="text-body text-white">
                {selectedIds.size} {selectedIds.size === 1 ? 'notification' : 'notifications'} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('read')}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Mark as read
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn-secondary flex items-center gap-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-20 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="card text-center py-24">
            <Bell className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-h3 font-heading font-bold text-white mb-2">No notifications</h3>
            <p className="text-body text-white/60">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedNotifications).map(([dateGroup, items]) => (
              <div key={dateGroup}>
                <h2 className="text-body-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
                  {dateGroup}
                </h2>
                <div className="space-y-2">
                  {items.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'card cursor-pointer hover:border-white/20 transition-colors',
                        !notification.read && 'border-electric-blue/50 bg-electric-blue/5'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(notification.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedIds);
                            if (e.target.checked) {
                              newSelected.add(notification.id);
                            } else {
                              newSelected.delete(notification.id);
                            }
                            setSelectedIds(newSelected);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 h-4 w-4 rounded border-white/20 text-electric-blue"
                        />

                        {/* Icon */}
                        <div className={cn(
                          'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl',
                          getNotificationColor(notification.type as NotificationType)
                        )}>
                          {getNotificationIcon(notification.type as NotificationType)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-body-lg font-semibold text-white mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-body text-white/70">{notification.message}</p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-electric-blue ml-4" />
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-body-sm text-white/50">
                              {formatRelativeTime(notification.createdAt as any)}
                            </span>
                            {notification.linkUrl && (
                              <a
                                href={notification.linkUrl}
                                className="text-body-sm text-electric-blue hover:text-electric-blue/80"
                              >
                                {notification.linkLabel || 'View'}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4 text-white/60" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-white/60" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function groupByDate(notifications: InAppNotification[]): Record<string, InAppNotification[]> {
  const groups: Record<string, InAppNotification[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    'This Month': [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisMonth = new Date(today);
  thisMonth.setMonth(thisMonth.getMonth() - 1);

  notifications.forEach((notification) => {
    const createdAt = new Date(notification.createdAt);
    
    if (createdAt >= today) {
      groups['Today'].push(notification);
    } else if (createdAt >= yesterday) {
      groups['Yesterday'].push(notification);
    } else if (createdAt >= thisWeek) {
      groups['This Week'].push(notification);
    } else if (createdAt >= thisMonth) {
      groups['This Month'].push(notification);
    } else {
      groups['Older'].push(notification);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
}

