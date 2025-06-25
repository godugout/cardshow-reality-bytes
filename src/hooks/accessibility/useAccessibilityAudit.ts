
import { useCallback } from 'react';

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

export const useAccessibilityAudit = () => {
  // Color contrast checker
  const checkColorContrast = useCallback((foreground: string, background: string): { ratio: number; wcagAA: boolean; wcagAAA: boolean } => {
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

  return {
    checkColorContrast,
    runAccessibilityAudit
  };
};
