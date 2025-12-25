/**
 * Notification service utilities
 */

import { createClient } from '@/lib/supabase/server';
import type { NotificationType, NotificationPriority } from '@/types/notifications';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  linkUrl?: string;
  linkLabel?: string;
  propertyId?: string;
  applicationId?: string;
  matchId?: string;
  channels?: ('in_app' | 'email' | 'push' | 'sms')[];
}

/**
 * Create a notification
 */
export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createClient();
  const channels = params.channels || ['in_app'];

  const notifications = [];

  for (const channel of channels) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        priority: params.priority || 'normal',
        link_url: params.linkUrl,
        link_label: params.linkLabel,
        property_id: params.propertyId,
        application_id: params.applicationId,
        channel,
        read: false,
        delivered: channel !== 'in_app', // In-app is immediate
      })
      .select()
      .single();

    if (error) {
      console.error(`Failed to create ${channel} notification:`, error);
    } else {
      notifications.push(data);
    }
  }

  // Send email notification if requested
  if (channels.includes('email')) {
    await sendEmailNotification(params);
  }

  // Send push notification if requested
  if (channels.includes('push')) {
    await sendPushNotification(params);
  }

  // Send SMS notification if requested (Premium only)
  if (channels.includes('sms')) {
    await sendSMSNotification(params);
  }

  return notifications;
}

/**
 * Send email notification via Resend
 */
async function sendEmailNotification(params: CreateNotificationParams) {
  try {
    const response = await fetch('/api/notifications/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        linkUrl: params.linkUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Email notification error:', error);
  }
}

/**
 * Send push notification
 */
async function sendPushNotification(params: CreateNotificationParams) {
  try {
    // This would integrate with service worker and push API
    // For now, just log
    console.log('Push notification:', params);
  } catch (error) {
    console.error('Push notification error:', error);
  }
}

/**
 * Send SMS notification (Premium only, via Twilio)
 */
async function sendSMSNotification(params: CreateNotificationParams) {
  try {
    const response = await fetch('/api/notifications/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: params.userId,
        message: `${params.title}: ${params.message}`,
        linkUrl: params.linkUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }
  } catch (error) {
    console.error('SMS notification error:', error);
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) throw error;
  return true;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
  return true;
}

