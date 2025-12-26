import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys for app state persistence
 */
const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  LAST_VIEWED_PROPERTIES: 'last_viewed_properties',
  DRAFT_LETTER: 'draft_letter',
  APP_SETTINGS: 'app_settings',
  RECENT_SEARCHES: 'recent_searches',
  FILTER_PREFERENCES: 'filter_preferences',
} as const;

/**
 * User preferences interface
 */
export interface UserPreferences {
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  notificationsEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

/**
 * App settings interface
 */
export interface AppSettings {
  onboardingCompleted?: boolean;
  lastAppVersion?: string;
  analyticsEnabled?: boolean;
  crashReportingEnabled?: boolean;
}

/**
 * Draft letter data interface
 */
export interface DraftLetterData {
  propertyId?: string;
  language: string;
  tone: 'professional' | 'friendly' | 'enthusiastic';
  length: 'short' | 'medium' | 'long';
  keyPoints: string;
  fullName: string;
  occupation: string;
  income: string;
  timestamp: string;
}

/**
 * Storage utility functions
 */
export const storage = {
  /**
   * Save user preferences
   */
  async saveUserPreferences(prefs: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  },

  /**
   * Load user preferences
   */
  async loadUserPreferences(): Promise<UserPreferences> {
    try {
      const prefs = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return {};
    }
  },

  /**
   * Save last viewed properties (for quick access)
   */
  async saveLastViewedProperties(propertyIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_VIEWED_PROPERTIES,
        JSON.stringify(propertyIds.slice(0, 10)) // Keep last 10
      );
    } catch (error) {
      console.error('Error saving last viewed properties:', error);
    }
  },

  /**
   * Load last viewed properties
   */
  async loadLastViewedProperties(): Promise<string[]> {
    try {
      const properties = await AsyncStorage.getItem(STORAGE_KEYS.LAST_VIEWED_PROPERTIES);
      return properties ? JSON.parse(properties) : [];
    } catch (error) {
      console.error('Error loading last viewed properties:', error);
      return [];
    }
  },

  /**
   * Add property to recently viewed
   */
  async addToRecentlyViewed(propertyId: string): Promise<void> {
    try {
      const recent = await this.loadLastViewedProperties();
      const updated = [propertyId, ...recent.filter((id) => id !== propertyId)].slice(0, 10);
      await this.saveLastViewedProperties(updated);
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  },

  /**
   * Save draft letter data
   */
  async saveDraftLetter(draft: DraftLetterData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DRAFT_LETTER, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft letter:', error);
    }
  },

  /**
   * Load draft letter data
   */
  async loadDraftLetter(): Promise<DraftLetterData | null> {
    try {
      const draft = await AsyncStorage.getItem(STORAGE_KEYS.DRAFT_LETTER);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Error loading draft letter:', error);
      return null;
    }
  },

  /**
   * Clear draft letter data
   */
  async clearDraftLetter(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DRAFT_LETTER);
    } catch (error) {
      console.error('Error clearing draft letter:', error);
    }
  },

  /**
   * Save app settings
   */
  async saveAppSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  },

  /**
   * Load app settings
   */
  async loadAppSettings(): Promise<AppSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error loading app settings:', error);
      return {};
    }
  },

  /**
   * Save recent searches
   */
  async saveRecentSearches(searches: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify(searches.slice(0, 10)) // Keep last 10
      );
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  },

  /**
   * Load recent searches
   */
  async loadRecentSearches(): Promise<string[]> {
    try {
      const searches = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return searches ? JSON.parse(searches) : [];
    } catch (error) {
      console.error('Error loading recent searches:', error);
      return [];
    }
  },

  /**
   * Save filter preferences
   */
  async saveFilterPreferences(filters: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FILTER_PREFERENCES, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filter preferences:', error);
    }
  },

  /**
   * Load filter preferences
   */
  async loadFilterPreferences(): Promise<any> {
    try {
      const filters = await AsyncStorage.getItem(STORAGE_KEYS.FILTER_PREFERENCES);
      return filters ? JSON.parse(filters) : null;
    } catch (error) {
      console.error('Error loading filter preferences:', error);
      return null;
    }
  },

  /**
   * Clear all app data (for logout or reset)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_PREFERENCES,
        STORAGE_KEYS.LAST_VIEWED_PROPERTIES,
        STORAGE_KEYS.DRAFT_LETTER,
        STORAGE_KEYS.RECENT_SEARCHES,
        STORAGE_KEYS.FILTER_PREFERENCES,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};

