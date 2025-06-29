
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

    console.log('🎨 Loading saved preferences:', { savedTheme, savedMode });

    if (savedTheme && ['classic', 'royal', 'vibrant', 'fresh'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }

    if (savedMode && ['light', 'dark'].includes(savedMode)) {
      setModeState(savedMode);
    } else {
      setModeState('dark'); // Default to dark mode
    }
  }, []);

  // Apply theme and mode to document immediately with force update
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    console.log('🎨 Applying theme and mode:', { theme, mode });
    
    // Remove all existing theme and mode attributes first
    root.removeAttribute('data-theme');
    root.removeAttribute('data-mode');
    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');
    
    // Set new theme and mode
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-mode', mode);
    root.classList.add(mode);
    body.classList.add(mode);
    
    // Force immediate style recalculation
    root.style.colorScheme = mode;
    
    // Force repaint
    void root.offsetHeight;
    
    // Save to localStorage
    localStorage.setItem('cardshow-theme', theme);
    localStorage.setItem('cardshow-mode', mode);
    
    // Debug current CSS variables
    setTimeout(() => {
      const computedStyle = getComputedStyle(root);
      console.log('🎨 Current CSS variables after theme change:', {
        theme,
        mode,
        background: computedStyle.getPropertyValue('--background'),
        foreground: computedStyle.getPropertyValue('--foreground'),
        primary: computedStyle.getPropertyValue('--primary'),
        dataTheme: root.getAttribute('data-theme'),
        dataMode: root.getAttribute('data-mode')
      });
    }, 100);
  }, [theme, mode]);

  const setTheme = (newTheme: Theme) => {
    console.log('🎨 Theme selector: changing theme to:', newTheme);
    setThemeState(newTheme);
  };

  const setMode = (newMode: Mode) => {
    console.log('🎨 Theme selector: changing mode to:', newMode);
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
