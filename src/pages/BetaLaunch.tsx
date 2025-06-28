
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Users, MessageSquare, BarChart3 } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import BetaLaunchDashboard from '@/components/admin/BetaLaunchDashboard';
import BetaFeedbackSystem from '@/components/support/BetaFeedbackSystem';
import BetaUserTutorial from '@/components/onboarding/BetaUserTutorial';
import IntegrationTestChecklist from '@/components/IntegrationTestChecklist';

const BetaLaunch = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-display-lg text-foreground">Beta Launch Center</h1>
              <p className="text-body-lg text-muted-foreground">
                Comprehensive testing, monitoring, and launch readiness verification
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Launch Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="testing"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Integration Testing
            </TabsTrigger>
            <TabsTrigger 
              value="feedback"
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Beta Feedback
            </TabsTrigger>
            <TabsTrigger 
              value="onboarding"
              className="flex items-center gap-2"
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
                <p className="text-muted-foreground mb-4">
                  The tutorial system will automatically launch for new beta users.
                </p>
                <p className="text-body-sm text-muted-foreground">
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
