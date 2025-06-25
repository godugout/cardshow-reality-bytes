
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  CheckCircle, 
  Lock,
  Gift,
  Zap,
  Star,
  Award
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  points: number;
  unlocked: boolean;
  category: 'create' | 'earn' | 'social' | 'learn';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  maxProgress: number;
  timeLeft?: string;
}

interface GamifiedProgressProps {
  userLevel: number;
  achievements: Achievement[];
  dailyChallenges: Challenge[];
  weeklyGoal: {
    description: string;
    progress: number;
    maxProgress: number;
    reward: string;
  };
}

const GamifiedProgress = ({ 
  userLevel, 
  achievements, 
  dailyChallenges,
  weeklyGoal 
}: GamifiedProgressProps) => {
  const categoryColors = {
    create: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    earn: 'bg-green-500/20 text-green-400 border-green-500/30',
    social: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    learn: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  const categoryIcons = {
    create: Zap,
    earn: Gift,
    social: Star,
    learn: Award
  };

  return (
    <div className="space-y-6">
      {/* Daily Challenges */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyChallenges.map((challenge) => (
            <div key={challenge.id} className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{challenge.title}</h4>
                  <p className="text-gray-400 text-sm">{challenge.description}</p>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {challenge.reward}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{challenge.progress}/{challenge.maxProgress}</span>
                  {challenge.timeLeft && <span>{challenge.timeLeft}</span>}
                </div>
                <Progress 
                  value={(challenge.progress / challenge.maxProgress) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Goal */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            Weekly Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-white">{weeklyGoal.description}</p>
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                {weeklyGoal.reward}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{weeklyGoal.progress}/{weeklyGoal.maxProgress}</span>
                <span>{Math.round((weeklyGoal.progress / weeklyGoal.maxProgress) * 100)}%</span>
              </div>
              <Progress 
                value={(weeklyGoal.progress / weeklyGoal.maxProgress) * 100} 
                className="h-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 6).map((achievement) => {
              const CategoryIcon = categoryIcons[achievement.category];
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.unlocked
                      ? 'bg-gray-700/50 border-gray-600'
                      : 'bg-gray-800/50 border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${categoryColors[achievement.category]}`}>
                      {achievement.unlocked ? (
                        <CategoryIcon className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.title}
                        </h4>
                        {achievement.unlocked && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {achievement.description}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${categoryColors[achievement.category]}`}
                      >
                        +{achievement.points} XP
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamifiedProgress;
