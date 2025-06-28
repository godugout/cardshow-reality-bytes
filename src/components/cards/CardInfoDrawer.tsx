
import { Heart, Eye, DollarSign, User, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCardFavorites } from '@/hooks/useCards';
import RarityBadge from './RarityBadge';
import CardStats from './CardStats';
import type { Card } from '@/types/card';

interface CardInfoDrawerProps {
  card: Card;
  isHovered: boolean;
  isPinned: boolean;
  animationPhase: 'idle' | 'lifting' | 'expanding';
  drawerStyle: string;
  size: 'sm' | 'md' | 'lg';
}

const CardInfoDrawer = ({ 
  card, 
  isHovered, 
  isPinned, 
  animationPhase, 
  drawerStyle,
  size 
}: CardInfoDrawerProps) => {
  const { toggleFavorite } = useCardFavorites();
  const showDrawer = isHovered || isPinned;

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleFavoriteToggle = () => {
    toggleFavorite.mutate({
      cardId: card.id,
      isFavorited: card.is_favorited || false
    });
  };

  // Size-specific spacing
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const drawerStyles = {
    default: 'bg-black/90 backdrop-blur-xl text-white',
    holographic: 'bg-gradient-to-b from-purple-900/90 to-pink-900/90 backdrop-blur-xl text-white',
    cyberpunk: 'bg-black/95 backdrop-blur-xl text-cyan-400 border-t border-cyan-500/50',
    minimalist: 'bg-white/95 backdrop-blur-xl text-gray-900 border-t border-gray-200',
    brutalist: 'bg-red-900/90 backdrop-blur-xl text-white border-t-4 border-red-500',
    vaporwave: 'bg-gradient-to-b from-pink-900/90 to-purple-900/90 backdrop-blur-xl text-pink-200'
  };

  return (
    <>
      {/* Basic Info - Always Visible */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 z-20 transition-transform duration-200 ease-out rounded-b-3xl',
        sizeClasses[size],
        drawerStyles[drawerStyle as keyof typeof drawerStyles] || drawerStyles.default,
        animationPhase === 'lifting' && '-translate-y-16',
        animationPhase === 'expanding' && '-translate-y-32'
      )}>
        <div className="space-y-1">
          <h3 className="font-bold truncate" title={card.title}>
            {card.title}
          </h3>
          
          <div className="flex items-center justify-between">
            {card.creator && (
              <div className="flex items-center gap-1 opacity-80">
                <User className="w-3 h-3" />
                <span className="text-xs truncate">{card.creator.username}</span>
              </div>
            )}
            
            {card.current_market_value && (
              <div className="flex items-center gap-1 font-semibold text-green-400">
                <DollarSign className="w-3 h-3" />
                <span>{formatPrice(card.current_market_value)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Drawer - On Hover/Pin */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 z-10 transform transition-all duration-300 ease-out rounded-b-3xl',
        sizeClasses[size],
        drawerStyles[drawerStyle as keyof typeof drawerStyles] || drawerStyles.default,
        showDrawer && animationPhase === 'expanding' 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      )}>
        <div className="pt-12 space-y-3">
          {/* Description */}
          {card.description && (
            <p className="text-xs opacity-80 line-clamp-2">
              {card.description}
            </p>
          )}

          {/* Rarity and Serial */}
          <div className="flex items-center justify-between">
            {card.rarity && <RarityBadge rarity={card.rarity} size="sm" />}
            {card.serial_number && (
              <Badge variant="outline" className="text-xs">
                #{card.serial_number}
              </Badge>
            )}
          </div>

          {/* Stats */}
          {(card.power !== undefined || card.toughness !== undefined) && (
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

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-xs opacity-70">
            <div className="flex items-center gap-3">
              {card.view_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{card.view_count}</span>
                </div>
              )}
              
              {card.favorite_count !== undefined && card.favorite_count > 0 && (
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{card.favorite_count}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className="p-1 h-auto"
            >
              <Heart 
                className={cn(
                  'w-4 h-4',
                  card.is_favorited ? 'fill-red-500 text-red-500' : ''
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardInfoDrawer;
