
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { auditor, HealthCheckResult } from '@/utils/integrationAudit';

interface SystemHealth {
  database: HealthCheckResult | null;
  auth: HealthCheckResult | null;
  storage: HealthCheckResult | null;
  realtime: HealthCheckResult | null;
  overall: 'healthy' | 'degraded' | 'down';
}

export const useIntegrationHealthCheck = () => {
  const { user } = useAuth();
  const [health, setHealth] = useState<SystemHealth>({
    database: null,
    auth: null,
    storage: null,
    realtime: null,
    overall: 'healthy'
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkDatabaseHealth = useCallback(async (): Promise<HealthCheckResult> => {
    const start = Date.now();
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('id')
        .limit(1);
      
      const latency = Date.now() - start;
      
      if (error) {
        throw error;
      }

      return {
        system: 'database',
        status: latency > 2000 ? 'degraded' : 'healthy',
        latency,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        system: 'database',
        status: 'down',
        error: error.message,
        timestamp: new Date()
      };
    }
  }, []);

  const checkAuthHealth = useCallback(async (): Promise<HealthCheckResult> => {
    const start = Date.now();
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      const latency = Date.now() - start;
      
      if (error) {
        throw error;
      }

      return {
        system: 'auth',
        status: latency > 1000 ? 'degraded' : 'healthy',
        latency,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        system: 'auth',
        status: 'down',
        error: error.message,
        timestamp: new Date()
      };
    }
  }, []);

  const checkRealtimeHealth = useCallback(async (): Promise<HealthCheckResult> => {
    const start = Date.now();
    return new Promise((resolve) => {
      const channel = supabase.channel('health_check');
      const timeout = setTimeout(() => {
        channel.unsubscribe();
        resolve({
          system: 'realtime',
          status: 'down',
          error: 'Connection timeout',
          timestamp: new Date()
        });
      }, 5000);

      channel.subscribe((status) => {
        clearTimeout(timeout);
        const latency = Date.now() - start;
        
        channel.unsubscribe();
        resolve({
          system: 'realtime',
          status: status === 'SUBSCRIBED' ? 'healthy' : 'degraded',
          latency,
          timestamp: new Date()
        });
      });
    });
  }, []);

  const runHealthChecks = useCallback(async () => {
    setIsChecking(true);
    
    try {
      const [dbHealth, authHealth, realtimeHealth] = await Promise.all([
        checkDatabaseHealth(),
        checkAuthHealth(),
        checkRealtimeHealth()
      ]);

      // Record all health checks
      auditor.recordHealthCheck(dbHealth);
      auditor.recordHealthCheck(authHealth);
      auditor.recordHealthCheck(realtimeHealth);

      // Determine overall health
      const checks = [dbHealth, authHealth, realtimeHealth];
      const downCount = checks.filter(c => c.status === 'down').length;
      const degradedCount = checks.filter(c => c.status === 'degraded').length;

      let overall: 'healthy' | 'degraded' | 'down' = 'healthy';
      if (downCount > 0) {
        overall = 'down';
      } else if (degradedCount > 0) {
        overall = 'degraded';
      }

      setHealth({
        database: dbHealth,
        auth: authHealth,
        storage: null, // TODO: Implement storage health check
        realtime: realtimeHealth,
        overall
      });

    } catch (error) {
      console.error('Health check failed:', error);
      setHealth(prev => ({ ...prev, overall: 'down' }));
    } finally {
      setIsChecking(false);
    }
  }, [checkDatabaseHealth, checkAuthHealth, checkRealtimeHealth]);

  // Auto-run health checks on mount and periodically
  useEffect(() => {
    runHealthChecks();
    
    // Run health checks every 5 minutes
    const interval = setInterval(runHealthChecks, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [runHealthChecks]);

  return {
    health,
    isChecking,
    runHealthChecks,
    generateReport: () => auditor.generateReport()
  };
};
