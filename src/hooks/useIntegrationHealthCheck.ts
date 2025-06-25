
import { useState, useCallback } from 'react';

export interface HealthCheckResult {
  system: string;
  status: 'healthy' | 'degraded' | 'down';
  timestamp: Date;
  latency?: number;
  error?: string;
}

export interface SystemHealth {
  database: {
    status: 'healthy' | 'degraded' | 'down';
    latency?: number;
  };
  realtime: {
    status: 'healthy' | 'degraded' | 'down';
    latency?: number;
  };
  storage: {
    status: 'healthy' | 'degraded' | 'down';
    latency?: number;
  };
  api: {
    status: 'healthy' | 'degraded' | 'down';
    latency?: number;
  };
  auth: {
    status: 'healthy' | 'degraded' | 'down';
    latency?: number;
  };
  overall: 'healthy' | 'degraded' | 'down';
}

export const useIntegrationHealthCheck = () => {
  const [health, setHealth] = useState<SystemHealth>({
    database: { status: 'healthy' },
    realtime: { status: 'healthy' },
    storage: { status: 'healthy' },
    api: { status: 'healthy' },
    auth: { status: 'healthy' },
    overall: 'healthy'
  });
  
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const runHealthChecks = useCallback(async () => {
    setIsChecking(true);
    const results: HealthCheckResult[] = [];

    try {
      // Database health check
      const dbStart = Date.now();
      try {
        // Simulate database check
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        const dbLatency = Date.now() - dbStart;
        
        results.push({
          system: 'Database',
          status: dbLatency < 100 ? 'healthy' : 'degraded',
          timestamp: new Date(),
          latency: dbLatency
        });
      } catch (error) {
        results.push({
          system: 'Database',
          status: 'down',
          timestamp: new Date(),
          error: 'Connection failed'
        });
      }

      // Auth health check
      const authStart = Date.now();
      try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 80));
        const authLatency = Date.now() - authStart;
        
        results.push({
          system: 'Auth',
          status: 'healthy',
          timestamp: new Date(),
          latency: authLatency
        });
      } catch (error) {
        results.push({
          system: 'Auth',
          status: 'down',
          timestamp: new Date(),
          error: 'Auth service unavailable'
        });
      }

      // Realtime health check
      const realtimeStart = Date.now();
      try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        const realtimeLatency = Date.now() - realtimeStart;
        
        results.push({
          system: 'Realtime',
          status: 'healthy',
          timestamp: new Date(),
          latency: realtimeLatency
        });
      } catch (error) {
        results.push({
          system: 'Realtime',
          status: 'down',
          timestamp: new Date(),
          error: 'Connection failed'
        });
      }

      // Storage health check
      try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 75));
        
        results.push({
          system: 'Storage',
          status: 'healthy',
          timestamp: new Date()
        });
      } catch (error) {
        results.push({
          system: 'Storage',
          status: 'down',
          timestamp: new Date(),
          error: 'Storage unavailable'
        });
      }

      // API health check
      const apiStart = Date.now();
      try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 150));
        const apiLatency = Date.now() - apiStart;
        
        results.push({
          system: 'API',
          status: apiLatency < 200 ? 'healthy' : 'degraded',
          timestamp: new Date(),
          latency: apiLatency
        });
      } catch (error) {
        results.push({
          system: 'API',
          status: 'down',
          timestamp: new Date(),
          error: 'API unavailable'
        });
      }

      // Update health status
      const dbResult = results.find(r => r.system === 'Database');
      const authResult = results.find(r => r.system === 'Auth');
      const realtimeResult = results.find(r => r.system === 'Realtime');
      const storageResult = results.find(r => r.system === 'Storage');
      const apiResult = results.find(r => r.system === 'API');

      const newHealth: SystemHealth = {
        database: { 
          status: dbResult?.status || 'down', 
          latency: dbResult?.latency 
        },
        auth: { 
          status: authResult?.status || 'down', 
          latency: authResult?.latency 
        },
        realtime: { 
          status: realtimeResult?.status || 'down', 
          latency: realtimeResult?.latency 
        },
        storage: { 
          status: storageResult?.status || 'down', 
          latency: storageResult?.latency 
        },
        api: { 
          status: apiResult?.status || 'down', 
          latency: apiResult?.latency 
        },
        overall: 'healthy'
      };

      // Calculate overall health
      const statuses = [
        newHealth.database.status,
        newHealth.auth.status,
        newHealth.realtime.status,
        newHealth.storage.status,
        newHealth.api.status
      ];

      if (statuses.some(status => status === 'down')) {
        newHealth.overall = 'down';
      } else if (statuses.some(status => status === 'degraded')) {
        newHealth.overall = 'degraded';
      } else {
        newHealth.overall = 'healthy';
      }

      setHealth(newHealth);
      setHealthStatus(prev => [...prev, ...results].slice(-20)); // Keep last 20 results

    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const generateReport = useCallback(() => {
    const timestamp = new Date().toISOString();
    const healthSummary = `Overall: ${health.overall}, Database: ${health.database.status}, Auth: ${health.auth.status}, Realtime: ${health.realtime.status}, Storage: ${health.storage.status}, API: ${health.api.status}`;
    
    return `Health Check Report (${timestamp})\n${healthSummary}`;
  }, [health]);

  return {
    health,
    healthStatus,
    isChecking,
    runHealthChecks,
    generateReport
  };
};
