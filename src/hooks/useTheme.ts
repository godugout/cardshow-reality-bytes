
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
  const [mode, setModeState] = useState<Mode>('dark');
  const [systemTheme, setSystemTheme] = useState<Mode>('dark');

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

    console.log('Loading saved preferences:', { savedTheme, savedMode });

    if (savedTheme && ['classic', 'royal', 'vibrant', 'fresh'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }

    if (savedMode && ['light', 'dark'].includes(savedMode)) {
      setModeState(savedMode);
    } else {
      setModeState('dark'); // Default to dark mode
    }
  }, []);

  // Apply theme and mode to document immediately
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    console.log('Applying theme and mode:', { theme, mode });
    
    // Set data attributes for CSS targeting
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-mode', mode);
    
    // Handle dark mode class for compatibility
    if (mode === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }

    // Force immediate style recalculation
    root.style.colorScheme = mode;
    
    // Save to localStorage
    localStorage.setItem('cardshow-theme', theme);
    localStorage.setItem('cardshow-mode', mode);
    
    console.log('Theme applied. Current CSS variables:', {
      background: getComputedStyle(root).getPropertyValue('--background'),
      foreground: getComputedStyle(root).getPropertyValue('--foreground'),
      primary: getComputedStyle(root).getPropertyValue('--primary')
    });
  }, [theme, mode]);

  const setTheme = (newTheme: Theme) => {
    console.log('Theme selector: changing theme to:', newTheme);
    setThemeState(newTheme);
  };

  const setMode = (newMode: Mode) => {
    console.log('Theme selector: changing mode to:', newMode);
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
