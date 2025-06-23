
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Clock, DollarSign, ArrowLeftRight } from 'lucide-react';
import { useTradeOffers } from '@/hooks/useTrading';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import TradingRoom from './TradingRoom';
import type { TradeOffer } from '@/types/trading';

const TradesList = () => {
  const { user } = useAuth();
  const [selectedTrade, setSelectedTrade] = useState<TradeOffer | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const { offers: allOffers } = useTradeOffers();
  const { offers: sentOffers } = useTradeOffers({ 
    initiator_id: user?.id 
  });
  const { offers: receivedOffers } = useTradeOffers({ 
    recipient_id: user?.id 
  });

  const getOffersForTab = () => {
    switch (activeTab) {
      case 'sent': return sentOffers;
      case 'received': return receivedOffers;
      case 'pending': return allOffers.filter(offer => offer.status === 'pending');
      case 'completed': return allOffers.filter(offer => offer.status === 'completed');
      default: return allOffers;
    }
  };

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

  if (selectedTrade) {
    return (
      <TradingRoom 
        trade={selectedTrade} 
        onClose={() => setSelectedTrade(null)} 
      />
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Trades</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ArrowLeftRight className="w-4 h-4" />
            <span>{allOffers.length} total trades</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">All Trades</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getOffersForTab().map((trade) => {
                const isInitiator = user?.id === trade.initiator_id;
                const otherUser = isInitiator ? trade.recipient : trade.initiator;
                const offeredCardsCount = Array.isArray(trade.offered_cards) 
                  ? trade.offered_cards.length 
                  : 0;
                const requestedCardsCount = Array.isArray(trade.requested_cards) 
                  ? trade.requested_cards.length 
                  : 0;

                return (
                  <Card 
                    key={trade.id} 
                    className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => setSelectedTrade(trade)}
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
              })}
            </div>

            {getOffersForTab().length === 0 && (
              <div className="text-center py-12">
                <ArrowLeftRight className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No trades found
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'all' 
                    ? 'You haven\'t made any trades yet.' 
                    : `No ${activeTab} trades to display.`
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradesList;
