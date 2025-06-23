
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface PriceSectionProps {
  isAuction: boolean;
  currentPrice: number;
  timeLeft?: string | null;
  isAuctionEnded: boolean;
  reservePrice?: number;
}

const PriceSection = ({ 
  isAuction, 
  currentPrice, 
  timeLeft, 
  isAuctionEnded, 
  reservePrice 
}: PriceSectionProps) => {
  return (
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
      {isAuction && reservePrice && currentPrice < reservePrice && (
        <p className="text-xs text-yellow-500">
          Reserve not met (${reservePrice})
        </p>
      )}
    </div>
  );
};

export default PriceSection;
