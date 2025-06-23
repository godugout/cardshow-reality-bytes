
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface SellerInfoProps {
  username?: string;
  avatarUrl?: string;
  rating?: number;
}

const SellerInfo = ({ username, avatarUrl, rating }: SellerInfoProps) => {
  return (
    <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
      <Avatar className="w-6 h-6">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-xs">
          {username?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-gray-400 flex-1">
        {username || 'Unknown'}
      </span>
      
      {rating !== undefined && (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500" />
          <span className="text-xs text-gray-400">
            {rating.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default SellerInfo;
