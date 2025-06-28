
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
      'space-y-1 transition-all duration-[3000ms] ease-out',
      showExpanded ? 'transform -translate-y-1' : 'transform translate-y-0'
    )}>
      <h3 
        className={cn(
          'font-bold truncate transition-all duration-[3500ms] ease-out',
          showExpanded ? 'text-shadow-lg delay-[500ms]' : ''
        )} 
        title={card.title}
      >
        {card.title}
      </h3>
      
      <div className="flex items-center justify-between">
        {card.creator && (
          <div className={cn(
            'flex items-center gap-1 opacity-80 transition-all duration-[3000ms] ease-out',
            showExpanded ? 'opacity-90 text-shadow delay-[800ms]' : ''
          )}>
            <User className={cn(
              'w-3 h-3 transition-transform duration-[2500ms] ease-out',
              showExpanded ? 'scale-110 delay-[800ms]' : ''
            )} />
            <span className="text-xs truncate">{card.creator.username}</span>
          </div>
        )}
        
        {card.current_market_value && (
          <div className={cn(
            'flex items-center gap-1 font-semibold text-green-400',
            'transition-all duration-[3000ms] ease-out',
            showExpanded ? 'text-green-300 drop-shadow-lg scale-105 delay-[1200ms]' : ''
          )}>
            <DollarSign className={cn(
              'w-3 h-3 transition-transform duration-[2500ms] ease-out',
              showExpanded ? 'scale-110 rotate-12 delay-[1200ms]' : ''
            )} />
            <span>{formatPrice(card.current_market_value)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardBasicInfo;
