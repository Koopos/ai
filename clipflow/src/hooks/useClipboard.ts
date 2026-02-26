import { useState, useEffect } from 'react';
import { ClipboardItem } from '../types';
import { ClipboardService } from '../services/ClipboardService';

export const useClipboard = () => {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initClipboard = async () => {
      setLoading(true);
      await ClipboardService.initialize();
      unsubscribe = ClipboardService.subscribe((newHistory) => {
        setHistory(newHistory);
        setLoading(false);
      });
    };

    initClipboard();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const copyToClipboard = async (content: string) => {
    await ClipboardService.copyToClipboard(content);
  };

  const pinItem = async (id: string) => {
    await ClipboardService.pinItem(id);
  };

  const deleteItem = async (id: string) => {
    await ClipboardService.deleteItem(id);
  };

  const updateItem = async (id: string, content: string) => {
    await ClipboardService.updateItem(id, content);
  };

  const searchHistory = (query: string) => {
    return ClipboardService.searchHistory(query);
  };

  const getFilteredHistory = (filter: 'all' | 'text' | 'image' | 'url' | 'pinned') => {
    return ClipboardService.getFilteredHistory(filter);
  };

  const clearHistory = async () => {
    await ClipboardService.clearHistory();
  };

  return {
    history,
    loading,
    copyToClipboard,
    pinItem,
    deleteItem,
    updateItem,
    searchHistory,
    getFilteredHistory,
    clearHistory,
  };
};
