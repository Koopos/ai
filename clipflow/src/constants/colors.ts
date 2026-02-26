export const Colors = {
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2D2D2D',
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    secondary: '#CCC2DC',
    tertiary: '#EFB8C8',
    text: '#E6E1E5',
    textSecondary: '#CAC4D0',
    textMuted: '#938F99',
    outline: '#938F99',
    outlineVariant: '#49454F',
    error: '#FFB4AB',
    onError: '#690005',
    success: '#B7DFB4',
    onSuccess: '#0D3F18',
  },
  light: {
    background: '#FFFBFE',
    surface: '#FFFBFE',
    surfaceVariant: '#E7E0EC',
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    secondary: '#625B71',
    tertiary: '#7D5260',
    text: '#1C1B1F',
    textSecondary: '#49454F',
    textMuted: '#79747E',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    success: '#147D33',
    onSuccess: '#FFFFFF',
  },
};

export type ThemeMode = 'light' | 'dark';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400' as const,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400' as const,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
};
