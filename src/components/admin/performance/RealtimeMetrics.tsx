
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceData {
  metric_category: string;
  total_events: number;
  avg_value: number;
  min_value: number;
  max_value: number;
  error_count: number;
}

interface RealtimeMetricsProps {
  performanceData: PerformanceData[];
}

const RealtimeMetrics = ({ performanceData }: RealtimeMetricsProps) => {
  const realtimeData = performanceData.find(d => d.metric_category === 'realtime');

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Realtime Connection Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {realtimeData?.total_events || 0}
            </div>
            <div className="text-sm text-gray-400">Total Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {realtimeData?.avg_value.toFixed(0) || 0}ms
            </div>
            <div className="text-sm text-gray-400">Avg Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {realtimeData?.error_count || 0}
            </div>
            <div className="text-sm text-gray-400">Connection Errors</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeMetrics;
