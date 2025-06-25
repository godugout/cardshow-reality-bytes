
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Wifi, 
  Monitor, 
  CreditCard, 
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceData {
  metric_category: string;
  total_events: number;
  avg_value: number;
  min_value: number;
  max_value: number;
  error_count: number;
}

interface SlowQuery {
  query_hash: string;
  query_type: string;
  table_name: string;
  avg_execution_time: number;
  max_execution_time: number;
  occurrence_count: number;
}

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [slowQueries, setSlowQueries] = useState<SlowQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  useEffect(() => {
    fetchPerformanceData();
    fetchSlowQueries();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchPerformanceData();
      fetchSlowQueries();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    try {
      const hoursBack = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : 168;
      const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
      
      // Temporarily use mock data until the function is available
      const mockData: PerformanceData[] = [
        {
          metric_category: 'database',
          total_events: 1250,
          avg_value: 125.5,
          min_value: 15.2,
          max_value: 2340.1,
          error_count: 12
        },
        {
          metric_category: 'realtime',
          total_events: 892,
          avg_value: 45.2,
          min_value: 12.1,
          max_value: 156.8,
          error_count: 3
        },
        {
          metric_category: '3d_rendering',
          total_events: 445,
          avg_value: 58.7,
          min_value: 30.2,
          max_value: 60.0,
          error_count: 8
        },
        {
          metric_category: 'payment',
          total_events: 156,
          avg_value: 1250.0,
          min_value: 890.0,
          max_value: 2100.0,
          error_count: 2
        },
        {
          metric_category: 'user_engagement',
          total_events: 2340,
          avg_value: 1.0,
          min_value: 1.0,
          max_value: 1.0,
          error_count: 0
        }
      ];
      
      setPerformanceData(mockData);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      setPerformanceData([]);
    }
  };

  const fetchSlowQueries = async () => {
    try {
      // Temporarily use mock data until the function is available
      const mockQueries: SlowQuery[] = [
        {
          query_hash: 'abc123',
          query_type: 'SELECT',
          table_name: 'cards',
          avg_execution_time: 2150.5,
          max_execution_time: 3200,
          occurrence_count: 25
        },
        {
          query_hash: 'def456',
          query_type: 'UPDATE',
          table_name: 'collections',
          avg_execution_time: 1850.2,
          max_execution_time: 2800,
          occurrence_count: 18
        }
      ];
      
      setSlowQueries(mockQueries);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch slow queries:', error);
      setSlowQueries([]);
      setLoading(false);
    }
  };

  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'realtime': return <Wifi className="h-4 w-4" />;
      case '3d_rendering': return <Monitor className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'user_engagement': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPerformanceStatus = (category: string, avgValue: number, errorCount: number) => {
    const errorRate = errorCount / Math.max(avgValue, 1);
    
    if (errorRate > 0.1) return { status: 'critical', color: 'destructive' };
    if (errorRate > 0.05) return { status: 'warning', color: 'secondary' };
    
    switch (category) {
      case 'database':
        if (avgValue > 2000) return { status: 'slow', color: 'destructive' };
        if (avgValue > 1000) return { status: 'warning', color: 'secondary' };
        return { status: 'good', color: 'default' };
      
      case '3d_rendering':
        if (avgValue < 30) return { status: 'poor fps', color: 'destructive' };
        if (avgValue < 45) return { status: 'low fps', color: 'secondary' };
        return { status: 'good fps', color: 'default' };
      
      default:
        return { status: 'healthy', color: 'default' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const criticalIssues = performanceData.filter(data => {
    const { status } = getPerformanceStatus(data.metric_category, data.avg_value, data.error_count);
    return status === 'critical';
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {criticalIssues.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {criticalIssues.length} critical performance issue(s) detected. Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {performanceData.map((data) => {
          const { status, color } = getPerformanceStatus(data.metric_category, data.avg_value, data.error_count);
          const errorRate = (data.error_count / Math.max(data.total_events, 1)) * 100;
          
          return (
            <Card key={data.metric_category} className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 capitalize">
                  {data.metric_category.replace('_', ' ')}
                </CardTitle>
                {getMetricIcon(data.metric_category)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {data.avg_value.toFixed(data.metric_category === '3d_rendering' ? 1 : 0)}
                  {data.metric_category === 'database' && 'ms'}
                  {data.metric_category === '3d_rendering' && 'fps'}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={color as any} className="text-xs">
                    {status}
                  </Badge>
                  {errorRate > 0 && (
                    <span className="text-xs text-red-400">
                      {errorRate.toFixed(1)}% errors
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {data.total_events.toLocaleString()} events
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900">
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="realtime">Realtime</TabsTrigger>
          <TabsTrigger value="rendering">3D Rendering</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Slow Queries</CardTitle>
            </CardHeader>
            <CardContent>
              {slowQueries.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No slow queries detected
                </div>
              ) : (
                <div className="space-y-4">
                  {slowQueries.slice(0, 10).map((query, index) => (
                    <div key={`${query.query_hash}-${index}`} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{query.query_type}</Badge>
                          <span className="text-white font-medium">{query.table_name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-400">
                            {query.avg_execution_time.toFixed(0)}ms
                          </div>
                          <div className="text-xs text-gray-400">
                            {query.occurrence_count} occurrences
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Max: {query.max_execution_time}ms
                      </div>
                      <Progress 
                        value={Math.min((query.avg_execution_time / 5000) * 100, 100)} 
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Realtime Connection Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.find(d => d.metric_category === 'realtime')?.total_events || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.find(d => d.metric_category === 'realtime')?.avg_value.toFixed(0) || 0}ms
                  </div>
                  <div className="text-sm text-gray-400">Avg Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.find(d => d.metric_category === 'realtime')?.error_count || 0}
                  </div>
                  <div className="text-sm text-gray-400">Connection Errors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rendering" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">3D Rendering Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Frame Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average FPS:</span>
                      <span className="text-white font-medium">
                        {performanceData.find(d => d.metric_category === '3d_rendering')?.avg_value.toFixed(1) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min FPS:</span>
                      <span className="text-white font-medium">
                        {performanceData.find(d => d.metric_category === '3d_rendering')?.min_value.toFixed(1) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max FPS:</span>
                      <span className="text-white font-medium">
                        {performanceData.find(d => d.metric_category === '3d_rendering')?.max_value.toFixed(1) || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Memory Usage</h4>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                      {(Math.random() * 100 + 50).toFixed(0)}MB
                    </div>
                    <div className="text-sm text-gray-400">Average Memory</div>
                    <Progress value={65} className="mt-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Payment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {(100 - (performanceData.find(d => d.metric_category === 'payment')?.error_count || 0) / Math.max(performanceData.find(d => d.metric_category === 'payment')?.total_events || 1, 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.find(d => d.metric_category === 'payment')?.avg_value.toFixed(0) || 0}ms
                  </div>
                  <div className="text-sm text-gray-400">Avg Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.find(d => d.metric_category === 'payment')?.total_events || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Payments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {performanceData.find(d => d.metric_category === 'payment')?.error_count || 0}
                  </div>
                  <div className="text-sm text-gray-400">Failed Payments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.find(d => d.metric_category === 'user_engagement')?.total_events || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.find(d => d.metric_category === 'user_engagement')?.avg_value.toFixed(0) || 0}ms
                  </div>
                  <div className="text-sm text-gray-400">Avg Session Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {(Math.random() * 10 + 5).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
