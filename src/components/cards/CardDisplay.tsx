
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, DollarSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCardFavorites } from '@/hooks/useCards';
import RarityBadge from './RarityBadge';
import CardStats from './CardStats';
import Card3DViewerPremium from './Card3DViewerPremium';
import Card3DToggle from './Card3DToggle';
import type { Card as CardType } from '@/types/card';

interface CardDisplayProps {
  card: CardType;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  className?: string;
}

const CardDisplay = ({ card, size = 'md', showStats = false, className }: CardDisplayProps) => {
  const { user } = useAuth();
  const { toggleFavorite } = useCardFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [view3DLoaded, setView3DLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-48 h-64',
    md: 'w-64 h-80',
    lg: 'w-80 h-96'
  };

  const handleFavoriteToggle = () => {
    if (!user) return;
    toggleFavorite.mutate({
      cardId: card.id,
      isFavorited: card.is_favorited || false
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-900 border-gray-800',
      sizeClasses[size],
      className
    )}>
      <CardContent className="p-0 h-full">
        {/* Card Image/3D View */}
        <div className="relative h-2/3 overflow-hidden">
          {/* 3D/2D Toggle */}
          <div className="absolute top-2 left-2 z-10">
            <Card3DToggle
              is3D={is3D}
              onToggle={setIs3D}
            />
          </div>

          {/* 2D Image */}
          {!is3D && (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
              )}
              <img
                src={card.image_url || '/placeholder.svg'}
                alt={card.title}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          )}

          {/* Premium 3D View */}
          {is3D && (
            <div className="w-full h-full">
              <Card3DViewerPremium
                card={card}
                interactive
                onLoad={() => setView3DLoaded(true)}
                onFlip={() => {
                  // Add flip sound effect here if enabled
                  console.log('Card flipped:', card.title);
                }}
              />
              
              {!view3DLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Loading premium 3D...</div>
                </div>
              )}
            </div>
          )}
          
          {/* Rarity Badge */}
          {card.rarity && (
            <div className="absolute top-2 right-2">
              <RarityBadge rarity={card.rarity} size="sm" animated />
            </div>
          )}

          {/* Serial Number */}
          {card.serial_number && (
            <div className="absolute top-12 right-2">
              <Badge variant="secondary" className="text-xs font-mono">
                #{card.serial_number}
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              onClick={handleFavoriteToggle}
              disabled={toggleFavorite.isPending}
            >
              <Heart 
                className={cn(
                  'w-4 h-4',
                  card.is_favorited ? 'fill-red-500 text-red-500' : 'text-white'
                )}
              />
            </Button>
          )}
        </div>

        {/* Card Info */}
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

            {/* Price and Stats */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {card.current_market_value && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span className="font-semibold text-[#00C851]">
                    {formatPrice(card.current_market_value)}
                  </span>
                </div>
              )}
              
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
          </div>

          {/* Creator Info */}
          {card.creator && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <User className="w-3 h-3" />
              <span>by {card.creator.username}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDisplay;
