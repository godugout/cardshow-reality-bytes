
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Database, 
  Server, 
  Zap
} from 'lucide-react';
import { useIntegrationHealthCheck } from '@/hooks/useIntegrationHealthCheck';
import { SystemMetrics } from './types';
import { getOverallHealth } from './healthUtils';
import SystemCard from './SystemCard';
import HealthCheckResults from './HealthCheckResults';

const SystemHealthMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    database: {
      status: 'healthy',
      responseTime: 45,
      activeConnections: 23,
      queryPerformance: 92
    },
    realtime: {
      status: 'healthy',
      activeChannels: 15,
      messageLatency: 25,
      connectionCount: 89
    },
    storage: {
      status: 'healthy',
      uploadSpeed: 12.5,
      storageUsed: 2.4,
      totalStorage: 10
    },
    api: {
      status: 'healthy',
      averageResponseTime: 180,
      requestsPerMinute: 450,
      errorRate: 0.02
    }
  });

  const { runHealthChecks, healthStatus } = useIntegrationHealthCheck();

  useEffect(() => {
    // Run health checks every 30 seconds
    const interval = setInterval(() => {
      runHealthChecks();
      // Simulate real metrics updates
      updateMetrics();
    }, 30000);

    // Initial health check
    runHealthChecks();

    return () => clearInterval(interval);
  }, [runHealthChecks]);

  const updateMetrics = () => {
    setMetrics(prev => ({
      ...prev,
      database: {
        ...prev.database,
        responseTime: Math.floor(Math.random() * 50) + 30,
        activeConnections: Math.floor(Math.random() * 20) + 15,
        queryPerformance: Math.floor(Math.random() * 20) + 80
      },
      api: {
        ...prev.api,
        averageResponseTime: Math.floor(Math.random() * 100) + 150,
        requestsPerMinute: Math.floor(Math.random() * 200) + 350,
        errorRate: Math.random() * 0.05
      }
    }));
  };

  const overallHealth = getOverallHealth(metrics);

  return (
    <div className="space-y-6">
      {/* Overall System Status */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#00C851]" />
            System Health Monitor
            <Badge 
              variant={overallHealth === 'healthy' ? 'default' : 'destructive'}
              className="ml-auto"
            >
              {overallHealth.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SystemCard
              title="Database"
              icon={Database}
              iconColor="text-blue-400"
              status={metrics.database.status}
              metrics={[
                { label: 'Response Time', value: metrics.database.responseTime, unit: 'ms' },
                { label: 'Connections', value: metrics.database.activeConnections },
                { label: 'Performance', value: metrics.database.queryPerformance, unit: '%' }
              ]}
              progressValue={metrics.database.queryPerformance}
            />

            <SystemCard
              title="Realtime"
              icon={Zap}
              iconColor="text-yellow-400"
              status={metrics.realtime.status}
              metrics={[
                { label: 'Channels', value: metrics.realtime.activeChannels },
                { label: 'Latency', value: metrics.realtime.messageLatency, unit: 'ms' },
                { label: 'Connections', value: metrics.realtime.connectionCount }
              ]}
            />

            <SystemCard
              title="Storage"
              icon={Server}
              iconColor="text-purple-400"
              status={metrics.storage.status}
              metrics={[
                { label: 'Upload Speed', value: metrics.storage.uploadSpeed, unit: ' MB/s' },
                { label: 'Usage', value: `${metrics.storage.storageUsed}/${metrics.storage.totalStorage}`, unit: ' GB' }
              ]}
              progressValue={(metrics.storage.storageUsed / metrics.storage.totalStorage) * 100}
            />

            <SystemCard
              title="API"
              icon={Activity}
              iconColor="text-green-400"
              status={metrics.api.status}
              metrics={[
                { label: 'Response Time', value: metrics.api.averageResponseTime, unit: 'ms' },
                { label: 'Requests/min', value: metrics.api.requestsPerMinute },
                { 
                  label: 'Error Rate', 
                  value: (metrics.api.errorRate * 100).toFixed(2), 
                  unit: '%' 
                }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <HealthCheckResults healthStatus={healthStatus} />
    </div>
  );
};

export default SystemHealthMonitor;
