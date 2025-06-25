
import { useCallback } from 'react';
import { useMetricLogger } from './useMetricLogger';
import type { DatabaseQuery } from './types';

export const useDatabaseMonitoring = (sessionId?: string) => {
  const { logMetric } = useMetricLogger(sessionId);

  const logDatabaseQuery = useCallback(async (query: DatabaseQuery) => {
    try {
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
  }, [logMetric]);

  return { logDatabaseQuery };
};
