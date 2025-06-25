
import { useState, useEffect, useCallback } from 'react';

interface AccessibilityState {
  screenReaderActive: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  keyboardNavigation: boolean;
  fontSize: 'normal' | 'large' | 'xl';
  announcements: string[];
}

export const useAccessibilityState = () => {
  const [a11yState, setA11yState] = useState<AccessibilityState>({
    screenReaderActive: false,
    highContrastMode: false,
    reducedMotion: false,
    focusVisible: true,
    keyboardNavigation: false,
    fontSize: 'normal',
    announcements: []
  });

  // Detect screen reader usage
  const detectScreenReader = useCallback(() => {
    const hasScreenReader = 
      'speechSynthesis' in window ||
      (typeof navigator !== 'undefined' && (
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        navigator.userAgent.includes('Orca')
      ));

    setA11yState(prev => ({ ...prev, screenReaderActive: hasScreenReader }));
  }, []);

  // Detect user preferences
  const detectUserPreferences = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setA11yState(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrastMode: prefersHighContrast
    }));
  }, []);

  // Font size adjustment
  const adjustFontSize = useCallback((size: 'normal' | 'large' | 'xl') => {
    setA11yState(prev => ({ ...prev, fontSize: size }));
    
    const multipliers = {
      normal: 1,
      large: 1.2,
      xl: 1.5
    };
    
    document.documentElement.style.fontSize = `${16 * multipliers[size]}px`;
  }, []);

  return {
    a11yState,
    setA11yState,
    detectScreenReader,
    detectUserPreferences,
    adjustFontSize
  };
};
