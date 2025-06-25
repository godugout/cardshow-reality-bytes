
import { useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePerformanceMonitoring } from './usePerformanceMonitoring';

interface RenderingStats {
  fps: number[];
  memoryUsage: number[];
  gpuMemory?: number;
  frameTime: number[];
  renderingErrors: number;
}

export const useRenderingPerformance = (cardCount: number = 0, qualityPreset: string = 'medium') => {
  const { logRenderingMetrics, sessionId } = usePerformanceMonitoring();
  const statsRef = useRef<RenderingStats>({
    fps: [],
    memoryUsage: [],
    frameTime: [],
    renderingErrors: 0
  });
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const reportIntervalRef = useRef<NodeJS.Timeout>();

  // Get device information
  const getDeviceInfo = useCallback(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
    
    let deviceInfo: Record<string, any> = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      memory: (navigator as any).deviceMemory || null,
      cores: navigator.hardwareConcurrency || null,
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio
      }
    };

    if (gl && gl instanceof WebGLRenderingContext) {
      const webglContext = gl as WebGLRenderingContext;
      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        deviceInfo.gpu = {
          vendor: webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        };
      }
      deviceInfo.webglVersion = webglContext.getParameter(webglContext.VERSION);
      deviceInfo.maxTextureSize = webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE);
    }

    return deviceInfo;
  }, []);

  // Monitor frame performance
  useFrame(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      statsRef.current.fps.push(fps);
      statsRef.current.frameTime.push(deltaTime);
      
      // Keep only last 60 frames
      if (statsRef.current.fps.length > 60) {
        statsRef.current.fps.shift();
        statsRef.current.frameTime.shift();
      }
    }
    
    lastTimeRef.current = currentTime;
    frameCountRef.current++;
  });

  // Monitor memory usage
  const updateMemoryStats = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryMB = memory.usedJSHeapSize / (1024 * 1024);
      statsRef.current.memoryUsage.push(memoryMB);
      
      // Keep only last 10 readings
      if (statsRef.current.memoryUsage.length > 10) {
        statsRef.current.memoryUsage.shift();
      }
    }
  }, []);

  // Report performance metrics periodically
  const reportMetrics = useCallback(() => {
    if (!sessionId || statsRef.current.fps.length === 0) return;

    const fps = statsRef.current.fps;
    const memory = statsRef.current.memoryUsage;
    
    const metrics = {
      sessionId,
      fpsAverage: fps.reduce((a, b) => a + b, 0) / fps.length,
      fpsMin: Math.min(...fps),
      fpsMax: Math.max(...fps),
      memoryUsedMb: memory.length > 0 ? memory[memory.length - 1] : 0,
      webglVersion: 1, // Default, could be detected
      deviceInfo: getDeviceInfo(),
      cardCount,
      qualityPreset,
      renderingErrors: statsRef.current.renderingErrors
    };

    logRenderingMetrics(metrics);
  }, [sessionId, logRenderingMetrics, cardCount, qualityPreset, getDeviceInfo]);

  // Set up monitoring intervals
  useEffect(() => {
    const memoryInterval = setInterval(updateMemoryStats, 1000);
    reportIntervalRef.current = setInterval(reportMetrics, 10000); // Report every 10 seconds

    return () => {
      clearInterval(memoryInterval);
      if (reportIntervalRef.current) {
        clearInterval(reportIntervalRef.current);
      }
    };
  }, [updateMemoryStats, reportMetrics]);

  // Error tracking
  const incrementRenderingErrors = useCallback(() => {
    statsRef.current.renderingErrors++;
  }, []);

  // Get current performance stats
  const getCurrentStats = useCallback(() => {
    const fps = statsRef.current.fps;
    const memory = statsRef.current.memoryUsage;
    
    return {
      currentFPS: fps.length > 0 ? fps[fps.length - 1] : 0,
      averageFPS: fps.length > 0 ? fps.reduce((a, b) => a + b, 0) / fps.length : 0,
      memoryUsage: memory.length > 0 ? memory[memory.length - 1] : 0,
      frameCount: frameCountRef.current,
      renderingErrors: statsRef.current.renderingErrors
    };
  }, []);

  return {
    incrementRenderingErrors,
    getCurrentStats,
    reportMetrics: () => reportMetrics() // Manual report trigger
  };
};
