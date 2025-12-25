'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Settings, Check, CheckCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import type { InAppNotification, NotificationType } from '@/types/notifications';

export function NotificationBell() {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    const cleanup = subscribeToNotifications();
    return cleanup;
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('channel', 'in_app')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setNotifications(data as any);
        setUnreadCount(data.filter((n) => !n.read).length);
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
              if (!newNotification.read) {
                setUnreadCount((prev) => prev + 1);
              }
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

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
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
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
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

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Bell className="h-5 w-5 text-white/80" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-caption font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 max-h-[600px] bg-neutral-900 rounded-xl border border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-h4 font-heading font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-body-sm text-electric-blue hover:text-electric-blue/80"
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </button>
                <Link
                  href="/dashboard/settings/notifications"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Settings className="h-4 w-4 text-white/60" />
                </Link>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-white/60">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <p className="text-body text-white/60">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-white/5 transition-colors cursor-pointer',
                        !notification.read && 'bg-electric-blue/5'
                      )}
                      onClick={() => {
                        if (notification.linkUrl) {
                          window.location.href = notification.linkUrl;
                        }
                        if (!notification.read) {
                          handleMarkAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={cn(
                          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl',
                          getNotificationColor(notification.type as NotificationType)
                        )}>
                          {getNotificationIcon(notification.type as NotificationType)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-body font-semibold text-white mb-1">
                                {notification.title}
                              </p>
                              <p className="text-body-sm text-white/70 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-electric-blue" />
                            )}
                          </div>
                          <p className="text-caption text-white/50 mt-2">
                            {formatRelativeTime(notification.createdAt as any)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <Link
                href="/dashboard/notifications"
                className="block text-center text-body-sm text-electric-blue hover:text-electric-blue/80"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

