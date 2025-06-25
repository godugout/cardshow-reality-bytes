
import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobilePerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  memoryUsage: number;
  batteryLevel?: number;
  networkSpeed: string;
}

interface MobileOptimizationConfig {
  enableHaptics: boolean;
  enableServiceWorker: boolean;
  enableImageOptimization: boolean;
  enableLazyLoading: boolean;
  maxImageQuality: 'low' | 'medium' | 'high';
  preloadCriticalResources: boolean;
}

export const useMobileOptimization = () => {
  const isMobile = useIsMobile();
  const [metrics, setMetrics] = useState<MobilePerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    memoryUsage: 0,
    networkSpeed: 'unknown'
  });
  
  const [config, setConfig] = useState<MobileOptimizationConfig>({
    enableHaptics: isMobile,
    enableServiceWorker: true,
    enableImageOptimization: true,
    enableLazyLoading: true,
    maxImageQuality: isMobile ? 'medium' : 'high',
    preloadCriticalResources: true
  });

  // Measure Web Vitals
  const measureWebVitals = useCallback(() => {
    if (!('performance' in window)) return;

    // First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
    if (fcpEntry) {
      setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
    }

    // Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      observer.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Monitor memory usage
  const monitorMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryMB = memory.usedJSHeapSize / (1024 * 1024);
      setMetrics(prev => ({ ...prev, memoryUsage: memoryMB }));
    }
  }, []);

  // Detect network speed
  const detectNetworkSpeed = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection.effectiveType || 'unknown';
      setMetrics(prev => ({ ...prev, networkSpeed: effectiveType }));
    }
  }, []);

  // Monitor battery level
  const monitorBatteryLevel = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        setMetrics(prev => ({ ...prev, batteryLevel: battery.level }));
        
        battery.addEventListener('levelchange', () => {
          setMetrics(prev => ({ ...prev, batteryLevel: battery.level }));
        });
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    }
  }, []);

  // Haptic feedback
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!config.enableHaptics || !isMobile) return;

    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [50],
        heavy: [100]
      };
      navigator.vibrate(patterns[type]);
    }
  }, [config.enableHaptics, isMobile]);

  // Optimize images based on device capabilities
  const getOptimizedImageUrl = useCallback((originalUrl: string, width?: number, height?: number) => {
    if (!config.enableImageOptimization) return originalUrl;

    // Add image optimization parameters
    const url = new URL(originalUrl, window.location.origin);
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    
    // Set quality based on network and device
    const quality = {
      low: 60,
      medium: 80,
      high: 95
    }[config.maxImageQuality];
    
    url.searchParams.set('q', quality.toString());
    
    // Use WebP if supported
    if ('webp' in document.createElement('canvas').getContext('2d')!) {
      url.searchParams.set('f', 'webp');
    }
    
    return url.toString();
  }, [config.enableImageOptimization, config.maxImageQuality]);

  // Preload critical resources
  const preloadCriticalResources = useCallback((resources: string[]) => {
    if (!config.preloadCriticalResources) return;

    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.includes('.css')) {
        link.as = 'style';
      } else if (resource.includes('.js')) {
        link.as = 'script';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    });
  }, [config.preloadCriticalResources]);

  // Service Worker registration
  const registerServiceWorker = useCallback(async () => {
    if (!config.enableServiceWorker || !('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              console.log('New content available, refresh to update');
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }, [config.enableServiceWorker]);

  // Adaptive quality adjustment
  const adjustQualityBasedOnPerformance = useCallback(() => {
    const { memoryUsage, batteryLevel, networkSpeed } = metrics;
    
    // Reduce quality if memory usage is high
    if (memoryUsage > 150) {
      setConfig(prev => ({
        ...prev,
        maxImageQuality: 'low',
        enableImageOptimization: true
      }));
    }
    
    // Reduce quality on slow networks
    if (networkSpeed === 'slow-2g' || networkSpeed === '2g') {
      setConfig(prev => ({
        ...prev,
        maxImageQuality: 'low',
        enableLazyLoading: true
      }));
    }
    
    // Disable haptics if battery is low
    if (batteryLevel && batteryLevel < 0.2) {
      setConfig(prev => ({
        ...prev,
        enableHaptics: false
      }));
    }
  }, [metrics]);

  // Initialize monitoring
  useEffect(() => {
    const cleanup = measureWebVitals();
    detectNetworkSpeed();
    monitorBatteryLevel();
    registerServiceWorker();
    
    // Set up periodic monitoring
    const interval = setInterval(() => {
      monitorMemoryUsage();
      adjustQualityBasedOnPerformance();
    }, 5000);

    return () => {
      cleanup?.();
      clearInterval(interval);
    };
  }, [measureWebVitals, detectNetworkSpeed, monitorBatteryLevel, registerServiceWorker, monitorMemoryUsage, adjustQualityBasedOnPerformance]);

  return {
    metrics,
    config,
    setConfig,
    triggerHapticFeedback,
    getOptimizedImageUrl,
    preloadCriticalResources,
    isMobile
  };
};
