
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Sparkles } from 'lucide-react';

interface Activity {
  id: string;
  type: 'creation' | 'sale' | 'signup' | 'achievement';
  user: string;
  action: string;
  value?: string;
  timeAgo: string;
}

const activities: Activity[] = [
  { id: '1', type: 'creation', user: 'Alex', action: 'created a Legendary card', timeAgo: '2m ago' },
  { id: '2', type: 'sale', user: 'Sarah', action: 'earned', value: '$127', timeAgo: '5m ago' },
  { id: '3', type: 'signup', user: 'Mike', action: 'joined as a creator', timeAgo: '8m ago' },
  { id: '4', type: 'achievement', user: 'Emma', action: 'reached 1K followers', timeAgo: '12m ago' },
  { id: '5', type: 'sale', user: 'David', action: 'sold a card for', value: '$89', timeAgo: '15m ago' },
  { id: '6', type: 'creation', user: 'Lisa', action: 'launched new collection', timeAgo: '18m ago' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'creation': return <Sparkles className="w-4 h-4" />;
    case 'sale': return <DollarSign className="w-4 h-4" />;
    case 'signup': return <Users className="w-4 h-4" />;
    case 'achievement': return <TrendingUp className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'creation': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'sale': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'signup': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'achievement': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const SocialProofTicker = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentActivity];

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Badge
          variant="outline"
          className={`${getColor(activity.type)} p-3 shadow-lg backdrop-blur-sm border animate-pulse`}
        >
          <div className="flex items-center space-x-2">
            {getIcon(activity.type)}
            <div className="text-sm">
              <span className="font-semibold">{activity.user}</span>{' '}
              {activity.action}{' '}
              {activity.value && <span className="font-bold text-green-400">{activity.value}</span>}
              <div className="text-xs opacity-70">{activity.timeAgo}</div>
            </div>
          </div>
        </Badge>
      </div>
    </div>
  );
};

export default SocialProofTicker;
