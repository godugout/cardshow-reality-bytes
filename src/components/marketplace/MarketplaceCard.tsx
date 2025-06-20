
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Eye, MapPin, Clock, Star } from 'lucide-react';
import { useWatchListing } from '@/hooks/useMarketplace';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { MarketplaceListing } from '@/types/marketplace';

interface MarketplaceCardProps {
  listing: MarketplaceListing;
}

const MarketplaceCard = ({ listing }: MarketplaceCardProps) => {
  const { user } = useAuth();
  const { mutate: toggleWatch } = useWatchListing();
  const [isWatching, setIsWatching] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatCondition = (condition: string) => {
    return condition.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'mint': return 'bg-green-500';
      case 'near_mint': return 'bg-blue-500';
      case 'excellent': return 'bg-yellow-500';
      case 'good': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleWatchToggle = () => {
    if (!user) return;
    toggleWatch({ listingId: listing.id, isWatching });
    setIsWatching(!isWatching);
  };

  const timeRemaining = listing.auction_end_time ? 
    new Date(listing.auction_end_time).getTime() - Date.now() : null;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-900 border-gray-800">
      <CardContent className="p-0">
        {/* Card Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={listing.card?.image_url || '/placeholder.svg'}
            alt={listing.card?.title || 'Card'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Condition Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={cn('text-white font-semibold', getConditionColor(listing.condition))}>
              {formatCondition(listing.condition)}
            </Badge>
          </div>

          {/* Listing Type Badge */}
          {listing.listing_type === 'auction' && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                AUCTION
              </Badge>
            </div>
          )}

          {/* Watch Button */}
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              onClick={handleWatchToggle}
            >
              <Heart 
                className={cn(
                  'w-4 h-4',
                  isWatching ? 'fill-red-500 text-red-500' : 'text-white'
                )}
              />
            </Button>
          )}
        </div>

        {/* Card Info */}
        <div className="p-4 space-y-3">
          {/* Title and Price */}
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm line-clamp-1">
              {listing.card?.title || 'Untitled Card'}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#00C851]">
                {formatPrice(listing.price)}
              </span>
              {listing.shipping_cost && listing.shipping_cost > 0 && (
                <span className="text-xs text-gray-400">
                  +{formatPrice(listing.shipping_cost)} shipping
                </span>
              )}
            </div>
          </div>

          {/* Auction Timer */}
          {listing.listing_type === 'auction' && timeRemaining && timeRemaining > 0 && (
            <div className="text-xs text-orange-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.floor(timeRemaining / (1000 * 60 * 60 * 24))}d {Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h left
            </div>
          )}

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={listing.profiles?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {listing.profiles?.username?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-400">
                {listing.profiles?.username || 'Unknown User'}
              </span>
              {listing.seller_profiles?.rating && listing.seller_profiles.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-400">
                    {listing.seller_profiles.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            
            {listing.seller_profiles?.verification_status === 'verified' && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
          </div>

          {/* Location and Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {listing.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{listing.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{listing.views}</span>
              </div>
            </div>
            
            <span>
              {listing.quantity > 1 ? `${listing.quantity} available` : '1 available'}
            </span>
          </div>

          {/* Buy Button */}
          <Button 
            className="w-full bg-[#00C851] hover:bg-[#00a844] text-white font-semibold"
            size="sm"
          >
            {listing.listing_type === 'auction' ? 'Place Bid' : 'Buy Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceCard;
