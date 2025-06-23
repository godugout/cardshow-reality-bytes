
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import type { TradeOffer } from '@/types/trading';

interface TradeDetailsProps {
  trade: TradeOffer;
  otherUser: any;
  getStatusColor: (status: string) => string;
  formatCurrency: (amount: number) => string;
}

const TradeDetails = ({ trade, otherUser, getStatusColor, formatCurrency }: TradeDetailsProps) => {
  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Trade Status</CardTitle>
            <Badge className={`text-white ${getStatusColor(trade.status)}`}>
              {trade.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{formatDistanceToNow(new Date(trade.created_at))} ago</span>
            </div>
            <div className="flex justify-between">
              <span>Expires:</span>
              <span>{formatDistanceToNow(new Date(trade.expires_at))} left</span>
            </div>
            {trade.cash_included && trade.cash_included > 0 && (
              <div className="flex justify-between">
                <span>Cash Included:</span>
                <span>{formatCurrency(trade.cash_included)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Trading With</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser?.avatar_url || undefined} />
              <AvatarFallback>
                {otherUser?.username?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{otherUser?.username || 'Unknown User'}</p>
              <p className="text-sm text-gray-400">online</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeDetails;
