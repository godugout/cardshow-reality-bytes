
import { Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CardEngagementStatsProps } from './types/cardInfoDrawer';

const CardEngagementStats = ({ 
  card, 
  showExpanded, 
  onFavoriteToggle, 
  toggleFavorite 
}: CardEngagementStatsProps) => {
  return (
    <div className={cn(
      'flex items-center justify-between text-xs opacity-70',
      'transition-all duration-[12000ms] ease-out',
      showExpanded 
        // 15 second delay before engagement stats appear - ultimate luxury timing
        ? 'opacity-80 transform translate-y-0 delay-[15000ms]' 
        : 'opacity-0 transform translate-y-5'
    )}>
      <div className="flex items-center gap-3">
        {card.view_count !== undefined && (
          <div className={cn(
            'flex items-center gap-1 transition-all duration-[6000ms] ease-out',
            showExpanded ? 'hover:text-blue-300 hover:scale-105 delay-[15000ms]' : ''
          )}>
            <Eye className={cn(
              'w-3 h-3 transition-transform duration-[5000ms] ease-out',
              showExpanded ? 'hover:scale-125 delay-[15000ms]' : ''
            )} />
            <span>{card.view_count}</span>
          </div>
        )}
        
        {card.favorite_count !== undefined && card.favorite_count > 0 && (
          <div className={cn(
            'flex items-center gap-1 transition-all duration-[6000ms] ease-out',
            showExpanded ? 'hover:text-red-300 hover:scale-105 delay-[16000ms]' : ''
          )}>
            <Heart className={cn(
              'w-3 h-3 transition-transform duration-[5000ms] ease-out',
              showExpanded ? 'hover:scale-125 delay-[16000ms]' : ''
            )} />
            <span>{card.favorite_count}</span>
          </div>
        )}
      </div>

      {/* Action Button with ultra-premium slow hover effects */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onFavoriteToggle}
        className={cn(
          'p-1 h-auto transition-all duration-[8000ms] ease-out',
          'hover:bg-white/20 hover:backdrop-blur-md hover:scale-110',
          showExpanded ? 'opacity-100 delay-[18000ms]' : 'opacity-0'
        )}
      >
        <Heart 
          className={cn(
            'w-4 h-4 transition-all duration-[6000ms] ease-out',
            'hover:scale-125 hover:rotate-12',
            card.is_favorited 
              ? 'fill-red-500 text-red-500 hover:fill-red-400 hover:text-red-400' 
              : 'hover:text-red-400'
          )}
        />
      </Button>
    </div>
  );
};

export default CardEngagementStats;
