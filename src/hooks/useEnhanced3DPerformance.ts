
import { useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { use3DPerformanceOptimizer } from './use3DPerformanceOptimizer';
import { WebGLContextManager } from '@/utils/webglContextManager';
import { TextureManager } from '@/utils/textureManager';

interface Enhanced3DPerformanceConfig {
  enableMonitoring: boolean;
  enableAdaptiveQuality: boolean;
  enableMemoryManagement: boolean;
  reportingInterval: number;
}

export const useEnhanced3DPerformance = (config: Enhanced3DPerformanceConfig = {
  enableMonitoring: true,
  enableAdaptiveQuality: true,
  enableMemoryManagement: true,
  reportingInterval: 1000
}) => {
  const {
    metrics,
    deviceCapabilities,
    qualitySettings,
    updateMetrics,
    isPerformanceGood,
    performanceGrade
  } = use3DPerformanceOptimizer();

  const frameTimeRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const contextManagerRef = useRef<WebGLContextManager | null>(null);
  const textureManagerRef = useRef<TextureManager | null>(null);
  const reportingIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize managers
  useEffect(() => {
    if (!textureManagerRef.current) {
      textureManagerRef.current = new TextureManager();
    }

    return () => {
      textureManagerRef.current?.dispose();
      contextManagerRef.current?.dispose();
    };
  }, []);

  // Frame performance monitoring
  useFrame((state) => {
    if (!config.enableMonitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - lastFrameTimeRef.current;
    
    frameTimeRef.current.push(frameTime);
    if (frameTimeRef.current.length > 60) {
      frameTimeRef.current.shift();
    }

    const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
    const fps = 1000 / avgFrameTime;

    updateMetrics({
      fps,
      frameTime: avgFrameTime,
      drawCalls: state.gl.info?.render?.calls || 0,
      triangles: state.gl.info?.render?.triangles || 0
    });

    lastFrameTimeRef.current = currentTime;
  });

  // Memory monitoring
  useEffect(() => {
    if (!config.enableMemoryManagement) return;

    const checkMemory = () => {
      const memoryInfo = (performance as any).memory;
      const textureMetrics = textureManagerRef.current?.getMetrics();
      
      if (memoryInfo) {
        updateMetrics({
          memoryUsage: memoryInfo.usedJSHeapSize / (1024 * 1024),
          textureMemory: textureMetrics?.memoryUsage || 0
        });
      }

      // Cleanup unused textures if memory usage is high
      if (textureMetrics && textureMetrics.memoryUsage > 50) {
        textureManagerRef.current?.clearUnusedTextures();
      }
    };

    reportingIntervalRef.current = setInterval(checkMemory, config.reportingInterval);

    return () => {
      if (reportingIntervalRef.current) {
        clearInterval(reportingIntervalRef.current);
      }
    };
  }, [config.enableMemoryManagement, config.reportingInterval, updateMetrics]);

  // WebGL context recovery
  const setupContextRecovery = useCallback((canvas: HTMLCanvasElement) => {
    if (contextManagerRef.current) {
      contextManagerRef.current.dispose();
    }

    contextManagerRef.current = new WebGLContextManager(
      canvas,
      {
        antialias: qualitySettings?.antiAliasing ?? true,
        powerPreference: 'high-performance'
      },
      () => {
        console.warn('WebGL context lost - switching to fallback mode');
        updateMetrics({ fps: 0 });
      },
      (gl) => {
        console.log('WebGL context restored');
        // Reinitialize textures and resources
        textureManagerRef.current?.clearCache();
      }
    );

    return contextManagerRef.current;
  }, [qualitySettings, updateMetrics]);

  // Get optimized texture configuration
  const getTextureConfig = useCallback(() => {
    if (!qualitySettings || !deviceCapabilities) {
      return {
        quality: 'medium' as const,
        enableCompression: false,
        maxSize: 1024,
        generateMipmaps: true,
        anisotropy: 4
      };
    }

    return {
      quality: qualitySettings.textureQuality,
      enableCompression: deviceCapabilities.isHighEnd,
      maxSize: deviceCapabilities.maxTextureSize > 2048 ? 2048 : deviceCapabilities.maxTextureSize,
      generateMipmaps: qualitySettings.textureQuality !== 'low',
      anisotropy: qualitySettings.anisotropicFiltering
    };
  }, [qualitySettings, deviceCapabilities]);

  // Load optimized texture
  const loadOptimizedTexture = useCallback(async (url: string) => {
    if (!textureManagerRef.current) return null;

    const config = getTextureConfig();
    return textureManagerRef.current.loadTexture(url, config);
  }, [getTextureConfig]);

  // Performance recommendations
  const getPerformanceRecommendations = useCallback(() => {
    const recommendations: string[] = [];

    if (metrics.fps < 30) {
      recommendations.push('Consider reducing texture quality or disabling particle effects');
    }

    if (metrics.memoryUsage > 80) {
      recommendations.push('High memory usage detected - consider clearing texture cache');
    }

    if (!deviceCapabilities?.isHighEnd && qualitySettings?.textureQuality === 'ultra') {
      recommendations.push('Ultra quality may not be optimal for this device');
    }

    if (deviceCapabilities?.isMobile && qualitySettings?.particleCount > 50) {
      recommendations.push('Consider reducing particle count for better mobile performance');
    }

    return recommendations;
  }, [metrics, deviceCapabilities, qualitySettings]);

  return {
    // Performance metrics
    metrics,
    deviceCapabilities,
    qualitySettings,
    isPerformanceGood,
    performanceGrade,
    
    // Utilities
    setupContextRecovery,
    loadOptimizedTexture,
    getTextureConfig,
    getPerformanceRecommendations,
    
    // Managers
    textureManager: textureManagerRef.current,
    contextManager: contextManagerRef.current
  };
};
