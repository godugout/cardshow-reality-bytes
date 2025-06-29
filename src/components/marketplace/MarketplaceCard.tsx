
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ContextualButton } from '@/components/ui/contextual-button';
import { useWatchListing } from '@/hooks/useMarketplace';
import { useCurrentHighestBid } from '@/hooks/useAuctions';
import CardImage from './card/CardImage';
import CardInfo from './card/CardInfo';
import PriceSection from './card/PriceSection';
import SellerInfo from './card/SellerInfo';
import CardStats from './card/CardStats';
import CardDetailsDialog from './card/CardDetailsDialog';
import type { MarketplaceListing } from '@/types/marketplace';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Heart } from 'lucide-react';

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
    <>
      <Card className="group bg-card border-border hover:border-marketplace/50 transition-all duration-300 overflow-hidden shadow-card hover:shadow-hover rounded-3xl">
        <CardImage
          imageUrl={listing.card?.image_url}
          title={listing.card?.title}
          isAuction={isAuction}
          featured={listing.featured}
          isWatching={isWatching}
          onWatchToggle={handleWatchToggle}
        />

        <CardContent className="p-6 space-y-4">
          <CardInfo
            title={listing.card?.title}
            rarity={listing.card?.rarity}
            condition={listing.condition}
          />

          <PriceSection
            isAuction={isAuction}
            currentPrice={currentPrice}
            timeLeft={timeLeft}
            isAuctionEnded={isAuctionEnded}
            reservePrice={listing.reserve_price}
          />

          <SellerInfo
            username={listing.profiles?.username}
            avatarUrl={listing.profiles?.avatar_url}
            rating={listing.seller_profiles?.rating}
          />

          <CardStats
            views={listing.views}
            watchersCount={listing.watchers_count}
          />

          <div className="flex gap-2 pt-2">
            <ContextualButton
              context="marketplace"
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="flex-1 rounded-2xl"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </ContextualButton>
            <ContextualButton
              context="marketplace"
              variant="secondary"
              size="sm"
              onClick={handleWatchToggle}
              className="rounded-2xl"
            >
              <Heart className={`w-4 h-4 ${isWatching ? 'fill-current text-marketplace' : ''}`} />
            </ContextualButton>
          </div>
        </CardContent>
      </Card>

      <CardDetailsDialog
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        listing={listing}
        isAuction={isAuction}
      />
    </>
  );
};

export default MarketplaceCard;
