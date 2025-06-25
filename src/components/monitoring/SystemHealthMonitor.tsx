
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Server, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useIntegrationHealthCheck } from '@/hooks/useIntegrationHealthCheck';

interface SystemMetrics {
  database: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    activeConnections: number;
    queryPerformance: number;
  };
  realtime: {
    status: 'healthy' | 'degraded' | 'down';
    activeChannels: number;
    messageLatency: number;
    connectionCount: number;
  };
  storage: {
    status: 'healthy' | 'degraded' | 'down';
    uploadSpeed: number;
    storageUsed: number;
    totalStorage: number;
  };
  api: {
    status: 'healthy' | 'degraded' | 'down';
    averageResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
  };
}

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'down': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const overallHealth = Object.values(metrics).every(service => service.status === 'healthy') 
    ? 'healthy' 
    : Object.values(metrics).some(service => service.status === 'down')
    ? 'down'
    : 'degraded';

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
            {/* Database Health */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white">Database</span>
                </div>
                {getStatusIcon(metrics.database.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Response Time</span>
                  <span>{metrics.database.responseTime}ms</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Connections</span>
                  <span>{metrics.database.activeConnections}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Performance</span>
                  <span>{metrics.database.queryPerformance}%</span>
                </div>
                <Progress value={metrics.database.queryPerformance} className="mt-2" />
              </div>
            </div>

            {/* Realtime Health */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-white">Realtime</span>
                </div>
                {getStatusIcon(metrics.realtime.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Channels</span>
                  <span>{metrics.realtime.activeChannels}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Latency</span>
                  <span>{metrics.realtime.messageLatency}ms</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Connections</span>
                  <span>{metrics.realtime.connectionCount}</span>
                </div>
              </div>
            </div>

            {/* Storage Health */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-white">Storage</span>
                </div>
                {getStatusIcon(metrics.storage.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Upload Speed</span>
                  <span>{metrics.storage.uploadSpeed} MB/s</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Usage</span>
                  <span>{metrics.storage.storageUsed}/{metrics.storage.totalStorage} GB</span>
                </div>
                <Progress 
                  value={(metrics.storage.storageUsed / metrics.storage.totalStorage) * 100} 
                  className="mt-2" 
                />
              </div>
            </div>

            {/* API Health */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">API</span>
                </div>
                {getStatusIcon(metrics.api.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Response Time</span>
                  <span>{metrics.api.averageResponseTime}ms</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Requests/min</span>
                  <span>{metrics.api.requestsPerMinute}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Error Rate</span>
                  <span className={metrics.api.errorRate > 0.03 ? 'text-red-400' : 'text-green-400'}>
                    {(metrics.api.errorRate * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Check Results */}
      {healthStatus.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthStatus.slice(-5).map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="font-medium text-white">{check.system}</div>
                      <div className="text-sm text-gray-400">
                        {check.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {check.latency && (
                      <div className="text-sm text-gray-300">
                        {check.latency}ms
                      </div>
                    )}
                    {check.error && (
                      <div className="text-sm text-red-400">
                        {check.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemHealthMonitor;
