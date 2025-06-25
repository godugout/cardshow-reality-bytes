
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WelcomeWizard from './WelcomeWizard';
import { CreatorLevelBadge } from './CreatorLevelBadge';
import GamifiedProgress from './GamifiedProgress';
import InteractiveTutorial from './InteractiveTutorial';
import { 
  BookOpen, 
  Users, 
  Zap, 
  Target,
  TrendingUp,
  Gift,
  Play,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface UserProgress {
  hasCompletedWizard: boolean;
  level: number;
  totalPoints: number;
  completedTasks: string[];
  currentGoals: string[];
}

const CreatorOnboardingDashboard = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    hasCompletedWizard: false,
    level: 1,
    totalPoints: 0,
    completedTasks: [],
    currentGoals: []
  });

  // Mock data for gamification
  const mockAchievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete the welcome wizard',
      icon: Target,
      points: 50,
      unlocked: userProgress.hasCompletedWizard,
      category: 'learn' as const
    },
    {
      id: '2',
      title: 'Creator Debut',
      description: 'Create your first card',
      icon: Zap,
      points: 100,
      unlocked: false,
      category: 'create' as const
    },
    {
      id: '3',
      title: 'First Sale',
      description: 'Earn your first dollar',
      icon: Gift,
      points: 200,
      unlocked: false,
      category: 'earn' as const
    }
  ];

  const mockDailyChallenges = [
    {
      id: '1',
      title: 'Complete a Tutorial',
      description: 'Watch one learning video',
      reward: '+25 XP',
      progress: 0,
      maxProgress: 1,
      timeLeft: '18h left'
    },
    {
      id: '2',
      title: 'Explore Templates',
      description: 'Browse 5 card templates',
      reward: '+15 XP',
      progress: 2,
      maxProgress: 5,
      timeLeft: '18h left'
    }
  ];

  const mockWeeklyGoal = {
    description: 'Create your first card design',
    progress: 0,
    maxProgress: 1,
    reward: 'Unlock Premium Effects'
  };

  const quickActions = [
    {
      id: '1',
      title: 'Create Your First Card',
      description: 'Start with a simple template',
      icon: Zap,
      color: 'bg-blue-500',
      action: 'create-card',
      estimated: '10 min'
    },
    {
      id: '2',
      title: 'Watch Quick Tutorial',
      description: 'Learn the basics in 5 minutes',
      icon: Play,
      color: 'bg-green-500',
      action: 'tutorial',
      estimated: '5 min'
    },
    {
      id: '3',
      title: 'Join Creator Community',
      description: 'Connect with other creators',
      icon: Users,
      color: 'bg-purple-500',
      action: 'community',
      estimated: '2 min'
    },
    {
      id: '4',
      title: 'Explore Marketplace',
      description: 'See what\'s selling well',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      action: 'marketplace',
      estimated: '3 min'
    }
  ];

  const handleWizardComplete = (userData: any) => {
    setUserProgress(prev => ({
      ...prev,
      hasCompletedWizard: true,
      totalPoints: prev.totalPoints + 50,
      currentGoals: userData.goals || []
    }));
  };

  if (!userProgress.hasCompletedWizard) {
    return <WelcomeWizard onComplete={handleWizardComplete} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Back Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, Creator! 🎨
            </h1>
            <p className="text-gray-300">
              Ready to continue your creative journey? Let's build something amazing together.
            </p>
          </div>
          <CreatorLevelBadge 
            currentPoints={userProgress.totalPoints} 
            showProgress={true}
            className="bg-gray-800/50 p-4 rounded-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  className="p-4 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">{action.estimated}</span>
                  </div>
                  <h3 className="text-white font-medium mb-1 group-hover:text-green-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{action.description}</p>
                  <div className="flex items-center text-green-400 text-sm">
                    <span>Start now</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Progress & Goals</TabsTrigger>
          <TabsTrigger value="learn">Learn & Create</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <GamifiedProgress
            userLevel={userProgress.level}
            achievements={mockAchievements}
            dailyChallenges={mockDailyChallenges}
            weeklyGoal={mockWeeklyGoal}
          />
        </TabsContent>

        <TabsContent value="learn">
          <InteractiveTutorial />
        </TabsContent>

        <TabsContent value="community">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Creator Community
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Connect with Fellow Creators</h3>
                <p className="text-gray-400 mb-4">
                  Join discussions, share tips, and collaborate on projects
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Join Community
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-400" />
                  Creator Mentorship
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Get Expert Guidance</h3>
                <p className="text-gray-400 mb-4">
                  Connect with experienced creators for personalized advice
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorOnboardingDashboard;
