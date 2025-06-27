import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCards } from '@/hooks/useCards';
import { useCardStats } from '@/hooks/useCardStats';
import { useAuth } from '@/hooks/useAuth';
import CardPhysics from '@/components/cards/CardPhysics';
import SpatialLayout from '@/components/ui/SpatialLayout';
import { 
  Plus, 
  TrendingUp, 
  Eye, 
  Heart, 
  DollarSign,
  Zap,
  Target,
  Palette
} from 'lucide-react';

export const CreatorDashboard = () => {
  const { user } = useAuth();
  const { cards, isLoading } = useCards({ creator_id: user?.id });
  const { data: stats } = useCardStats(user?.id);
  const [selectedGoal, setSelectedGoal] = useState<'showcase' | 'create' | 'trade'>('create');

  const goals = [
    {
      id: 'create' as const,
      title: 'Create Cards',
      description: 'Design and publish new trading cards',
      icon: Palette,
      color: 'bg-blue-500',
      progress: (cards?.length || 0) / 10 * 100, // Goal: 10 cards
      actionText: 'Start Creating'
    },
    {
      id: 'showcase' as const,
      title: 'Showcase Work',
      description: 'Build your portfolio and gain visibility',
      icon: Eye,
      color: 'bg-green-500',
      progress: (stats?.views || 0) / 1000 * 100, // Goal: 1000 views
      actionText: 'Optimize Cards'
    },
    {
      id: 'trade' as const,
      title: 'Enable Trading',
      description: 'Make your cards available for trading',
      icon: TrendingUp,
      color: 'bg-purple-500',
      progress: (stats?.tradeable_cards || 0) / (cards?.length || 1) * 100,
      actionText: 'Enable Trading'
    }
  ];

  const currentGoal = goals.find(g => g.id === selectedGoal);

  return (
    <div className="space-y-8">
      {/* Card-Centric Goal Selection */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Your Card Journey</h2>
        <p className="text-muted-foreground mb-6">
          Choose your primary focus to get personalized recommendations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            
            return (
              <Card 
                key={goal.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedGoal(goal.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${goal.color} mx-auto mb-4 flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                  <div className="space-y-2">
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(goal.progress)}% Complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Current Goal Focus Area */}
      {currentGoal && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${currentGoal.color} flex items-center justify-center`}>
                <currentGoal.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Focus: {currentGoal.title}</CardTitle>
                <p className="text-muted-foreground">{currentGoal.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <Progress value={currentGoal.progress} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(currentGoal.progress)}% toward your goal
                </p>
              </div>
              <Button className="shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                {currentGoal.actionText}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats - Card Focused */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{cards?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Cards Created</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats?.views || 0}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats?.favorites || 0}</div>
            <div className="text-sm text-muted-foreground">Favorites</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">
              ${(stats?.earnings || 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Earnings</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cards Showcase */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Your Latest Cards</h3>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-80 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : cards && cards.length > 0 ? (
          <SpatialLayout variant="grid" spacing="normal">
            {cards.slice(0, 8).map((card) => (
              <CardPhysics
                key={card.id}
                card={card}
                size="md"
                interactive={true}
                showDetails={true}
              />
            ))}
          </SpatialLayout>
        ) : (
          <Card className="p-12 text-center border-dashed border-2 border-muted">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
                <Palette className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Start Your Card Collection
                </h4>
                <p className="text-muted-foreground mb-4">
                  Create your first trading card to begin your journey
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Card
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Card-Centric Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Optimize Card Performance</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Get insights on which cards perform best and how to improve visibility
                </p>
                <Button variant="outline" size="sm">
                  View Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Enable Card Trading</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Make your cards available for trading and set up marketplace listings
                </p>
                <Button variant="outline" size="sm">
                  Setup Trading
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
