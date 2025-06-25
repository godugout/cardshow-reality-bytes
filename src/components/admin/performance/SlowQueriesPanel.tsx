
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SlowQuery {
  query_hash: string;
  query_type: string;
  table_name: string;
  avg_execution_time: number;
  max_execution_time: number;
  occurrence_count: number;
}

interface SlowQueriesPanelProps {
  slowQueries: SlowQuery[];
}

const SlowQueriesPanel = ({ slowQueries }: SlowQueriesPanelProps) => {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Slow Queries</CardTitle>
      </CardHeader>
      <CardContent>
        {slowQueries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No slow queries detected
          </div>
        ) : (
          <div className="space-y-4">
            {slowQueries.slice(0, 10).map((query, index) => (
              <div key={`${query.query_hash}-${index}`} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{query.query_type}</Badge>
                    <span className="text-white font-medium">{query.table_name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-400">
                      {query.avg_execution_time.toFixed(0)}ms
                    </div>
                    <div className="text-xs text-gray-400">
                      {query.occurrence_count} occurrences
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Max: {query.max_execution_time}ms
                </div>
                <Progress 
                  value={Math.min((query.avg_execution_time / 5000) * 100, 100)} 
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SlowQueriesPanel;
