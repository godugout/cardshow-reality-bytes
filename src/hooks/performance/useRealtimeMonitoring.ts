
import { useCallback } from 'react';
import { useMetricLogger } from './useMetricLogger';
import type { RealtimeEvent } from './types';

export const useRealtimeMonitoring = (sessionId?: string) => {
  const { logMetric } = useMetricLogger(sessionId);

  const logRealtimeEvent = useCallback(async (event: RealtimeEvent) => {
    try {
      if (event.latencyMs) {
        await logMetric({
          metricType: 'realtime',
          metricName: 'latency',
          metricValue: event.latencyMs,
          metadata: {
            eventType: event.eventType,
            channelName: event.channelName,
            connectionId: event.connectionId,
            payloadSizeBytes: event.payloadSizeBytes,
            errorDetails: event.errorDetails
          }
        });
      }
    } catch (error) {
      console.warn('Failed to log realtime performance:', error);
    }
  }, [logMetric]);

  return { logRealtimeEvent };
};
