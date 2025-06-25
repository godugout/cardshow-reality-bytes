
import { Progress } from '@/components/ui/progress';
import { getStatusIcon } from './healthUtils';

interface SystemCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  status: 'healthy' | 'degraded' | 'down';
  metrics: Array<{
    label: string;
    value: string | number;
    unit?: string;
  }>;
  progressValue?: number;
}

const SystemCard = ({ title, icon: Icon, iconColor, status, metrics, progressValue }: SystemCardProps) => {
  const StatusIcon = getStatusIcon(status);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <span className="font-medium text-white">{title}</span>
        </div>
        <StatusIcon className={`w-5 h-5 ${getStatusIcon(status) === StatusIcon ? 'text-green-400' : status === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`} />
      </div>
      
      <div className="space-y-2 text-sm">
        {metrics.map((metric, index) => (
          <div key={index} className="flex justify-between text-gray-300">
            <span>{metric.label}</span>
            <span>{metric.value}{metric.unit}</span>
          </div>
        ))}
        {progressValue !== undefined && (
          <Progress value={progressValue} className="mt-2" />
        )}
      </div>
    </div>
  );
};

export default SystemCard;
