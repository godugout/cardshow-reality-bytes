
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
      setModeState(systemTheme);
    }
  }, [systemTheme]);

  // Apply theme and mode to document immediately
  useEffect(() => {
    const root = document.documentElement;
    
    // Set data-theme attribute
    root.setAttribute('data-theme', theme);
    
    // Handle dark mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('cardshow-theme', theme);
    localStorage.setItem('cardshow-mode', mode);
    
    // Force a repaint to ensure changes are applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = '';
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
