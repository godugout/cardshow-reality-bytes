
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface SellerInfoProps {
  username?: string;
  avatarUrl?: string;
  rating?: number;
}

const SellerInfo = ({ username, avatarUrl, rating }: SellerInfoProps) => {
  return (
    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
      <Avatar className="w-8 h-8 border-2 border-primary/20">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-xs bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-bold">
          {username?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-muted-foreground flex-1 font-medium">
        {username || 'Unknown'}
      </span>
      
      {rating !== undefined && (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs text-muted-foreground font-medium">
            {rating.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default SellerInfo;
