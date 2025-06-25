
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceData {
  metric_category: string;
  total_events: number;
  avg_value: number;
  min_value: number;
  max_value: number;
  error_count: number;
}

interface PaymentMetricsProps {
  performanceData: PerformanceData[];
}

const PaymentMetrics = ({ performanceData }: PaymentMetricsProps) => {
  const paymentData = performanceData.find(d => d.metric_category === 'payment');

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Payment Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {(100 - (paymentData?.error_count || 0) / Math.max(paymentData?.total_events || 1, 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {paymentData?.avg_value.toFixed(0) || 0}ms
            </div>
            <div className="text-sm text-gray-400">Avg Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {paymentData?.total_events || 0}
            </div>
            <div className="text-sm text-gray-400">Total Payments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {paymentData?.error_count || 0}
            </div>
            <div className="text-sm text-gray-400">Failed Payments</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMetrics;
