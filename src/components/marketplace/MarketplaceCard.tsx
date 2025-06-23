
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Eye, Clock, Gavel, ShoppingCart, Star } from 'lucide-react';
import { useWatchListing } from '@/hooks/useMarketplace';
import { useCurrentHighestBid } from '@/hooks/useAuctions';
import AuctionBidding from './AuctionBidding';
import RarityBadge from '@/components/cards/RarityBadge';
import type { MarketplaceListing } from '@/types/marketplace';
import type { CardRarity } from '@/types/card';
import { formatDistanceToNow } from 'date-fns';

interface MarketplaceCardProps {
  listing: MarketplaceListing;
}

const MarketplaceCard = ({ listing }: MarketplaceCardProps) => {
  const [isWatching, setIsWatching] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const watchListing = useWatchListing();
  const { highestBid } = useCurrentHighestBid(listing.id);

  const handleWatchToggle = async () => {
    await watchListing.mutateAsync({ 
      listingId: listing.id, 
      isWatching 
    });
    setIsWatching(!isWatching);
  };

  const isAuction = listing.listing_type === 'auction';
  const currentPrice = isAuction ? (highestBid?.amount || listing.price) : listing.price;
  const timeLeft = isAuction && listing.auction_end_time 
    ? formatDistanceToNow(new Date(listing.auction_end_time), { addSuffix: true })
    : null;
  const isAuctionEnded = isAuction && listing.auction_end_time 
    ? new Date(listing.auction_end_time) < new Date()
    : false;

  return (
    <Card className="group bg-gray-900 border-gray-800 hover:border-[#00C851] transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={listing.card?.image_url || '/placeholder.svg'} 
          alt={listing.card?.title || 'Card'}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Listing Type Badge */}
        <div className="absolute top-2 left-2">
          {isAuction ? (
            <Badge className="bg-orange-600 hover:bg-orange-700">
              <Gavel className="w-3 h-3 mr-1" />
              Auction
            </Badge>
          ) : (
            <Badge className="bg-[#00C851] hover:bg-[#00a844]">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Buy Now
            </Badge>
          )}
        </div>

        {/* Watch Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70"
          onClick={handleWatchToggle}
        >
          <Heart className={`w-4 h-4 ${isWatching ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </Button>

        {/* Featured Badge */}
        {listing.featured && (
          <div className="absolute top-2 right-12">
            <Badge variant="outline" className="bg-yellow-600 border-yellow-500">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Card Info */}
        <div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {listing.card?.title || 'Unknown Card'}
          </h3>
          
          <div className="flex items-center justify-between">
            {listing.card?.rarity && <RarityBadge rarity={listing.card.rarity as CardRarity} />}
            <Badge variant="outline" className="text-xs">
              {listing.condition}
            </Badge>
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {isAuction ? 'Current Bid' : 'Price'}
            </span>
            <span className="text-xl font-bold text-[#00C851]">
              ${currentPrice}
            </span>
          </div>

          {/* Auction Time Left */}
          {isAuction && timeLeft && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className={isAuctionEnded ? 'text-red-500' : 'text-orange-500'}>
                {isAuctionEnded ? 'Auction Ended' : timeLeft}
              </span>
            </div>
          )}

          {/* Reserve Price */}
          {isAuction && listing.reserve_price && currentPrice < listing.reserve_price && (
            <p className="text-xs text-yellow-500">
              Reserve not met (${listing.reserve_price})
            </p>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
          <Avatar className="w-6 h-6">
            <AvatarImage src={listing.profiles?.avatar_url} />
            <AvatarFallback className="text-xs">
              {listing.profiles?.username?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-400 flex-1">
            {listing.profiles?.username || 'Unknown'}
          </span>
          
          {listing.seller_profiles && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-gray-400">
                {listing.seller_profiles.rating?.toFixed(1) || 'New'}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{listing.views || 0} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{listing.watchers_count || 0} watching</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-gray-700 hover:border-[#00C851]"
              >
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-[#00C851]">
                  {listing.card?.title || 'Card Details'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Image and Details */}
                <div className="space-y-4">
                  <img 
                    src={listing.card?.image_url || '/placeholder.svg'} 
                    alt={listing.card?.title || 'Card'}
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{listing.card?.title}</h3>
                    <div className="flex gap-2">
                      {listing.card?.rarity && <RarityBadge rarity={listing.card.rarity as CardRarity} />}
                      <Badge variant="outline">{listing.condition}</Badge>
                    </div>
                    
                    {listing.description && (
                      <p className="text-gray-400 text-sm">{listing.description}</p>
                    )}
                  </div>
                </div>

                {/* Bidding/Purchase Section */}
                <div>
                  {isAuction ? (
                    <AuctionBidding
                      listingId={listing.id}
                      currentPrice={listing.price}
                      auctionEndTime={listing.auction_end_time!}
                      reservePrice={listing.reserve_price || undefined}
                    />
                  ) : (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5 text-[#00C851]" />
                          Purchase
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-[#00C851]">
                            ${listing.price}
                          </p>
                          {listing.shipping_cost && (
                            <p className="text-sm text-gray-400">
                              + ${listing.shipping_cost} shipping
                            </p>
                          )}
                        </div>
                        
                        <Button className="w-full bg-[#00C851] hover:bg-[#00a844]">
                          Buy Now
                        </Button>
                        
                        <Button variant="outline" className="w-full">
                          Make Offer
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {!isAuction && !isAuctionEnded && (
            <Button className="w-full bg-[#00C851] hover:bg-[#00a844]">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceCard;
