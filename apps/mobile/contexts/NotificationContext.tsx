import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { supabase } from '@/lib/supabase';

interface NotificationContextType {
  expoPushToken: string | null;
  permissionStatus: Notifications.PermissionStatus;
  requestPermissions: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { expoPushToken, permissionStatus, requestPermissions } = usePushNotifications();

  useEffect(() => {
    // Clean up token on logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT' && expoPushToken) {
        // Remove token from backend
        try {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/notifications/unregister-device`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: expoPushToken,
            }),
          });
        } catch (error) {
          console.error('Error unregistering push token:', error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [expoPushToken]);

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        permissionStatus,
        requestPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}

