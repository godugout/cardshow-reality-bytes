
import { useEffect, useCallback } from 'react';
import { useAccessibilityState } from './accessibility/useAccessibilityState';
import { useAccessibilityAudit } from './accessibility/useAccessibilityAudit';
import { useAccessibilityAnnouncements } from './accessibility/useAccessibilityAnnouncements';
import { useAccessibilityNavigation } from './accessibility/useAccessibilityNavigation';

export const useAccessibilityFeatures = () => {
  const {
    a11yState,
    setA11yState,
    detectScreenReader,
    detectUserPreferences,
    adjustFontSize
  } = useAccessibilityState();

  const { checkColorContrast, runAccessibilityAudit } = useAccessibilityAudit();

  const { announce, cleanupAnnouncements } = useAccessibilityAnnouncements(
    a11yState.screenReaderActive,
    setA11yState
  );

  const { handleKeyboardNavigation, manageFocus, createSkipLinks } = useAccessibilityNavigation(
    setA11yState,
    announce,
    a11yState.screenReaderActive,
    a11yState.keyboardNavigation
  );

  // Initialize accessibility features
  useEffect(() => {
    detectScreenReader();
    detectUserPreferences();
    createSkipLinks();
    
    // Listen for keyboard events
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Listen for mouse events to detect non-keyboard users
    const handleMouseDown = () => {
      setA11yState((prev: any) => ({ ...prev, keyboardNavigation: false }));
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
      document.removeEventListener('mousedown', handleMouseDown);
      cleanupAnnouncements();
    };
  }, [detectScreenReader, detectUserPreferences, createSkipLinks, handleKeyboardNavigation, cleanupAnnouncements, setA11yState]);

  return {
    a11yState,
    announce,
    manageFocus,
    checkColorContrast,
    runAccessibilityAudit,
    adjustFontSize
  };
};
