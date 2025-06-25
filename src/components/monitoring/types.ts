
export interface SystemMetrics {
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
