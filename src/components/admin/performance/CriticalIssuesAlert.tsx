
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PerformanceData {
  metric_category: string;
  total_events: number;
  avg_value: number;
  min_value: number;
  max_value: number;
  error_count: number;
}

interface CriticalIssuesAlertProps {
  performanceData: PerformanceData[];
}

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

const CriticalIssuesAlert = ({ performanceData }: CriticalIssuesAlertProps) => {
  const criticalIssues = performanceData.filter(data => {
    const { status } = getPerformanceStatus(data.metric_category, data.avg_value, data.error_count);
    return status === 'critical';
  });

  if (criticalIssues.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {criticalIssues.length} critical performance issue(s) detected. Immediate attention required.
      </AlertDescription>
    </Alert>
  );
};

export default CriticalIssuesAlert;
