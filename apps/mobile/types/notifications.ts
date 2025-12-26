export interface Notification {
  id: string;
  user_id: string;
  type: 'match' | 'price_drop' | 'application_update' | 'system';
  title: string;
  message: string;
  data?: {
    propertyId?: string;
    applicationId?: string;
    matchId?: string;
    [key: string]: any;
  };
  read: boolean;
  created_at: string;
}

export interface NotificationSettings {
  enabled: boolean;
  newMatches: boolean;
  priceDrops: boolean;
  applicationUpdates: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

