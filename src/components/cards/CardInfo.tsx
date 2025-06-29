
import { DollarSign, Eye, Heart, User } from 'lucide-react';
import CardStats from './CardStats';
import type { Card as CardType } from '@/types/card';

interface CardInfoProps {
  card: CardType;
  showStats?: boolean;
}

const CardInfo = ({ card, showStats = false }: CardInfoProps) => {
  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="p-3 h-1/3 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-white text-sm truncate" title={card.title}>
          {card.title}
        </h3>
        
        {card.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mt-1">
            {card.description}
          </p>
        )}
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between mt-2">
        {/* Stats */}
        {showStats && (card.power !== undefined || card.toughness !== undefined) && (
          <CardStats 
            stats={{
              power: card.power,
              toughness: card.toughness,
              mana_cost: card.mana_cost,
              abilities: card.abilities
            }} 
            compact 
          />
        )}

        {/* Price and Stats with Brighter Colors */}
        <div className="flex items-center gap-2 text-xs">
          {card.current_market_value && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-[#00C851]" />
              <span className="font-semibold text-[#00C851]">
                {formatPrice(card.current_market_value)}
              </span>
            </div>
          )}
          
          {card.view_count !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 font-medium">{card.view_count}</span>
            </div>
          )}
          
          {card.favorite_count !== undefined && card.favorite_count > 0 && (
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400" />
              <span className="text-red-400 font-medium">{card.favorite_count}</span>
            </div>
          )}
        </div>
      </div>

      {/* Creator Info */}
      {card.creator && (
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
          <User className="w-3 h-3" />
          <span>by {card.creator.username}</span>
        </div>
      )}
    </div>
  );
};

export default CardInfo;
