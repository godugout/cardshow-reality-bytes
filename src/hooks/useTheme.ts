
import { useState, useEffect } from 'react';

export type Theme = 'classic' | 'royal' | 'vibrant' | 'fresh';
export type Mode = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  systemTheme: Mode;
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>('classic');
  const [mode, setModeState] = useState<Mode>('light');
  const [systemTheme, setSystemTheme] = useState<Mode>('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('cardshow-theme') as Theme;
    const savedMode = localStorage.getItem('cardshow-mode') as Mode;

    if (savedTheme && ['classic', 'royal', 'vibrant', 'fresh'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }

    if (savedMode && ['light', 'dark'].includes(savedMode)) {
      setModeState(savedMode);
    } else {
      // Default to system preference
      setModeState(systemTheme);
    }
  }, [systemTheme]);

  // Apply theme and mode to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-mode', mode);

    // Also update Tailwind's dark mode class for compatibility
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save preferences
    localStorage.setItem('cardshow-theme', theme);
    localStorage.setItem('cardshow-mode', mode);
  }, [theme, mode]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState(current => current === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    mode,
    setTheme,
    setMode,
    toggleMode,
    systemTheme,
  };
};
