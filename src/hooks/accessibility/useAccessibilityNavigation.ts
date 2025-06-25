
import { useRef, useCallback } from 'react';

export const useAccessibilityNavigation = (
  setA11yState: (updater: (prev: any) => any) => void,
  announce: (message: string, priority?: 'polite' | 'assertive') => void,
  screenReaderActive: boolean,
  keyboardNavigation: boolean
) => {
  const focusTracker = useRef<Element | null>(null);

  // Keyboard navigation detection
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      setA11yState((prev: any) => ({ ...prev, keyboardNavigation: true }));
      
      // Track focus for better navigation
      setTimeout(() => {
        focusTracker.current = document.activeElement;
      }, 0);
    }
    
    // Handle escape key for modals/dialogs
    if (event.key === 'Escape') {
      const activeModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
      if (activeModal) {
        const closeButton = activeModal.querySelector('[aria-label*="close"], [data-dismiss]') as HTMLElement;
        closeButton?.click();
      }
    }
  }, [setA11yState]);

  // Focus management
  const manageFocus = useCallback((element: HTMLElement | null, options?: { preventScroll?: boolean }) => {
    if (!element) return;
    
    element.focus({ preventScroll: options?.preventScroll });
    
    // Announce focus change for screen readers
    const label = element.getAttribute('aria-label') || 
                  element.getAttribute('title') || 
                  element.textContent?.slice(0, 50);
    
    if (label && screenReaderActive) {
      announce(`Focused on ${label}`, 'polite');
    }
  }, [announce, screenReaderActive]);

  // Skip links for keyboard navigation
  const createSkipLinks = useCallback(() => {
    if (document.getElementById('skip-links')) return;
    
    const skipLinks = document.createElement('div');
    skipLinks.id = 'skip-links';
    skipLinks.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:p-2';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }, []);

  return {
    handleKeyboardNavigation,
    manageFocus,
    createSkipLinks
  };
};
