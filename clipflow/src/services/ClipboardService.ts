import * as Clipboard from 'expo-clipboard';
import { ClipboardItem } from '../types';
import { Config } from '../constants/config';
import { storage } from './StorageService';
import { detectContentType, generateId, lruEviction } from '../utils/helpers';

class ClipboardServiceClass {
  private history: ClipboardItem[] = [];
  private lastClipboardContent: string = '';
  private pollingIntervalId: NodeJS.Timeout | null = null;
  private listeners: Set<(history: ClipboardItem[]) => void> = new Set();

  async initialize(): Promise<void> {
    // Load history from storage
    const savedHistory = await storage.getClipboardHistory();
    if (savedHistory) {
      this.history = savedHistory;
    }

    // Get initial clipboard content
    this.lastClipboardContent = (await Clipboard.getStringAsync()) || '';

    // Start polling
    this.startPolling();
  }

  async startPolling(): Promise<void> {
    if (this.pollingIntervalId) {
      return; // Already polling
    }

    this.pollingIntervalId = setInterval(async () => {
      await this.checkClipboard();
    }, Config.CLIPBOARD_POLL_INTERVAL);
  }

  stopPolling(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
  }

  private async checkClipboard(): Promise<void> {
    try {
      const currentContent = await Clipboard.getStringAsync();

      if (currentContent && currentContent !== this.lastClipboardContent) {
        this.lastClipboardContent = currentContent;
        await this.addToHistory(currentContent);
      }
    } catch (error) {
      console.error('Error checking clipboard:', error);
    }
  }

  async addToHistory(content: string): Promise<void> {
    const type = detectContentType(content) as ClipboardItem['type'];
    const item: ClipboardItem = {
      id: generateId(),
      content,
      type,
      timestamp: Date.now(),
      pinned: false,
    };

    // Add preview for long text
    if (type === 'text' && content.length > 100) {
      item.preview = content.substring(0, 100) + '...';
    }

    // Add to beginning of history
    this.history.unshift(item);

    // Remove duplicates
    this.history = this.history.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.content === item.content)
    );

    // Enforce max size with LRU eviction
    this.history = lruEviction(
      this.history,
      Config.MAX_HISTORY_SIZE,
      (item) => item.id
    );

    await this.saveHistory();
    this.notifyListeners();
  }

  async saveHistory(): Promise<void> {
    await storage.setClipboardHistory(this.history);
  }

  getHistory(): ClipboardItem[] {
    return [...this.history];
  }

  getFilteredHistory(filter: 'all' | 'text' | 'image' | 'url' | 'pinned'): ClipboardItem[] {
    if (filter === 'all') {
      return this.getHistory();
    }
    if (filter === 'pinned') {
      return this.getHistory().filter((item) => item.pinned);
    }
    return this.getHistory().filter((item) => item.type === filter);
  }

  searchHistory(query: string): ClipboardItem[] {
    const lowerQuery = query.toLowerCase();
    return this.history.filter(
      (item) =>
        item.content.toLowerCase().includes(lowerQuery) ||
        item.preview?.toLowerCase().includes(lowerQuery)
    );
  }

  async getItemById(id: string): Promise<ClipboardItem | null> {
    return this.history.find((item) => item.id === id) || null;
  }

  async pinItem(id: string): Promise<void> {
    const item = this.history.find((item) => item.id === id);
    if (item) {
      item.pinned = !item.pinned;
      await this.saveHistory();
      this.notifyListeners();
    }
  }

  async deleteItem(id: string): Promise<void> {
    this.history = this.history.filter((item) => item.id !== id);
    await this.saveHistory();
    this.notifyListeners();
  }

  async updateItem(id: string, content: string): Promise<void> {
    const item = this.history.find((item) => item.id === id);
    if (item) {
      item.content = content;
      item.type = detectContentType(content) as ClipboardItem['type'];
      item.timestamp = Date.now();
      await this.saveHistory();
      this.notifyListeners();
    }
  }

  async copyToClipboard(content: string): Promise<void> {
    await Clipboard.setStringAsync(content);
    this.lastClipboardContent = content;
  }

  subscribe(listener: (history: ClipboardItem[]) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current history
    listener(this.getHistory());

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.getHistory());
    });
  }

  async clearHistory(): Promise<void> {
    // Keep pinned items
    this.history = this.history.filter((item) => item.pinned);
    await this.saveHistory();
    this.notifyListeners();
  }

  async clearAll(): Promise<void> {
    this.history = [];
    await this.saveHistory();
    this.notifyListeners();
  }

  async getClipboardImage(): Promise<string | null> {
    try {
      // For images, we'd need to handle base64 data URLs
      const content = await Clipboard.getStringAsync();
      if (content && content.startsWith('data:image/')) {
        return content;
      }
      return null;
    } catch (error) {
      console.error('Error getting clipboard image:', error);
      return null;
    }
  }

  dispose(): void {
    this.stopPolling();
    this.listeners.clear();
  }
}

// Export singleton instance
export const ClipboardService = new ClipboardServiceClass();
