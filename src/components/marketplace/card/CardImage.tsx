
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star, Gavel, ShoppingCart } from 'lucide-react';

interface CardImageProps {
  imageUrl?: string;
  title?: string;
  isAuction: boolean;
  featured?: boolean;
  isWatching: boolean;
  onWatchToggle: () => void;
}

const CardImage = ({ 
  imageUrl, 
  title, 
  isAuction, 
  featured, 
  isWatching, 
  onWatchToggle 
}: CardImageProps) => {
  return (
    <div className="relative">
      <img 
        src={imageUrl || '/placeholder.svg'} 
        alt={title || 'Card'}
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
        onClick={onWatchToggle}
      >
        <Heart className={`w-4 h-4 ${isWatching ? 'fill-red-500 text-red-500' : 'text-white'}`} />
      </Button>

      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-2 right-12">
          <Badge variant="outline" className="bg-yellow-600 border-yellow-500">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}
    </div>
  );
};

export default CardImage;
