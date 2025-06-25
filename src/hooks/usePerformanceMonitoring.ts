
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSessionManager } from './performance/useSessionManager';
import { useMetricLogger } from './performance/useMetricLogger';
import { useDatabaseMonitoring } from './performance/useDatabaseMonitoring';
import { useRealtimeMonitoring } from './performance/useRealtimeMonitoring';
import { useRenderingMonitoring } from './performance/useRenderingMonitoring';
import { usePaymentMonitoring } from './performance/usePaymentMonitoring';
import { useEngagementMonitoring } from './performance/useEngagementMonitoring';
import { usePagePerformanceTracking } from './performance/usePagePerformanceTracking';

export const usePerformanceMonitoring = () => {
  const { user } = useAuth();
  const { sessionId, startTime } = useSessionManager();
  
  const { logMetric } = useMetricLogger(sessionId);
  const { logDatabaseQuery } = useDatabaseMonitoring(sessionId);
  const { logRealtimeEvent } = useRealtimeMonitoring(sessionId);
  const { logRenderingMetrics } = useRenderingMonitoring(sessionId);
  const { logPaymentMetrics } = usePaymentMonitoring(sessionId);
  const { logEngagementEvent } = useEngagementMonitoring(sessionId);

  // Auto-track page performance
  usePagePerformanceTracking(sessionId);

  // Track session duration on page unload
  useEffect(() => {
    if (!user || !sessionId) return;

    const handleUnload = () => {
      const sessionDuration = Date.now() - startTime;
      logEngagementEvent({
        sessionId,
        eventType: 'page_view',
        pageUrl: window.location.href,
        sessionDurationMs: sessionDuration,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browserType: navigator.userAgent.includes('Chrome') ? 'chrome' : 
                     navigator.userAgent.includes('Firefox') ? 'firefox' : 'other'
      });
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [user, sessionId, startTime, logEngagementEvent]);

  return {
    sessionId,
    logMetric,
    logDatabaseQuery,
    logRealtimeEvent,
    logRenderingMetrics,
    logPaymentMetrics,
    logEngagementEvent
  };
};
