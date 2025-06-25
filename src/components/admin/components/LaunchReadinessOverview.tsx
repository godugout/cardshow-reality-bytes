
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Rocket, Clock, Zap } from 'lucide-react';
import { LaunchStats } from '../types/launchTypes';

interface LaunchReadinessOverviewProps {
  stats: LaunchStats;
  isRunningTests: boolean;
  onRunTests: () => void;
  launchReady: boolean;
}

const LaunchReadinessOverview = ({ 
  stats, 
  isRunningTests, 
  onRunTests, 
  launchReady 
}: LaunchReadinessOverviewProps) => {
  const overallProgress = Math.round((stats.completed / stats.total) * 100);
  const criticalProgress = Math.round((stats.criticalCompleted / stats.critical) * 100);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Rocket className="w-6 h-6 text-[#00C851]" />
          Beta Launch Readiness Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-3xl font-bold text-white mb-2">{overallProgress}%</div>
            <div className="text-sm text-gray-400">Overall Progress</div>
            <Progress value={overallProgress} className="mt-2" />
          </div>
          
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-3xl font-bold text-white mb-2">{criticalProgress}%</div>
            <div className="text-sm text-gray-400">Critical Items</div>
            <Progress value={criticalProgress} className="mt-2" />
          </div>
          
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className={`text-3xl font-bold mb-2 ${launchReady ? 'text-green-400' : 'text-red-400'}`}>
              {launchReady ? 'READY' : 'NOT READY'}
            </div>
            <div className="text-sm text-gray-400">Launch Status</div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={onRunTests} 
            disabled={isRunningTests}
            className="bg-[#00C851] hover:bg-[#00a844]"
          >
            {isRunningTests ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Comprehensive Tests
              </>
            )}
          </Button>
          
          {launchReady && (
            <Button variant="outline" className="border-green-500 text-green-400">
              <Rocket className="w-4 h-4 mr-2" />
              Proceed to Beta Launch
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LaunchReadinessOverview;
