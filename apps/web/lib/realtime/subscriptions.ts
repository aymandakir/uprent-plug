/**
 * Real-time subscription utilities for Supabase
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Property, PropertyMatch } from '@/types';

/**
 * Subscribe to new property insertions
 */
export function subscribeToNewProperties(
  callback: (property: Property) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel('property-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'properties',
        filter: 'status=eq.active',
      },
      (payload) => {
        callback(payload.new as any);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to new matches for a user
 */
export function subscribeToMatches(
  userId: string,
  callback: (match: PropertyMatch) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`matches:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as any);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to application status updates
 */
export function subscribeToApplicationUpdates(
  userId: string,
  callback: (application: any) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`applications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'applications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new || payload.old);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to notifications for a user
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: any) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a channel
 */
export function unsubscribe(channel: RealtimeChannel) {
  const supabase = createClient();
  return supabase.removeChannel(channel);
}

