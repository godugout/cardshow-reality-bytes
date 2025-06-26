
import { useState, useEffect, useCallback } from 'react';
import { useMobile } from '@/hooks/use-mobile';

interface Mobile3DSettings {
  maxCards: number;
  textureQuality: 'low' | 'medium';
  enableShadows: boolean;
  enableParticles: boolean;
  lodDistance: number;
  frameRate: number;
  enableAutoQuality: boolean;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
}

const DEFAULT_MOBILE_SETTINGS: Mobile3DSettings = {
  maxCards: 30,
  textureQuality: 'low',
  enableShadows: false,
  enableParticles: false,
  lodDistance: 15,
  frameRate: 30,
  enableAutoQuality: true
};

const DEFAULT_DESKTOP_SETTINGS: Mobile3DSettings = {
  maxCards: 100,
  textureQuality: 'medium',
  enableShadows: true,
  enableParticles: true,
  lodDistance: 25,
  frameRate: 60,
  enableAutoQuality: true
};

export const useMobile3DOptimization = () => {
  const isMobile = useMobile();
  const [settings, setSettings] = useState<Mobile3DSettings>(
    isMobile ? DEFAULT_MOBILE_SETTINGS : DEFAULT_DESKTOP_SETTINGS
  );
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 16
  });
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Detect battery status for additional optimizations
  useEffect(() => {
    const checkBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setIsLowPowerMode(battery.charging === false && battery.level < 0.2);
          
          battery.addEventListener('levelchange', () => {
            setIsLowPowerMode(battery.charging === false && battery.level < 0.2);
          });
        } catch (error) {
          console.warn('Battery API not available');
        }
      }
    };

    checkBatteryStatus();
  }, []);

  // Auto-adjust quality based on performance
  useEffect(() => {
    if (!settings.enableAutoQuality) return;

    const adjustQuality = () => {
      if (metrics.fps < 20 || isLowPowerMode) {
        // Aggressive optimization
        setSettings(prev => ({
          ...prev,
          maxCards: Math.min(prev.maxCards, 15),
          textureQuality: 'low',
          enableShadows: false,
          enableParticles: false,
          frameRate: 20
        }));
      } else if (metrics.fps < 45) {
        // Moderate optimization
        setSettings(prev => ({
          ...prev,
          maxCards: Math.min(prev.maxCards, isMobile ? 25 : 50),
          textureQuality: 'low',
          enableShadows: false,
          frameRate: 30
        }));
      } else if (metrics.fps > 55 && !isLowPowerMode) {
        // Can increase quality
        setSettings(prev => ({
          ...prev,
          maxCards: Math.min(prev.maxCards + 5, isMobile ? 40 : 100),
          textureQuality: isMobile ? 'low' : 'medium',
          enableShadows: !isMobile,
          enableParticles: !isMobile
        }));
      }
    };

    const interval = setInterval(adjustQuality, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [metrics.fps, isLowPowerMode, settings.enableAutoQuality, isMobile]);

  const updateMetrics = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
  }, []);

  const forceOptimization = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      maxCards: Math.floor(prev.maxCards * 0.7),
      textureQuality: 'low',
      enableShadows: false,
      enableParticles: false,
      frameRate: 20
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setSettings(isMobile ? DEFAULT_MOBILE_SETTINGS : DEFAULT_DESKTOP_SETTINGS);
  }, [isMobile]);

  const getOptimalSettings = useCallback(() => {
    // Device-specific optimizations
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    let optimizedSettings = { ...settings };

    // Memory-based adjustments
    if (deviceMemory < 4) {
      optimizedSettings.maxCards = Math.min(optimizedSettings.maxCards, 20);
      optimizedSettings.textureQuality = 'low';
    }

    // CPU-based adjustments
    if (hardwareConcurrency < 4) {
      optimizedSettings.frameRate = Math.min(optimizedSettings.frameRate, 30);
      optimizedSettings.enableParticles = false;
    }

    // Low power mode adjustments
    if (isLowPowerMode) {
      optimizedSettings.maxCards = Math.min(optimizedSettings.maxCards, 10);
      optimizedSettings.textureQuality = 'low';
      optimizedSettings.enableShadows = false;
      optimizedSettings.enableParticles = false;
      optimizedSettings.frameRate = 20;
    }

    return optimizedSettings;
  }, [settings, isLowPowerMode]);

  return {
    settings: getOptimalSettings(),
    metrics,
    isLowPowerMode,
    isMobile,
    updateMetrics,
    forceOptimization,
    resetToDefault,
    canRenderCard: (index: number) => index < settings.maxCards
  };
};
