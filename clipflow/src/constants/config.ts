export const Config = {
  // Clipboard polling interval (milliseconds)
  CLIPBOARD_POLL_INTERVAL: 1000,

  // Maximum clipboard history items
  MAX_HISTORY_SIZE: 500,

  // Maximum image size in bytes (1MB)
  MAX_IMAGE_SIZE: 1024 * 1024,

  // Storage keys
  STORAGE_KEYS: {
    CLIPBOARD_HISTORY: '@clipflow:history',
    PINNED_ITEMS: '@clipflow:pinned',
    COLLECTIONS: '@clipflow:collections',
    THEME_MODE: '@clipflow:theme',
    SETTINGS: '@clipflow:settings',
  },

  // Content types
  CONTENT_TYPE: {
    TEXT: 'text',
    IMAGE: 'image',
    URL: 'url',
    UNKNOWN: 'unknown',
  },

  // Search debounce delay
  SEARCH_DEBOUNCE_MS: 300,

  // Animation durations
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 350,
  },

  // Easing functions
  EASING: {
    OUT: 'out',
    IN_OUT: 'inOut',
    CUBIC: 'cubic',
    QUAD: 'quad',
  },
};
