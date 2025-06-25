
import { useCallback } from 'react';
import { useMetricLogger } from './useMetricLogger';
import type { RenderingMetrics } from './types';

export const useRenderingMonitoring = (sessionId?: string) => {
  const { logMetric } = useMetricLogger(sessionId);

  const logRenderingMetrics = useCallback(async (metrics: RenderingMetrics) => {
    try {
      await Promise.all([
        logMetric({
          metricType: '3d_rendering',
          metricName: 'fps_average',
          metricValue: metrics.fpsAverage,
          sessionId: metrics.sessionId,
          metadata: {
            fpsMin: metrics.fpsMin,
            fpsMax: metrics.fpsMax,
            memoryUsedMb: metrics.memoryUsedMb,
            cardCount: metrics.cardCount,
            qualityPreset: metrics.qualityPreset
          }
        }),
        logMetric({
          metricType: '3d_rendering',
          metricName: 'memory_usage',
          metricValue: metrics.memoryUsedMb,
          sessionId: metrics.sessionId,
          metadata: {
            deviceInfo: metrics.deviceInfo,
            webglVersion: metrics.webglVersion,
            renderingErrors: metrics.renderingErrors
          }
        })
      ]);
    } catch (error) {
      console.warn('Failed to log rendering performance:', error);
    }
  }, [logMetric]);

  return { logRenderingMetrics };
};
