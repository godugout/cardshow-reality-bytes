
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Wifi, 
  Monitor, 
  CreditCard, 
  Users,
  Activity
} from 'lucide-react';

interface PerformanceData {
  metric_category: string;
  total_events: number;
  avg_value: number;
  min_value: number;
  max_value: number;
  error_count: number;
}

interface PerformanceOverviewProps {
  performanceData: PerformanceData[];
}

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

const PerformanceOverview = ({ performanceData }: PerformanceOverviewProps) => {
  return (
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
  );
};

export default PerformanceOverview;
