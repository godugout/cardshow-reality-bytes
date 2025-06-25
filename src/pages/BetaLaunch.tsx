
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Users, MessageSquare, BarChart3 } from 'lucide-react';
import BetaLaunchDashboard from '@/components/admin/BetaLaunchDashboard';
import BetaFeedbackSystem from '@/components/support/BetaFeedbackSystem';
import BetaUserTutorial from '@/components/onboarding/BetaUserTutorial';
import IntegrationTestChecklist from '@/components/IntegrationTestChecklist';

const BetaLaunch = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-10 h-10 text-[#00C851]" />
            <div>
              <h1 className="text-4xl font-bold text-white">Beta Launch Center</h1>
              <p className="text-gray-400 text-lg">
                Comprehensive testing, monitoring, and launch readiness verification
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-800">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-[#00C851] data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Launch Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="testing"
              className="flex items-center gap-2 data-[state=active]:bg-[#00C851] data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              Integration Testing
            </TabsTrigger>
            <TabsTrigger 
              value="feedback"
              className="flex items-center gap-2 data-[state=active]:bg-[#00C851] data-[state=active]:text-white"
            >
              <MessageSquare className="w-4 h-4" />
              Beta Feedback
            </TabsTrigger>
            <TabsTrigger 
              value="onboarding"
              className="flex items-center gap-2 data-[state=active]:bg-[#00C851] data-[state=active]:text-white"
            >
              <Rocket className="w-4 h-4" />
              User Onboarding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <BetaLaunchDashboard />
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <IntegrationTestChecklist />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <BetaFeedbackSystem />
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <BetaUserTutorial autoStart={false} />
              <div className="mt-8 text-center">
                <p className="text-gray-400 mb-4">
                  The tutorial system will automatically launch for new beta users.
                </p>
                <p className="text-sm text-gray-500">
                  Tutorial completion rate and user feedback will be tracked for optimization.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BetaLaunch;
