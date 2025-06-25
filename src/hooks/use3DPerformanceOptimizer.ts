import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdvanced3DPreferences } from '@/hooks/useAdvanced3DPreferences';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  textureMemory: number;
  drawCalls: number;
  triangles: number;
}

interface DeviceCapabilities {
  isHighEnd: boolean;
  isMobile: boolean;
  webglVersion: number;
  maxTextureSize: number;
  maxTextureUnits: number;
  hasFloatTextures: boolean;
  hasMSAA: boolean;
  memoryGB: number;
}

interface QualitySettings {
  textureQuality: 'low' | 'medium' | 'high' | 'ultra';
  geometryLOD: number;
  shadowQuality: 'none' | 'low' | 'medium' | 'high';
  particleCount: number;
  antiAliasing: boolean;
  anisotropicFiltering: number;
}

const PERFORMANCE_TARGETS = {
  targetFPS: 60,
  minFPS: 30,
  maxMemoryMB: 100,
  maxTextureMemoryMB: 50,
  targetFrameTime: 16.67 // 60fps = 16.67ms per frame
};

export const use3DPerformanceOptimizer = () => {
  const { preferences, updatePreferences } = useAdvanced3DPreferences();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    textureMemory: 0,
    drawCalls: 0,
    triangles: 0
  });
  
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [qualitySettings, setQualitySettings] = useState<QualitySettings | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const metricsHistoryRef = useRef<PerformanceMetrics[]>([]);
  const optimizationIntervalRef = useRef<NodeJS.Timeout>();

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback((): DeviceCapabilities => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return {
        isHighEnd: false,
        isMobile: true,
        webglVersion: 0,
        maxTextureSize: 512,
        maxTextureUnits: 8,
        hasFloatTextures: false,
        hasMSAA: false,
        memoryGB: 2
      };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : '';
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const memoryGB = (navigator as any).deviceMemory || (isMobile ? 4 : 8);
    
    // Detect high-end devices
    const isHighEndGPU = /RTX|GTX [1-4][0-9]|RX [5-7][0-9]|Apple M[1-3]|Mali-G[7-9][0-9]|Adreno [6-7][0-9][0-9]/i.test(renderer);
    const isHighEndCPU = navigator.hardwareConcurrency >= 8;
    const isHighEnd = isHighEndGPU && isHighEndCPU && memoryGB >= 8;

    return {
      isHighEnd,
      isMobile,
      webglVersion: gl instanceof WebGL2RenderingContext ? 2 : 1,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxTextureUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
      hasFloatTextures: !!gl.getExtension('OES_texture_float'),
      hasMSAA: gl.getParameter(gl.SAMPLES) > 0,
      memoryGB
    };
  }, []);

  // Calculate optimal quality settings based on device capabilities
  const calculateOptimalSettings = useCallback((capabilities: DeviceCapabilities): QualitySettings => {
    if (capabilities.isHighEnd) {
      return {
        textureQuality: 'ultra',
        geometryLOD: 1.0,
        shadowQuality: 'high',
        particleCount: 200,
        antiAliasing: true,
        anisotropicFiltering: 16
      };
    }
    
    if (!capabilities.isMobile && capabilities.memoryGB >= 6) {
      return {
        textureQuality: 'high',
        geometryLOD: 0.8,
        shadowQuality: 'medium',
        particleCount: 100,
        antiAliasing: true,
        anisotropicFiltering: 8
      };
    }
    
    if (capabilities.isMobile && capabilities.memoryGB >= 4) {
      return {
        textureQuality: 'medium',
        geometryLOD: 0.6,
        shadowQuality: 'low',
        particleCount: 50,
        antiAliasing: false,
        anisotropicFiltering: 4
      };
    }
    
    // Low-end devices
    return {
      textureQuality: 'low',
      geometryLOD: 0.4,
      shadowQuality: 'none',
      particleCount: 20,
      antiAliasing: false,
      anisotropicFiltering: 2
    };
  }, []);

  // Adaptive quality adjustment based on performance
  const adaptiveQualityAdjustment = useCallback((currentMetrics: PerformanceMetrics) => {
    if (!qualitySettings) return;

    const avgFPS = metricsHistoryRef.current.length > 0 
      ? metricsHistoryRef.current.reduce((sum, m) => sum + m.fps, 0) / metricsHistoryRef.current.length
      : currentMetrics.fps;

    const memoryPressure = currentMetrics.memoryUsage > PERFORMANCE_TARGETS.maxMemoryMB;
    const fpsBelow30 = avgFPS < PERFORMANCE_TARGETS.minFPS;
    const fpsBelow45 = avgFPS < 45;

    let needsAdjustment = false;
    const newSettings = { ...qualitySettings };

    // Aggressive downgrade for severe performance issues
    if (fpsBelow30 || memoryPressure) {
      if (newSettings.textureQuality !== 'low') {
        newSettings.textureQuality = 'low';
        newSettings.particleCount = Math.max(10, newSettings.particleCount * 0.5);
        newSettings.shadowQuality = 'none';
        newSettings.antiAliasing = false;
        needsAdjustment = true;
      }
    }
    // Moderate downgrade for minor performance issues
    else if (fpsBelow45) {
      if (newSettings.textureQuality === 'ultra') {
        newSettings.textureQuality = 'high';
        needsAdjustment = true;
      } else if (newSettings.textureQuality === 'high') {
        newSettings.textureQuality = 'medium';
        newSettings.particleCount = Math.max(20, newSettings.particleCount * 0.7);
        needsAdjustment = true;
      }
    }
    // Upgrade quality if performance is good
    else if (avgFPS >= PERFORMANCE_TARGETS.targetFPS && currentMetrics.memoryUsage < PERFORMANCE_TARGETS.maxMemoryMB * 0.7) {
      if (deviceCapabilities?.isHighEnd && newSettings.textureQuality === 'high') {
        newSettings.textureQuality = 'ultra';
        needsAdjustment = true;
      } else if (newSettings.textureQuality === 'medium' && !deviceCapabilities?.isMobile) {
        newSettings.textureQuality = 'high';
        needsAdjustment = true;
      }
    }

    if (needsAdjustment) {
      setQualitySettings(newSettings);
      console.log('Quality adjusted:', newSettings, 'due to avgFPS:', avgFPS, 'memory:', currentMetrics.memoryUsage);
    }
  }, [qualitySettings, deviceCapabilities]);

  // Update performance metrics
  const updateMetrics = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => {
      const updated = { ...prev, ...newMetrics };
      
      // Keep history for trending analysis
      metricsHistoryRef.current.push(updated);
      if (metricsHistoryRef.current.length > 60) { // Keep last 60 samples
        metricsHistoryRef.current.shift();
      }
      
      return updated;
    });
  }, []);

  // Initialize device detection and optimal settings
  useEffect(() => {
    const capabilities = detectDeviceCapabilities();
    setDeviceCapabilities(capabilities);
    
    const optimalSettings = calculateOptimalSettings(capabilities);
    setQualitySettings(optimalSettings);
    
    console.log('Device capabilities detected:', capabilities);
    console.log('Optimal settings calculated:', optimalSettings);
  }, [detectDeviceCapabilities, calculateOptimalSettings]);

  // Start adaptive optimization
  useEffect(() => {
    if (!deviceCapabilities || !qualitySettings) return;

    optimizationIntervalRef.current = setInterval(() => {
      adaptiveQualityAdjustment(metrics);
    }, 2000); // Check every 2 seconds

    return () => {
      if (optimizationIntervalRef.current) {
        clearInterval(optimizationIntervalRef.current);
      }
    };
  }, [deviceCapabilities, qualitySettings, metrics, adaptiveQualityAdjustment]);

  // Force optimization cycle
  const forceOptimization = useCallback(() => {
    if (!deviceCapabilities) return;
    
    setIsOptimizing(true);
    const newSettings = calculateOptimalSettings(deviceCapabilities);
    setQualitySettings(newSettings);
    
    setTimeout(() => setIsOptimizing(false), 1000);
  }, [deviceCapabilities, calculateOptimalSettings]);

  // Get texture resolution based on quality
  const getTextureResolution = useCallback((baseSize: number = 1024): number => {
    if (!qualitySettings) return baseSize;
    
    const multipliers = {
      low: 0.5,
      medium: 0.75,
      high: 1.0,
      ultra: 1.5
    };
    
    return Math.min(
      baseSize * multipliers[qualitySettings.textureQuality],
      deviceCapabilities?.maxTextureSize || 2048
    );
  }, [qualitySettings, deviceCapabilities]);

  // Get geometry level of detail
  const getGeometryLOD = useCallback((distance: number): number => {
    if (!qualitySettings) return 1.0;
    
    const baseLOD = qualitySettings.geometryLOD;
    if (distance < 5) return baseLOD;
    if (distance < 15) return baseLOD * 0.7;
    return baseLOD * 0.4;
  }, [qualitySettings]);

  return {
    metrics,
    deviceCapabilities,
    qualitySettings,
    isOptimizing,
    updateMetrics,
    forceOptimization,
    getTextureResolution,
    getGeometryLOD,
    
    // Performance status
    isPerformanceGood: metrics.fps >= PERFORMANCE_TARGETS.minFPS && metrics.memoryUsage <= PERFORMANCE_TARGETS.maxMemoryMB,
    performanceGrade: metrics.fps >= 55 ? 'A' : metrics.fps >= 45 ? 'B' : metrics.fps >= 30 ? 'C' : 'D'
  };
};
