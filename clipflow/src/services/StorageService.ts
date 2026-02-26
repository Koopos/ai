import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/config';

export class StorageService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`StorageService.get error for key "${key}":`, error);
      return null;
    }
  }

  static async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`StorageService.set error for key "${key}":`, error);
      throw error;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`StorageService.remove error for key "${key}":`, error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('StorageService.clear error:', error);
      throw error;
    }
  }

  static async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('StorageService.getAllKeys error:', error);
      return [];
    }
  }
}

// Convenience functions for common storage operations
export const storage = {
  getClipboardHistory: async () => {
    return StorageService.get<any[]>(
      Config.STORAGE_KEYS.CLIPBOARD_HISTORY
    );
  },

  setClipboardHistory: async (history: any[]) => {
    return StorageService.set(
      Config.STORAGE_KEYS.CLIPBOARD_HISTORY,
      history
    );
  },

  getPinnedItems: async () => {
    return StorageService.get<string[]>(
      Config.STORAGE_KEYS.PINNED_ITEMS
    );
  },

  setPinnedItems: async (pinned: string[]) => {
    return StorageService.set(
      Config.STORAGE_KEYS.PINNED_ITEMS,
      pinned
    );
  },

  getCollections: async () => {
    return StorageService.get<any[]>(
      Config.STORAGE_KEYS.COLLECTIONS
    );
  },

  setCollections: async (collections: any[]) => {
    return StorageService.set(
      Config.STORAGE_KEYS.COLLECTIONS,
      collections
    );
  },

  getThemeMode: async () => {
    return StorageService.get<string>(
      Config.STORAGE_KEYS.THEME_MODE
    );
  },

  setThemeMode: async (mode: string) => {
    return StorageService.set(
      Config.STORAGE_KEYS.THEME_MODE,
      mode
    );
  },

  getSettings: async () => {
    return StorageService.get<any>(
      Config.STORAGE_KEYS.SETTINGS
    );
  },

  setSettings: async (settings: any) => {
    return StorageService.set(
      Config.STORAGE_KEYS.SETTINGS,
      settings
    );
  },
};
