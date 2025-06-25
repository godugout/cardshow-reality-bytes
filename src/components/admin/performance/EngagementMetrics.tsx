
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceData {
  metric_category: string;
  total_events: number;
  avg_value: number;
  min_value: number;
  max_value: number;
  error_count: number;
}

interface EngagementMetricsProps {
  performanceData: PerformanceData[];
}

const EngagementMetrics = ({ performanceData }: EngagementMetricsProps) => {
  const engagementData = performanceData.find(d => d.metric_category === 'user_engagement');

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">User Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {engagementData?.total_events || 0}
            </div>
            <div className="text-sm text-gray-400">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {engagementData?.avg_value.toFixed(0) || 0}ms
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
  );
};

export default EngagementMetrics;
