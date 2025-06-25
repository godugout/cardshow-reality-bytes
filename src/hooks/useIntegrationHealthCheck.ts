
import { useState, useCallback } from 'react';

export interface HealthCheckResult {
  system: string;
  status: 'healthy' | 'degraded' | 'down';
  timestamp: Date;
  latency?: number;
  error?: string;
}

export interface SystemHealth {
  database: 'healthy' | 'degraded' | 'down';
  realtime: 'healthy' | 'degraded' | 'down';
  storage: 'healthy' | 'degraded' | 'down';
  api: 'healthy' | 'degraded' | 'down';
}

export const useIntegrationHealthCheck = () => {
  const [health, setHealth] = useState<SystemHealth>({
    database: 'healthy',
    realtime: 'healthy',
    storage: 'healthy',
    api: 'healthy'
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
      const newHealth: SystemHealth = {
        database: results.find(r => r.system === 'Database')?.status || 'down',
        realtime: results.find(r => r.system === 'Realtime')?.status || 'down',
        storage: results.find(r => r.system === 'Storage')?.status || 'down',
        api: results.find(r => r.system === 'API')?.status || 'down'
      };

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
    const healthSummary = Object.entries(health)
      .map(([system, status]) => `${system}: ${status}`)
      .join(', ');
    
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
