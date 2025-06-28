
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, DollarSign, User, Sparkles } from 'lucide-react';
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
    sm: 'w-64 h-80',
    md: 'w-72 h-96',
    lg: 'w-80 h-[28rem]'
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
    <Card 
      variant="premium"
      interactive
      className={cn(
        'trading-card-premium group relative overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Card Image/3D View Container */}
        <div className="relative flex-1 overflow-hidden rounded-t-2xl">
          {/* 3D/2D Toggle */}
          <div className="absolute top-3 left-3 z-10">
            <Card3DToggle
              is3D={is3D}
              onToggle={setIs3D}
            />
          </div>

          {/* Premium Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>

          {/* 2D Image */}
          {!is3D && (
            <div className="relative w-full h-full">
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton rounded-t-2xl" />
              )}
              <img
                src={card.image_url || '/placeholder.svg'}
                alt={card.title}
                className={cn(
                  'w-full h-full object-cover transition-all duration-500 group-hover:scale-110',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          )}

          {/* Premium 3D View */}
          {is3D && (
            <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
              <Card3DViewerPremium
                card={card}
                interactive
                onLoad={() => setView3DLoaded(true)}
                onFlip={() => {
                  console.log('Card flipped:', card.title);
                }}
              />
              
              {!view3DLoaded && (
                <div className="absolute inset-0 skeleton flex items-center justify-center">
                  <div className="text-muted-foreground text-sm animate-pulse">Loading 3D view...</div>
                </div>
              )}
            </div>
          )}
          
          {/* Rarity Badge */}
          {card.rarity && (
            <div className="absolute bottom-3 left-3">
              <RarityBadge rarity={card.rarity} size="sm" animated />
            </div>
          )}

          {/* Serial Number */}
          {card.serial_number && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="text-xs font-mono bg-black/50 text-white border-white/20">
                #{card.serial_number}
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          {user && (
            <Button
              variant="ghost" 
              size="icon"
              className="absolute top-12 right-3 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
              onClick={handleFavoriteToggle}
              disabled={toggleFavorite.isPending}
            >
              <Heart 
                className={cn(
                  'w-4 h-4 transition-all',
                  card.is_favorited ? 'fill-red-500 text-red-500 scale-110' : 'text-white hover:text-red-400'
                )}
              />
            </Button>
          )}
        </div>

        {/* Card Info */}
        <div className="p-4 bg-gradient-to-b from-card/90 to-card backdrop-blur-sm">
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-foreground text-lg truncate" title={card.title}>
                {card.title}
              </h3>
              
              {card.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {card.description}
                </p>
              )}
            </div>

            {/* Stats Row */}
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

            {/* Bottom Row - Price and Engagement */}
            <div className="flex items-center justify-between pt-2 border-t border-border/20">
              <div className="flex items-center gap-3 text-xs">
                {card.current_market_value && (
                  <div className="flex items-center gap-1 font-semibold text-success">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatPrice(card.current_market_value)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground border-t border-border/10">
                <User className="w-3 h-3" />
                <span>by <span className="font-medium text-foreground">{card.creator.username}</span></span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDisplay;
