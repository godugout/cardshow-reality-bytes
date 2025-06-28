
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
      'space-y-1 transition-all duration-[2000ms] ease-out',
      showExpanded ? 'transform -translate-y-1' : 'transform translate-y-0'
    )}>
      <h3 
        className={cn(
          'font-bold truncate transition-all duration-[2400ms] ease-out',
          showExpanded ? 'text-shadow-lg' : ''
        )} 
        title={card.title}
      >
        {card.title}
      </h3>
      
      <div className="flex items-center justify-between">
        {card.creator && (
          <div className={cn(
            'flex items-center gap-1 opacity-80 transition-all duration-[2000ms] ease-out',
            showExpanded ? 'opacity-90 text-shadow' : ''
          )}>
            <User className={cn(
              'w-3 h-3 transition-transform duration-[1800ms] ease-out',
              showExpanded ? 'scale-110' : ''
            )} />
            <span className="text-xs truncate">{card.creator.username}</span>
          </div>
        )}
        
        {card.current_market_value && (
          <div className={cn(
            'flex items-center gap-1 font-semibold text-green-400',
            'transition-all duration-[2000ms] ease-out',
            showExpanded ? 'text-green-300 drop-shadow-lg scale-105' : ''
          )}>
            <DollarSign className={cn(
              'w-3 h-3 transition-transform duration-[1800ms] ease-out',
              showExpanded ? 'scale-110 rotate-12' : ''
            )} />
            <span>{formatPrice(card.current_market_value)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardBasicInfo;
