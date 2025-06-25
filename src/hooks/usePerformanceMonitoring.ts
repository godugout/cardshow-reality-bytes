
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  metricType: 'database' | 'realtime' | '3d_rendering' | 'payment' | 'user_engagement';
  metricName: string;
  metricValue: number;
  metadata?: Record<string, any>;
  sessionId?: string;
}

interface DatabaseQuery {
  queryHash: string;
  queryType: string;
  tableName?: string;
  executionTimeMs: number;
  rowsAffected?: number;
  errorMessage?: string;
}

interface RealtimeEvent {
  connectionId: string;
  channelName?: string;
  eventType: 'connect' | 'disconnect' | 'message' | 'error';
  latencyMs?: number;
  payloadSizeBytes?: number;
  errorDetails?: Record<string, any>;
}

interface RenderingMetrics {
  sessionId: string;
  fpsAverage: number;
  fpsMin: number;
  fpsMax: number;
  memoryUsedMb: number;
  gpuMemoryMb?: number;
  webglVersion: number;
  deviceInfo: Record<string, any>;
  cardCount: number;
  qualityPreset: string;
  renderingErrors: number;
}

interface PaymentMetrics {
  paymentIntentId?: string;
  paymentMethod: string;
  amountCents: number;
  processingTimeMs: number;
  status: 'success' | 'failed' | 'cancelled' | 'pending';
  errorCode?: string;
  errorMessage?: string;
  stripeFeeCents?: number;
}

interface EngagementEvent {
  sessionId: string;
  eventType: 'page_view' | 'card_view' | 'purchase' | 'signup' | 'conversion';
  eventData?: Record<string, any>;
  pageUrl?: string;
  referrer?: string;
  deviceType?: string;
  browserType?: string;
  sessionDurationMs?: number;
}

export const usePerformanceMonitoring = () => {
  const { user } = useAuth();
  const sessionIdRef = useRef<string>();
  const performanceObserverRef = useRef<PerformanceObserver>();
  const startTimeRef = useRef<number>(Date.now());

  // Generate session ID
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  // Generic metric logging - using performance_metrics table for now
  const logMetric = useCallback(async (metric: PerformanceMetric) => {
    if (!user) return;

    try {
      await supabase.from('performance_metrics').insert({
        metric_type: metric.metricType,
        metric_name: metric.metricName,
        metric_value: metric.metricValue,
        metadata: metric.metadata || {},
        user_id: user.id,
        session_id: metric.sessionId || sessionIdRef.current
      });
    } catch (error) {
      console.warn('Failed to log performance metric:', error);
    }
  }, [user]);

  // Database performance logging - fallback to performance_metrics table
  const logDatabaseQuery = useCallback(async (query: DatabaseQuery) => {
    if (!user) return;

    try {
      // Try to use the performance_metrics table as fallback
      await logMetric({
        metricType: 'database',
        metricName: 'query_execution_time',
        metricValue: query.executionTimeMs,
        metadata: {
          queryType: query.queryType,
          tableName: query.tableName,
          isSlowQuery: query.executionTimeMs > 1000,
          queryHash: query.queryHash,
          rowsAffected: query.rowsAffected,
          errorMessage: query.errorMessage
        }
      });
    } catch (error) {
      console.warn('Failed to log database performance:', error);
    }
  }, [user, logMetric]);

  // Realtime performance logging - fallback to performance_metrics table
  const logRealtimeEvent = useCallback(async (event: RealtimeEvent) => {
    if (!user) return;

    try {
      // Try to use the performance_metrics table as fallback
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
  }, [user, logMetric]);

  // 3D rendering performance logging - fallback to performance_metrics table
  const logRenderingMetrics = useCallback(async (metrics: RenderingMetrics) => {
    if (!user) return;

    try {
      // Log individual metrics using performance_metrics table
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
  }, [user, logMetric]);

  // Payment performance logging - fallback to performance_metrics table
  const logPaymentMetrics = useCallback(async (payment: PaymentMetrics) => {
    try {
      // Log as general metric using performance_metrics table
      await logMetric({
        metricType: 'payment',
        metricName: 'processing_time',
        metricValue: payment.processingTimeMs,
        metadata: {
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          amountCents: payment.amountCents,
          paymentIntentId: payment.paymentIntentId,
          errorCode: payment.errorCode,
          errorMessage: payment.errorMessage,
          stripeFeeCents: payment.stripeFeeCents
        }
      });
    } catch (error) {
      console.warn('Failed to log payment performance:', error);
    }
  }, [logMetric]);

  // User engagement logging - fallback to performance_metrics table
  const logEngagementEvent = useCallback(async (event: EngagementEvent) => {
    if (!user) return;

    try {
      // Log as general metric using performance_metrics table
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

  // Auto-track page performance
  useEffect(() => {
    if (!user || !sessionIdRef.current) return;

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
              sessionId: sessionIdRef.current
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

    // Track session duration on page unload
    const handleUnload = () => {
      const sessionDuration = Date.now() - startTimeRef.current;
      logEngagementEvent({
        sessionId: sessionIdRef.current!,
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
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
    };
  }, [user, logMetric, logEngagementEvent]);

  return {
    sessionId: sessionIdRef.current,
    logMetric,
    logDatabaseQuery,
    logRealtimeEvent,
    logRenderingMetrics,
    logPaymentMetrics,
    logEngagementEvent
  };
};
