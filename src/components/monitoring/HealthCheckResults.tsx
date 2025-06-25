
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatusIcon } from './healthUtils';
import { HealthCheckResult } from '@/hooks/useIntegrationHealthCheck';

interface HealthCheckResultsProps {
  healthStatus: HealthCheckResult[];
}

const HealthCheckResults = ({ healthStatus }: HealthCheckResultsProps) => {
  if (healthStatus.length === 0) return null;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Recent Health Checks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthStatus.slice(-5).map((check, index) => {
            const StatusIcon = getStatusIcon(check.status);
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-5 h-5 ${check.status === 'healthy' ? 'text-green-400' : check.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`} />
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthCheckResults;
