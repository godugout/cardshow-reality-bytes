
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useWatchListing } from '@/hooks/useMarketplace';
import { useCurrentHighestBid } from '@/hooks/useAuctions';
import CardImage from './card/CardImage';
import CardInfo from './card/CardInfo';
import PriceSection from './card/PriceSection';
import SellerInfo from './card/SellerInfo';
import CardStats from './card/CardStats';
import CardActions from './card/CardActions';
import CardDetailsDialog from './card/CardDetailsDialog';
import type { MarketplaceListing } from '@/types/marketplace';
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
    <>
      <Card className="group bg-gray-900 border-gray-800 hover:border-[#00C851] transition-all duration-300 overflow-hidden">
        <CardImage
          imageUrl={listing.card?.image_url}
          title={listing.card?.title}
          isAuction={isAuction}
          featured={listing.featured}
          isWatching={isWatching}
          onWatchToggle={handleWatchToggle}
        />

        <CardContent className="p-4 space-y-3">
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

          <CardActions
            isAuction={isAuction}
            isAuctionEnded={isAuctionEnded}
            onViewDetails={() => setShowDetails(true)}
          />
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
