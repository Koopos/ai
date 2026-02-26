import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ThemeMode } from '../constants/colors';
import { storage } from '../services/StorageService';

interface ThemeContextType {
  themeMode: ThemeMode;
  colors: typeof Colors.dark;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    (systemColorScheme as ThemeMode) || 'dark'
  );

  useEffect(() => {
    // Load saved theme mode
    storage.getThemeMode().then((savedMode) => {
      if (savedMode) {
        setThemeModeState(savedMode as ThemeMode);
      }
    });
  }, []);

  const colors = themeMode === 'dark' ? Colors.dark : Colors.light;

  const toggleTheme = () => {
    const newMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await storage.setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, colors, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
