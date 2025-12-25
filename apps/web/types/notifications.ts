/**
 * Notification types and interfaces
 */

export enum NotificationType {
  NEW_MATCH = 'new_match',
  PRICE_DROP = 'price_drop',
  APPLICATION_UPDATE = 'application_update',
  MESSAGE_RECEIVED = 'message_received',
  VIEWING_REMINDER = 'viewing_reminder',
  PROPERTY_REMOVED = 'property_removed',
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms';

export interface InAppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  color?: string;
  priority: NotificationPriority;
  
  // Links
  linkUrl?: string;
  linkLabel?: string;
  
  // Related entities
  propertyId?: string;
  applicationId?: string;
  matchId?: string;
  
  // Status
  read: boolean;
  readAt?: Date;
  dismissed: boolean;
  
  // Display
  showDuration?: number; // milliseconds (for toasts)
  persistent?: boolean; // stays until dismissed
  
  createdAt: Date;
}

export interface NotificationRule {
  id: string;
  trigger: NotificationTrigger;
  conditions: NotificationCondition[];
  channels: NotificationChannel[];
  priority: NotificationPriority;
  batchingStrategy?: BatchingStrategy;
  quietHours?: QuietHours;
}

export type NotificationTrigger =
  | 'NEW_MATCH'
  | 'APPLICATION_STATUS_CHANGE'
  | 'PROPERTY_PRICE_CHANGE'
  | 'MESSAGE_RECEIVED'
  | 'VIEWING_REMINDER'
  | 'SCHEDULED';

export interface NotificationCondition {
  field: string;
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'IN' | 'NOT_IN';
  value: any;
}

export type BatchingStrategy =
  | 'IMMEDIATE'
  | { type: 'TIME_WINDOW'; windowMinutes: number; maxBatchSize?: number }
  | { type: 'DAILY'; time: string; timezone?: string };

export interface QuietHours {
  enabled: boolean;
  start: string; // "22:00"
  end: string; // "08:00"
  timezone?: string;
  exceptions?: NotificationType[];
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, any>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  tag?: string;
  requireInteraction?: boolean;
  vibrate?: number[];
}

