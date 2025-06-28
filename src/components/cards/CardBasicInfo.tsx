
import { User, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardBasicInfoProps } from './types/cardInfoDrawer';

const CardBasicInfo = ({ card, showExpanded, size }: CardBasicInfoProps) => {
  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className={cn(
      'space-y-1 transition-all duration-[8000ms] ease-out',
      showExpanded ? 'transform -translate-y-1' : 'transform translate-y-0'
    )}>
      <h3 
        className={cn(
          'font-bold truncate transition-all duration-[9000ms] ease-out',
          // 3 second delay before title enhancement begins
          showExpanded ? 'text-shadow-lg delay-[3000ms]' : ''
        )} 
        title={card.title}
      >
        {card.title}
      </h3>
      
      <div className="flex items-center justify-between">
        {card.creator && (
          <div className={cn(
            'flex items-center gap-1 opacity-80 transition-all duration-[8000ms] ease-out',
            // 4 second delay before creator info enhancement
            showExpanded ? 'opacity-90 text-shadow delay-[4000ms]' : ''
          )}>
            <User className={cn(
              'w-3 h-3 transition-transform duration-[6000ms] ease-out',
              // 4 second delay before icon animation
              showExpanded ? 'scale-110 delay-[4000ms]' : ''
            )} />
            <span className="text-xs truncate">{card.creator.username}</span>
          </div>
        )}
        
        {card.current_market_value && (
          <div className={cn(
            'flex items-center gap-1 font-semibold text-green-400',
            'transition-all duration-[8000ms] ease-out',
            // 5 second delay before price enhancement  
            showExpanded ? 'text-green-300 drop-shadow-lg scale-105 delay-[5000ms]' : ''
          )}>
            <DollarSign className={cn(
              'w-3 h-3 transition-transform duration-[6000ms] ease-out',
              // 5 second delay + rotation effect
              showExpanded ? 'scale-110 rotate-12 delay-[5000ms]' : ''
            )} />
            <span>{formatPrice(card.current_market_value)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardBasicInfo;
