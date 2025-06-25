
import { useState, useEffect, useCallback, useRef } from 'react';

interface AccessibilityState {
  screenReaderActive: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  keyboardNavigation: boolean;
  fontSize: 'normal' | 'large' | 'xl';
  announcements: string[];
}

interface A11yAuditResult {
  passed: boolean;
  issues: A11yIssue[];
  score: number;
  wcagLevel: 'A' | 'AA' | 'AAA';
}

interface A11yIssue {
  type: 'color-contrast' | 'missing-alt' | 'keyboard-nav' | 'focus-order' | 'aria-labels';
  element: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  suggestion: string;
}

export const useAccessibilityFeatures = () => {
  const [a11yState, setA11yState] = useState<AccessibilityState>({
    screenReaderActive: false,
    highContrastMode: false,
    reducedMotion: false,
    focusVisible: true,
    keyboardNavigation: false,
    fontSize: 'normal',
    announcements: []
  });

  const announcementTimeouts = useRef<NodeJS.Timeout[]>([]);
  const focusTracker = useRef<Element | null>(null);

  // Detect screen reader usage
  const detectScreenReader = useCallback(() => {
    // Check for common screen reader indicators
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
    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // High contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setA11yState(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrastMode: prefersHighContrast
    }));
  }, []);

  // Announce to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!a11yState.screenReaderActive) return;

    // Create announcement element
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Update state
    setA11yState(prev => ({ 
      ...prev, 
      announcements: [...prev.announcements.slice(-4), message] 
    }));
    
    // Clean up after announcement
    const timeout = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
    
    announcementTimeouts.current.push(timeout);
  }, [a11yState.screenReaderActive]);

  // Keyboard navigation detection
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      setA11yState(prev => ({ ...prev, keyboardNavigation: true }));
      
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
  }, []);

  // Focus management
  const manageFocus = useCallback((element: HTMLElement | null, options?: { preventScroll?: boolean }) => {
    if (!element) return;
    
    element.focus({ preventScroll: options?.preventScroll });
    
    // Announce focus change for screen readers
    const label = element.getAttribute('aria-label') || 
                  element.getAttribute('title') || 
                  element.textContent?.slice(0, 50);
    
    if (label && a11yState.screenReaderActive) {
      announce(`Focused on ${label}`, 'polite');
    }
  }, [announce, a11yState.screenReaderActive]);

  // Color contrast checker
  const checkColorContrast = useCallback((foreground: string, background: string): { ratio: number; wcagAA: boolean; wcagAAA: boolean } => {
    // Convert colors to RGB
    const getRGB = (color: string) => {
      const div = document.createElement('div');
      div.style.color = color;
      document.body.appendChild(div);
      const computed = window.getComputedStyle(div).color;
      document.body.removeChild(div);
      
      const match = computed.match(/\d+/g);
      return match ? match.map(Number) : [0, 0, 0];
    };
    
    const getLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const fgRGB = getRGB(foreground);
    const bgRGB = getRGB(background);
    
    const fgLum = getLuminance(fgRGB);
    const bgLum = getLuminance(bgRGB);
    
    const lighter = Math.max(fgLum, bgLum);
    const darker = Math.min(fgLum, bgLum);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    
    return {
      ratio,
      wcagAA: ratio >= 4.5,
      wcagAAA: ratio >= 7
    };
  }, []);

  // Accessibility audit
  const runAccessibilityAudit = useCallback((): A11yAuditResult => {
    const issues: A11yIssue[] = [];
    
    // Check for missing alt attributes
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach((img, index) => {
      issues.push({
        type: 'missing-alt',
        element: `img:nth-child(${index + 1})`,
        severity: 'error',
        description: 'Image missing alt attribute',
        suggestion: 'Add descriptive alt text for screen reader users'
      });
    });
    
    // Check for proper heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        issues.push({
          type: 'focus-order',
          element: `${heading.tagName.toLowerCase()}:nth-child(${index + 1})`,
          severity: 'warning',
          description: 'Heading level skipped',
          suggestion: 'Use proper heading hierarchy (h1, h2, h3, etc.)'
        });
      }
      previousLevel = level;
    });
    
    // Check for interactive elements without proper labels
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, [role="button"]');
    interactiveElements.forEach((element, index) => {
      const hasLabel = element.getAttribute('aria-label') || 
                      element.getAttribute('aria-labelledby') ||
                      element.textContent?.trim() ||
                      (element as HTMLInputElement).labels?.length;
      
      if (!hasLabel) {
        issues.push({
          type: 'aria-labels',
          element: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
          severity: 'error',
          description: 'Interactive element missing accessible label',
          suggestion: 'Add aria-label or ensure element has visible text'
        });
      }
    });
    
    // Check color contrast for text elements
    const textElements = document.querySelectorAll('p, span, div, a, button, h1, h2, h3, h4, h5, h6');
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = checkColorContrast(color, backgroundColor);
        if (!contrast.wcagAA) {
          issues.push({
            type: 'color-contrast',
            element: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
            severity: 'error',
            description: `Color contrast ratio ${contrast.ratio.toFixed(2)} is below WCAG AA standard`,
            suggestion: 'Increase color contrast to at least 4.5:1'
          });
        }
      }
    });
    
    // Calculate score
    const totalElements = document.querySelectorAll('*').length;
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    
    const score = Math.max(0, 100 - (errorCount * 10) - (warningCount * 5));
    
    let wcagLevel: 'A' | 'AA' | 'AAA' = 'A';
    if (score >= 90 && errorCount === 0) wcagLevel = 'AAA';
    else if (score >= 80 && errorCount <= 2) wcagLevel = 'AA';
    
    return {
      passed: errorCount === 0,
      issues,
      score,
      wcagLevel
    };
  }, [checkColorContrast]);

  // Font size adjustment
  const adjustFontSize = useCallback((size: 'normal' | 'large' | 'xl') => {
    setA11yState(prev => ({ ...prev, fontSize: size }));
    
    const multipliers = {
      normal: 1,
      large: 1.2,
      xl: 1.5
    };
    
    document.documentElement.style.fontSize = `${16 * multipliers[size]}px`;
    announce(`Font size changed to ${size}`, 'polite');
  }, [announce]);

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

  // Initialize accessibility features
  useEffect(() => {
    detectScreenReader();
    detectUserPreferences();
    createSkipLinks();
    
    // Listen for keyboard events
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Listen for mouse events to detect non-keyboard users
    const handleMouseDown = () => {
      setA11yState(prev => ({ ...prev, keyboardNavigation: false }));
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
      document.removeEventListener('mousedown', handleMouseDown);
      
      // Clear announcement timeouts
      announcementTimeouts.current.forEach(clearTimeout);
    };
  }, [detectScreenReader, detectUserPreferences, createSkipLinks, handleKeyboardNavigation]);

  return {
    a11yState,
    announce,
    manageFocus,
    checkColorContrast,
    runAccessibilityAudit,
    adjustFontSize
  };
};
