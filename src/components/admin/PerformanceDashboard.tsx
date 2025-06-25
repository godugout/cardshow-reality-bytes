
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceOverview from './performance/PerformanceOverview';
import CriticalIssuesAlert from './performance/CriticalIssuesAlert';
import SlowQueriesPanel from './performance/SlowQueriesPanel';
import RealtimeMetrics from './performance/RealtimeMetrics';
import RenderingMetrics from './performance/RenderingMetrics';
import PaymentMetrics from './performance/PaymentMetrics';
import EngagementMetrics from './performance/EngagementMetrics';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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

      <CriticalIssuesAlert performanceData={performanceData} />

      <PerformanceOverview performanceData={performanceData} />

      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900">
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="realtime">Realtime</TabsTrigger>
          <TabsTrigger value="rendering">3D Rendering</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <SlowQueriesPanel slowQueries={slowQueries} />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <RealtimeMetrics performanceData={performanceData} />
        </TabsContent>

        <TabsContent value="rendering" className="space-y-4">
          <RenderingMetrics performanceData={performanceData} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentMetrics performanceData={performanceData} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <EngagementMetrics performanceData={performanceData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
