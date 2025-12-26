import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/use-auth';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useUserProfile, useUpdateProfile, useDeleteAccount } from '@/hooks/use-user-profile';
import { supabase } from '@/lib/supabase';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { permissionStatus, requestPermissions } = useNotificationContext();
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const isPremium = profile?.subscription_tier === 'premium';
  const isBasic = profile?.subscription_tier === 'basic';
  const notificationsEnabled = permissionStatus === Notifications.PermissionStatus.GRANTED;

  const handleAvatarPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'We need camera roll permissions to change your avatar');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadingAvatar(true);
      try {
        // Upload to Supabase storage
        const file = result.assets[0];
        const fileExt = file.uri.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Convert to blob
        const response = await fetch(file.uri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, blob, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

        // Update user profile
        await updateProfile.mutateAsync({ avatar_url: data.publicUrl });
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to upload avatar');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleEditProfile = () => {
    Alert.prompt(
      'Edit Profile',
      'Enter your name',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (name) => {
            if (name) {
              try {
                await updateProfile.mutateAsync({ full_name: name });
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to update profile');
              }
            }
          },
        },
      ],
      'plain-text',
      profile?.full_name || ''
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password reset link will be sent to your email', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send Link',
        onPress: async () => {
          if (user?.email) {
            const { error } = await supabase.auth.resetPasswordForEmail(user.email);
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              Alert.alert('Success', 'Check your email for the password reset link');
            }
          }
        },
      },
    ]);
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in Settings to receive alerts.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else {
      Alert.alert(
        'Disable Notifications',
        'To disable notifications, please go to Settings > Uprent Plus > Notifications',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount.mutateAsync();
              router.replace('/');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          await signOut();
          router.replace('/');
        },
      },
    ]);
  };

  const getSubscriptionBadgeColor = () => {
    if (isPremium) return '#9C27B0';
    if (isBasic) return '#2196F3';
    return '#888888';
  };

  const getSubscriptionLabel = () => {
    if (isPremium) return 'Premium';
    if (isBasic) return 'Basic';
    return 'Free';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleAvatarPress} disabled={uploadingAvatar}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          {uploadingAvatar && (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator color="#ffffff" />
            </View>
          )}
          <View style={styles.avatarEditIcon}>
            <Ionicons name="camera" size={16} color="#ffffff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{profile?.full_name || user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.subscriptionBadge, { backgroundColor: getSubscriptionBadgeColor() }]}>
          <Text style={styles.subscriptionBadgeText}>{getSubscriptionLabel()}</Text>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
          <Ionicons name="person-outline" size={24} color="#ffffff" />
          <Text style={styles.settingLabel}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#888888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
          <Ionicons name="lock-closed-outline" size={24} color="#ffffff" />
          <Text style={styles.settingLabel}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#888888" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/(app)/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          <Text style={styles.settingLabel}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#888888" />
        </TouchableOpacity>
        <View style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive alerts on your device</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#333333', true: '#4CAF50' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Subscription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        {isPremium ? (
          <>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionInfoText}>
                Premium Plan Active
              </Text>
              {profile?.subscription_end_date && (
                <Text style={styles.subscriptionInfoSubtext}>
                  Next billing: {new Date(profile.subscription_end_date).toLocaleDateString()}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                // Open Stripe customer portal in web view
                router.push('/(app)/subscription/manage');
              }}
            >
              <Ionicons name="card-outline" size={24} color="#ffffff" />
              <Text style={styles.settingLabel}>Manage Subscription</Text>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionInfoText}>
                {getSubscriptionLabel()} Plan
              </Text>
              <Text style={styles.subscriptionInfoSubtext}>
                Upgrade to unlock premium features
              </Text>
            </View>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/(app)/subscription')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Linking.openURL(`${process.env.EXPO_PUBLIC_API_URL}/privacy`)}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color="#ffffff" />
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#888888" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Linking.openURL(`${process.env.EXPO_PUBLIC_API_URL}/terms`)}
        >
          <Ionicons name="document-text-outline" size={24} color="#ffffff" />
          <Text style={styles.settingLabel}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color="#888888" />
        </TouchableOpacity>
        <View style={styles.settingItem}>
          <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>About Uprent Plus</Text>
            <Text style={styles.settingDescription}>
              Version {Constants.expoConfig?.version || '1.0.0'}
            </Text>
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
          <Text style={styles.dangerButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dangerButton, styles.deleteButton]} onPress={handleDeleteAccount}>
          <Text style={[styles.dangerButtonText, styles.deleteButtonText]}>Delete Account</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 12,
  },
  subscriptionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subscriptionBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    gap: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  subscriptionInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  subscriptionInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  subscriptionInfoSubtext: {
    fontSize: 14,
    color: '#888888',
  },
  upgradeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  dangerButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  deleteButton: {
    borderColor: '#ff4444',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  deleteButtonText: {
    color: '#ff4444',
  },
});