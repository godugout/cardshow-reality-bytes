
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTradeOffers } from '@/hooks/useTrading';
import { useAuth } from '@/hooks/useAuth';
import TradingRoom from './TradingRoom';
import TradeCard from './TradeCard';
import TradesHeader from './TradesHeader';
import TradesEmptyState from './TradesEmptyState';
import type { TradeOffer } from '@/types/trading';

const TradesList = () => {
  const { user, loading } = useAuth();
  const [selectedTrade, setSelectedTrade] = useState<TradeOffer | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
              <p className="text-gray-400 mb-6">
                You need to be signed in to view and manage your trades.
              </p>
              <Link to="/auth">
                <Button className="bg-[#00C851] hover:bg-[#00A543] text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only call hooks when user is authenticated
  const { offers: allOffers } = useTradeOffers();
  const { offers: sentOffers } = useTradeOffers({ 
    initiator_id: user.id 
  });
  const { offers: receivedOffers } = useTradeOffers({ 
    recipient_id: user.id 
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
        <TradesHeader totalTrades={allOffers.length} />

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
                const isInitiator = user.id === trade.initiator_id;
                return (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    isInitiator={isInitiator}
                    onSelect={setSelectedTrade}
                  />
                );
              })}
            </div>

            {getOffersForTab().length === 0 && (
              <TradesEmptyState activeTab={activeTab} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradesList;
