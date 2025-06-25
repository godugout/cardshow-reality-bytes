
import { useRef, useCallback } from 'react';

export const useAccessibilityAnnouncements = (
  screenReaderActive: boolean,
  setA11yState: (updater: (prev: any) => any) => void
) => {
  const announcementTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Announce to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!screenReaderActive) return;

    // Create announcement element
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Update state
    setA11yState((prev: any) => ({ 
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
  }, [screenReaderActive, setA11yState]);

  // Cleanup function
  const cleanupAnnouncements = useCallback(() => {
    announcementTimeouts.current.forEach(clearTimeout);
  }, []);

  return {
    announce,
    cleanupAnnouncements
  };
};
