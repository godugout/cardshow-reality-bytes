
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface CardActionsProps {
  isAuction: boolean;
  isAuctionEnded: boolean;
  onViewDetails: () => void;
}

const CardActions = ({ isAuction, isAuctionEnded, onViewDetails }: CardActionsProps) => {
  return (
    <div className="space-y-2 pt-2">
      <Button 
        variant="outline" 
        className="w-full border-gray-700 hover:border-[#00C851]"
        onClick={onViewDetails}
      >
        View Details
      </Button>

      {!isAuction && !isAuctionEnded && (
        <Button className="w-full bg-[#00C851] hover:bg-[#00a844]">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      )}
    </div>
  );
};

export default CardActions;
