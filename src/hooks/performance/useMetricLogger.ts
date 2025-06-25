
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { PerformanceMetric } from './types';

export const useMetricLogger = (sessionId?: string) => {
  const { user } = useAuth();

  const logMetric = useCallback(async (metric: PerformanceMetric) => {
    if (!user) return;

    try {
      await supabase.from('performance_metrics').insert({
        metric_type: metric.metricType,
        metric_name: metric.metricName,
        metric_value: metric.metricValue,
        metadata: metric.metadata || {},
        user_id: user.id,
        session_id: metric.sessionId || sessionId
      });
    } catch (error) {
      console.warn('Failed to log performance metric:', error);
    }
  }, [user, sessionId]);

  return { logMetric };
};
