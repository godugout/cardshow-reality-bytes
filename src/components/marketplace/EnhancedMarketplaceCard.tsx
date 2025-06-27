import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Clock, Star } from 'lucide-react';
import InteractiveCard from '@/components/ui/InteractiveCard';
import { cn } from '@/lib/utils';
import type { MarketplaceListing } from '@/types/marketplace';
import type { CardRarity } from '@/types/card';
import { formatDistanceToNow } from 'date-fns';

interface EnhancedMarketplaceCardProps {
  listing: MarketplaceListing;
  onView?: () => void;
  onFavorite?: () => void;
  onQuickBuy?: () => void;
}

const EnhancedMarketplaceCard = ({ 
  listing, 
  onView, 
  onFavorite, 
  onQuickBuy 
}: EnhancedMarketplaceCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isQuickBuyLoading, setIsQuickBuyLoading] = useState(false);
  
  const isAuction = listing.listing_type === 'auction';
  const timeLeft = isAuction && listing.auction_end_time 
    ? formatDistanceToNow(new Date(listing.auction_end_time), { addSuffix: true })
    : null;
  const isEndingSoon = timeLeft && timeLeft.includes('hour');

  const handleFavorite = async () => {
    setIsFavorited(!isFavorited);
    onFavorite?.();
  };

  const handleQuickBuy = async () => {
    if (isAuction) return; // Can't quick buy auctions
    
    setIsQuickBuyLoading(true);
    try {
      await onQuickBuy?.();
    } finally {
      setIsQuickBuyLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-500',
      uncommon: 'border-green-500',
      rare: 'border-blue-500',
      epic: 'border-purple-500',
      legendary: 'border-yellow-500',
      mythic: 'border-pink-500'
    };
    return colors[rarity as keyof typeof colors] || 'border-gray-500';
  };

  // Create a Card-compatible object for InteractiveCard with proper type casting
  const cardForInteraction = listing.card ? {
    ...listing.card,
    creator_id: 'marketplace-card', // Default value for marketplace cards
    title: listing.card.title,
    rarity: (listing.card.rarity as CardRarity) || 'common' // Cast to proper rarity type
  } : undefined;

  return (
    <InteractiveCard
      card={cardForInteraction}
      size="md"
      onCardTap={onView}
      onCardDoubleTap={isAuction ? undefined : handleQuickBuy}
      onCardLongPress={handleFavorite}
      showRarityGlow={true}
      className={cn(
        'group relative overflow-hidden',
        listing.card?.rarity && getRarityColor(listing.card.rarity),
        'border-2 transition-all duration-300'
      )}
    >
      <Card className="w-full h-full bg-transparent border-none">
        {/* Card Image */}
        <div className="relative w-full h-3/5 overflow-hidden">
          <img
            src={listing.card?.image_url || '/placeholder.svg'}
            alt={listing.card?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {listing.featured && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                Featured
              </Badge>
            )}
            {isAuction && (
              <Badge 
                variant={isEndingSoon ? "destructive" : "default"} 
                className="text-xs animate-pulse"
              >
                <Clock className="w-3 h-3 mr-1" />
                {isEndingSoon ? 'Ending Soon' : 'Auction'}
              </Badge>
            )}
          </div>
          
          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
            className={cn(
              'absolute top-2 right-2 p-2 rounded-full transition-all duration-200',
              'bg-black/50 hover:bg-black/70 backdrop-blur-sm',
              isFavorited && 'bg-red-500/80 hover:bg-red-500'
            )}
          >
            <Heart 
              className={cn(
                'w-4 h-4 transition-colors',
                isFavorited ? 'text-white fill-current' : 'text-white'
              )} 
            />
          </button>
          
          {/* View count */}
          <div className="absolute bottom-2 right-2 flex items-center bg-black/50 px-2 py-1 rounded text-white text-xs backdrop-blur-sm">
            <Eye className="w-3 h-3 mr-1" />
            {listing.views || 0}
          </div>
        </div>

        <CardContent className="p-3 h-2/5 flex flex-col justify-between">
          {/* Card info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                {listing.card?.title}
              </h3>
              {listing.card?.rarity && (
                <Badge variant="outline" className="text-xs ml-2 shrink-0">
                  {listing.card.rarity}
                </Badge>
              )}
            </div>
            
            {/* Condition */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Condition:</span>
              <span className="font-medium">{listing.condition}</span>
            </div>
          </div>
          
          {/* Price and seller info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-muted-foreground">
                  {listing.seller_profiles?.rating || 4.5}
                </span>
              </div>
              
              {timeLeft && (
                <span className="text-xs text-muted-foreground">
                  {timeLeft}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-primary">
                  ${listing.price.toLocaleString()}
                </div>
                {isAuction && (
                  <div className="text-xs text-muted-foreground">
                    Current bid
                  </div>
                )}
              </div>
              
              {!isAuction && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickBuy();
                  }}
                  disabled={isQuickBuyLoading}
                  className="text-xs px-3"
                >
                  {isQuickBuyLoading ? 'Adding...' : 'Quick Buy'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Hover overlay for enhanced interaction feedback */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </InteractiveCard>
  );
};

export default EnhancedMarketplaceCard;
