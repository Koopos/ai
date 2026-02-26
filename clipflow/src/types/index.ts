import { ThemeMode } from '../constants/colors';

export interface ClipboardItem {
  id: string;
  content: string;
  type: 'text' | 'image' | 'url' | 'unknown';
  timestamp: number;
  pinned?: boolean;
  collectionId?: string;
  sourceApp?: string;
  preview?: string;
}

export interface Collection {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  items: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  themeMode: ThemeMode;
  maxHistorySize: number;
  autoPinUrls: boolean;
  hapticFeedback: boolean;
}

export interface FilterType {
  label: string;
  value: 'all' | 'text' | 'image' | 'url' | 'pinned';
}

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Collections: undefined;
  Settings: undefined;
  Detail: { item: ClipboardItem };
};

export type TabParamList = {
  HomeTab: undefined;
  CollectionsTab: undefined;
  SettingsTab: undefined;
};
