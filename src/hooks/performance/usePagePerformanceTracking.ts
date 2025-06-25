
import { useEffect, useRef } from 'react';
import { useMetricLogger } from './useMetricLogger';

export const usePagePerformanceTracking = (sessionId?: string) => {
  const { logMetric } = useMetricLogger(sessionId);
  const performanceObserverRef = useRef<PerformanceObserver>();

  useEffect(() => {
    if (!sessionId) return;

    // Track page load performance
    const trackPageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        logMetric({
          metricType: 'user_engagement',
          metricName: 'page_load_time',
          metricValue: loadTime,
          metadata: {
            url: window.location.href,
            navigationTiming: {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
              firstPaint: navigation.responseEnd - navigation.fetchStart
            }
          }
        });
      }
    };

    // Track resource performance
    const trackResources = () => {
      const resources = performance.getEntriesByType('resource');
      resources.forEach((resource) => {
        if (resource.duration > 1000) { // Only log slow resources
          logMetric({
            metricType: 'user_engagement',
            metricName: 'resource_load_time',
            metricValue: resource.duration,
            metadata: {
              resourceName: resource.name,
              resourceType: (resource as PerformanceResourceTiming).initiatorType
            }
          });
        }
      });
    };

    // Set up performance observer
    if ('PerformanceObserver' in window) {
      performanceObserverRef.current = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.includes('3d-render')) {
            logMetric({
              metricType: '3d_rendering',
              metricName: 'render_time',
              metricValue: entry.duration,
              sessionId
            });
          }
        });
      });

      performanceObserverRef.current.observe({ entryTypes: ['measure', 'navigation'] });
    }

    // Track initial page load
    if (document.readyState === 'complete') {
      trackPageLoad();
      trackResources();
    } else {
      window.addEventListener('load', () => {
        trackPageLoad();
        trackResources();
      });
    }

    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
    };
  }, [sessionId, logMetric]);
};
