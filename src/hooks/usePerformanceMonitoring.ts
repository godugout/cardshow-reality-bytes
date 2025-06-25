
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

  // Generic metric logging
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

  // Database performance logging
  const logDatabaseQuery = useCallback(async (query: DatabaseQuery) => {
    if (!user) return;

    try {
      await supabase.from('database_performance').insert({
        query_hash: query.queryHash,
        query_type: query.queryType,
        table_name: query.tableName,
        execution_time_ms: query.executionTimeMs,
        rows_affected: query.rowsAffected,
        is_slow_query: query.executionTimeMs > 1000,
        error_message: query.errorMessage,
        user_id: user.id
      });

      // Also log as general metric
      await logMetric({
        metricType: 'database',
        metricName: 'query_execution_time',
        metricValue: query.executionTimeMs,
        metadata: {
          queryType: query.queryType,
          tableName: query.tableName,
          isSlowQuery: query.executionTimeMs > 1000
        }
      });
    } catch (error) {
      console.warn('Failed to log database performance:', error);
    }
  }, [user, logMetric]);

  // Realtime performance logging
  const logRealtimeEvent = useCallback(async (event: RealtimeEvent) => {
    if (!user) return;

    try {
      await supabase.from('realtime_performance').insert({
        connection_id: event.connectionId,
        channel_name: event.channelName,
        event_type: event.eventType,
        latency_ms: event.latencyMs,
        payload_size_bytes: event.payloadSizeBytes,
        error_details: event.errorDetails,
        user_id: user.id
      });

      // Also log as general metric
      if (event.latencyMs) {
        await logMetric({
          metricType: 'realtime',
          metricName: 'latency',
          metricValue: event.latencyMs,
          metadata: {
            eventType: event.eventType,
            channelName: event.channelName
          }
        });
      }
    } catch (error) {
      console.warn('Failed to log realtime performance:', error);
    }
  }, [user, logMetric]);

  // 3D rendering performance logging
  const logRenderingMetrics = useCallback(async (metrics: RenderingMetrics) => {
    if (!user) return;

    try {
      await supabase.from('rendering_performance').insert({
        user_id: user.id,
        session_id: metrics.sessionId,
        fps_average: metrics.fpsAverage,
        fps_min: metrics.fpsMin,
        fps_max: metrics.fpsMax,
        memory_used_mb: metrics.memoryUsedMb,
        gpu_memory_mb: metrics.gpuMemoryMb,
        webgl_version: metrics.webglVersion,
        device_info: metrics.deviceInfo,
        card_count: metrics.cardCount,
        quality_preset: metrics.qualityPreset,
        rendering_errors: metrics.renderingErrors
      });

      // Log individual metrics
      await Promise.all([
        logMetric({
          metricType: '3d_rendering',
          metricName: 'fps_average',
          metricValue: metrics.fpsAverage,
          sessionId: metrics.sessionId
        }),
        logMetric({
          metricType: '3d_rendering',
          metricName: 'memory_usage',
          metricValue: metrics.memoryUsedMb,
          sessionId: metrics.sessionId
        })
      ]);
    } catch (error) {
      console.warn('Failed to log rendering performance:', error);
    }
  }, [user, logMetric]);

  // Payment performance logging
  const logPaymentMetrics = useCallback(async (payment: PaymentMetrics) => {
    try {
      await supabase.from('payment_performance').insert({
        payment_intent_id: payment.paymentIntentId,
        payment_method: payment.paymentMethod,
        amount_cents: payment.amountCents,
        processing_time_ms: payment.processingTimeMs,
        status: payment.status,
        error_code: payment.errorCode,
        error_message: payment.errorMessage,
        stripe_fee_cents: payment.stripeFeeCents,
        user_id: user?.id
      });

      // Log as general metric
      await logMetric({
        metricType: 'payment',
        metricName: 'processing_time',
        metricValue: payment.processingTimeMs,
        metadata: {
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          amountCents: payment.amountCents
        }
      });
    } catch (error) {
      console.warn('Failed to log payment performance:', error);
    }
  }, [user, logMetric]);

  // User engagement logging
  const logEngagementEvent = useCallback(async (event: EngagementEvent) => {
    if (!user) return;

    try {
      await supabase.from('engagement_metrics').insert({
        user_id: user.id,
        session_id: event.sessionId,
        event_type: event.eventType,
        event_data: event.eventData || {},
        page_url: event.pageUrl,
        referrer: event.referrer,
        device_type: event.deviceType,
        browser_type: event.browserType,
        session_duration_ms: event.sessionDurationMs
      });

      // Log as general metric
      await logMetric({
        metricType: 'user_engagement',
        metricName: event.eventType,
        metricValue: 1,
        metadata: event.eventData,
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
