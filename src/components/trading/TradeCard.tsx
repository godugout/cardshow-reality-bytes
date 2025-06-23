
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Clock, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { TradeOffer } from '@/types/trading';

interface TradeCardProps {
  trade: TradeOffer;
  isInitiator: boolean;
  onSelect: (trade: TradeOffer) => void;
}

const TradeCard = ({ trade, isInitiator, onSelect }: TradeCardProps) => {
  const otherUser = isInitiator ? trade.recipient : trade.initiator;
  const offeredCardsCount = Array.isArray(trade.offered_cards) 
    ? trade.offered_cards.length 
    : 0;
  const requestedCardsCount = Array.isArray(trade.requested_cards) 
    ? trade.requested_cards.length 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
      onClick={() => onSelect(trade)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {isInitiator ? 'Sent to' : 'Received from'}
          </CardTitle>
          <Badge className={`text-white ${getStatusColor(trade.status)}`}>
            {trade.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trading Partner */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUser?.avatar_url || undefined} />
            <AvatarFallback>
              {otherUser?.username?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{otherUser?.username || 'Unknown User'}</p>
            <p className="text-sm text-gray-400">Trade Partner</p>
          </div>
        </div>

        {/* Trade Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Cards Offered:</span>
            <span>{offeredCardsCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cards Requested:</span>
            <span>{requestedCardsCount}</span>
          </div>
          {trade.cash_included && trade.cash_included > 0 && (
            <div className="flex justify-between text-sm">
              <span>Cash Included:</span>
              <span className="text-green-400">
                {formatCurrency(trade.cash_included)}
              </span>
            </div>
          )}
        </div>

        {/* Timing */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(trade.created_at))} ago
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </div>
        </div>

        {/* Trade Note Preview */}
        {trade.trade_note && (
          <div className="bg-gray-700 p-2 rounded text-sm">
            <p className="truncate">{trade.trade_note}</p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full"
          variant={trade.status === 'pending' ? 'default' : 'outline'}
        >
          {trade.status === 'pending' 
            ? (isInitiator ? 'View Trade' : 'Respond to Trade')
            : 'View Details'
          }
        </Button>
      </CardContent>
    </Card>
  );
};

export default TradeCard;
