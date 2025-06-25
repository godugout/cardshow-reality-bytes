
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LaunchCriteria } from '../types/launchTypes';
import { getStatusIcon, getPriorityColor, getCategoryIcon } from '../utils/launchUtils';

interface LaunchCriteriaCardProps {
  criterion: LaunchCriteria;
}

const LaunchCriteriaCard = ({ criterion }: LaunchCriteriaCardProps) => {
  const StatusIcon = getStatusIcon(criterion.status);
  const CategoryIcon = getCategoryIcon(criterion.category);

  const getStatusIconColor = (status: LaunchCriteria['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'in_progress':
        return 'text-yellow-500 animate-spin';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon className={`w-5 h-5 ${getStatusIconColor(criterion.status)}`} />
              <div className="flex items-center gap-2">
                <CategoryIcon className="w-4 h-4" />
                <h3 className="font-semibold text-white">{criterion.title}</h3>
              </div>
              <Badge variant={getPriorityColor(criterion.priority)}>
                {criterion.priority}
              </Badge>
            </div>
            
            <p className="text-gray-400 text-sm mb-3">
              {criterion.description}
            </p>
            
            {criterion.testResults && (
              <div className="mt-3 p-3 bg-gray-800 rounded text-sm">
                <strong className="text-white">Test Results:</strong>
                <pre className="mt-2 text-gray-300">
                  {JSON.stringify(criterion.testResults, null, 2)}
                </pre>
              </div>
            )}
            
            {criterion.lastChecked && (
              <div className="text-xs text-gray-500 mt-2">
                Last checked: {criterion.lastChecked.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaunchCriteriaCard;
