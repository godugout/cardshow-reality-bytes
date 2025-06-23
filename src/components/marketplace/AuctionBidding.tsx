
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useAuctionBids, usePlaceBid, useCurrentHighestBid } from '@/hooks/useAuctions';
import { formatDistanceToNow } from 'date-fns';

interface AuctionBiddingProps {
  listingId: string;
  currentPrice: number;
  auctionEndTime: string;
  reservePrice?: number;
}

const AuctionBidding = ({ 
  listingId, 
  currentPrice, 
  auctionEndTime, 
  reservePrice 
}: AuctionBiddingProps) => {
  const [bidAmount, setBidAmount] = useState('');
  const [proxyMaxBid, setProxyMaxBid] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const { bids, isLoading } = useAuctionBids(listingId);
  const { highestBid } = useCurrentHighestBid(listingId);
  const placeBid = usePlaceBid();

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const endTime = new Date(auctionEndTime);
      const now = new Date();
      
      if (endTime > now) {
        setTimeLeft(formatDistanceToNow(endTime, { addSuffix: true }));
      } else {
        setTimeLeft('Auction ended');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEndTime]);

  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    const proxyMax = proxyMaxBid ? parseFloat(proxyMaxBid) : undefined;

    if (amount <= (highestBid?.amount || currentPrice)) {
      return;
    }

    await placeBid.mutateAsync({
      auctionId: listingId,
      amount,
      proxyMax
    });

    setBidAmount('');
    setProxyMaxBid('');
  };

  const minBidAmount = (highestBid?.amount || currentPrice) + 1;
  const isAuctionActive = new Date(auctionEndTime) > new Date();
  const hasReserve = reservePrice && (highestBid?.amount || currentPrice) < reservePrice;

  return (
    <div className="space-y-6">
      {/* Auction Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00C851]" />
            Auction Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Time remaining:</span>
            <Badge variant={isAuctionActive ? "default" : "destructive"}>
              {timeLeft}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Current bid:</span>
            <span className="text-xl font-bold text-[#00C851]">
              ${highestBid?.amount || currentPrice}
            </span>
          </div>

          {hasReserve && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Reserve:</span>
              <Badge variant="outline">Not met (${reservePrice})</Badge>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Total bids:</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {bids.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Place Bid */}
      {isAuctionActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#00C851]" />
              Place Bid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Bid Amount</label>
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Minimum: $${minBidAmount}`}
                min={minBidAmount}
                step="0.01"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Maximum Proxy Bid (Optional)
              </label>
              <Input
                type="number"
                value={proxyMaxBid}
                onChange={(e) => setProxyMaxBid(e.target.value)}
                placeholder="Auto-bid up to this amount"
                className="bg-gray-900 border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll automatically bid for you up to this amount
              </p>
            </div>

            <Button
              onClick={handlePlaceBid}
              disabled={
                !bidAmount || 
                parseFloat(bidAmount) < minBidAmount ||
                placeBid.isPending
              }
              className="w-full bg-[#00C851] hover:bg-[#00a844]"
            >
              {placeBid.isPending ? 'Placing Bid...' : 'Place Bid'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bid History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00C851]" />
            Bid History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-800 rounded animate-pulse" />
                    <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : bids.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {bids.map((bid, index) => (
                <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={bid.bidder?.avatar_url} />
                      <AvatarFallback>
                        {bid.bidder?.username?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {bid.bidder?.username || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDistanceToNow(new Date(bid.bid_time), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#00C851]">${bid.amount}</p>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Winning
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No bids yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionBidding;
