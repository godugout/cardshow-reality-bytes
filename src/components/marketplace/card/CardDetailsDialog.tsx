
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart } from 'lucide-react';
import AuctionBidding from '../AuctionBidding';
import RarityBadge from '@/components/cards/RarityBadge';
import type { MarketplaceListing } from '@/types/marketplace';
import type { CardRarity } from '@/types/card';

interface CardDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketplaceListing;
  isAuction: boolean;
}

const CardDetailsDialog = ({ isOpen, onClose, listing, isAuction }: CardDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
  );
};

export default CardDetailsDialog;
