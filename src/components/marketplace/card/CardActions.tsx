
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface CardActionsProps {
  isAuction: boolean;
  isAuctionEnded: boolean;
  onViewDetails: () => void;
}

const CardActions = ({ isAuction, isAuctionEnded, onViewDetails }: CardActionsProps) => {
  return (
    <div className="space-y-3 pt-3">
      <Button 
        variant="outline" 
        className="w-full rounded-3xl border-0 bg-background/50 backdrop-blur-sm hover:bg-primary/10"
        onClick={onViewDetails}
      >
        View Details
      </Button>

      {!isAuction && !isAuctionEnded && (
        <Button className="w-full rounded-3xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      )}
    </div>
  );
};

export default CardActions;
