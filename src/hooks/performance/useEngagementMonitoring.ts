
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMetricLogger } from './useMetricLogger';
import type { EngagementEvent } from './types';

export const useEngagementMonitoring = (sessionId?: string) => {
  const { user } = useAuth();
  const { logMetric } = useMetricLogger(sessionId);

  const logEngagementEvent = useCallback(async (event: EngagementEvent) => {
    if (!user) return;

    try {
      await logMetric({
        metricType: 'user_engagement',
        metricName: event.eventType,
        metricValue: 1,
        metadata: {
          ...event.eventData,
          pageUrl: event.pageUrl,
          referrer: event.referrer,
          deviceType: event.deviceType,
          browserType: event.browserType,
          sessionDurationMs: event.sessionDurationMs
        },
        sessionId: event.sessionId
      });
    } catch (error) {
      console.warn('Failed to log engagement event:', error);
    }
  }, [user, logMetric]);

  return { logEngagementEvent };
};
