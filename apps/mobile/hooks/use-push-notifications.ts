import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Linking } from 'react-native';
import { supabase } from '@/lib/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PushNotificationToken {
  token: string;
  deviceId: string;
  platform: 'ios' | 'android';
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus>(
    Notifications.PermissionStatus.UNDETERMINED
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        registerTokenWithBackend(token);
      }
    });

    // Listener for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      // Handle foreground notifications (can show custom in-app banner)
      console.log('Notification received:', notification);
    });

    // Listener for when user taps notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      handleNotificationTap(data);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const registerForPushNotificationsAsync = async (): Promise<string | null> => {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return null;
    }

    // Check current permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    setPermissionStatus(existingStatus);

    if (existingStatus !== 'granted') {
      // Request permission
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);
      if (status !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
      });
      return tokenData.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  };

  const registerTokenWithBackend = async (token: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const deviceId = Device.modelId || 'unknown';
      const platform = Platform.OS as 'ios' | 'android';

      // Register with backend API
      // Note: Create this API route if it doesn't exist
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/notifications/register-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          token,
          deviceId,
          platform,
        }),
      });
    } catch (error) {
      console.error('Error registering push token:', error);
    }
  };

  const handleNotificationTap = (data: any) => {
    // Navigate based on notification type
    // This will be handled by the app's navigation system
    // For now, just log the data
    console.log('Notification tapped:', data);
    // Navigation will be handled by linking configuration
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    if (status === 'granted') {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        await registerTokenWithBackend(token);
      }
      return true;
    }
    return false;
  };

  return {
    expoPushToken,
    permissionStatus,
    requestPermissions,
  };
}
