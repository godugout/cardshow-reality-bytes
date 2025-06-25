
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PerformanceData {
  metric_category: string;
  total_events: number;
  avg_value: number;
  min_value: number;
  max_value: number;
  error_count: number;
}

interface RenderingMetricsProps {
  performanceData: PerformanceData[];
}

const RenderingMetrics = ({ performanceData }: RenderingMetricsProps) => {
  const renderingData = performanceData.find(d => d.metric_category === '3d_rendering');

  return (
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
                  {renderingData?.avg_value.toFixed(1) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min FPS:</span>
                <span className="text-white font-medium">
                  {renderingData?.min_value.toFixed(1) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max FPS:</span>
                <span className="text-white font-medium">
                  {renderingData?.max_value.toFixed(1) || 0}
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
  );
};

export default RenderingMetrics;
