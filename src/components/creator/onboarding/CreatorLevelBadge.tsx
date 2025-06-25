
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Seedling, 
  Sprout, 
  Palette, 
  Crown, 
  Sparkles 
} from 'lucide-react';

interface CreatorLevel {
  id: string;
  name: string;
  icon: any;
  color: string;
  minPoints: number;
  description: string;
}

const levels: CreatorLevel[] = [
  {
    id: 'novice',
    name: 'Novice',
    icon: Seedling,
    color: 'bg-green-500',
    minPoints: 0,
    description: 'Just starting your creative journey'
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    icon: Sprout,
    color: 'bg-blue-500',
    minPoints: 100,
    description: 'Learning the fundamentals'
  },
  {
    id: 'artist',
    name: 'Artist',
    icon: Palette,
    color: 'bg-purple-500',
    minPoints: 500,
    description: 'Developing your unique style'
  },
  {
    id: 'master',
    name: 'Master',
    icon: Crown,
    color: 'bg-yellow-500',
    minPoints: 1500,
    description: 'Mastering advanced techniques'
  },
  {
    id: 'legend',
    name: 'Legend',
    icon: Sparkles,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    minPoints: 5000,
    description: 'Elite creator status'
  }
];

interface CreatorLevelBadgeProps {
  currentPoints: number;
  className?: string;
  showProgress?: boolean;
}

export const CreatorLevelBadge = ({ 
  currentPoints, 
  className = '',
  showProgress = false 
}: CreatorLevelBadgeProps) => {
  const getCurrentLevel = () => {
    return levels.reduceRight((acc, level) => {
      return currentPoints >= level.minPoints ? level : acc;
    }, levels[0]);
  };

  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const Icon = currentLevel.icon;

  const progressToNext = nextLevel 
    ? ((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${currentLevel.color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <Badge 
            variant="outline" 
            className={`${currentLevel.color} text-white border-transparent`}
          >
            {currentLevel.name}
          </Badge>
          <p className="text-xs text-gray-400 mt-1">
            {currentLevel.description}
          </p>
        </div>
      </div>
      
      {showProgress && nextLevel && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{currentPoints} XP</span>
            <span>Next: {nextLevel.name} ({nextLevel.minPoints} XP)</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
          <p className="text-xs text-gray-500">
            {nextLevel.minPoints - currentPoints} XP to next level
          </p>
        </div>
      )}
    </div>
  );
};

export { levels };
