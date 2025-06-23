
import { Eye, Heart } from 'lucide-react';

interface CardStatsProps {
  views?: number;
  watchersCount?: number;
}

const CardStats = ({ views, watchersCount }: CardStatsProps) => {
  return (
    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800">
      <div className="flex items-center gap-1">
        <Eye className="w-3 h-3" />
        <span>{views || 0} views</span>
      </div>
      <div className="flex items-center gap-1">
        <Heart className="w-3 h-3" />
        <span>{watchersCount || 0} watching</span>
      </div>
    </div>
  );
};

export default CardStats;
