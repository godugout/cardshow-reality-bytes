
import { Suspense } from 'react';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Marketplace = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Card Marketplace</h1>
              <p className="text-gray-400 text-lg">
                Buy, sell, and trade premium digital trading cards with real-world value
              </p>
            </div>
            
            {user && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Seller Dashboard
                </Button>
                <Button className="bg-[#00C851] hover:bg-[#00a844] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Sell Cards
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#00C851]/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#00C851]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">$2.4M</p>
                <p className="text-gray-400 text-sm">Total Volume</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12,543</p>
                <p className="text-gray-400 text-sm">Active Sellers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">89,234</p>
                <p className="text-gray-400 text-sm">Cards Listed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Grid */}
        <Suspense fallback={
          <div className="text-center py-8 text-gray-400">
            Loading marketplace...
          </div>
        }>
          <MarketplaceGrid />
        </Suspense>
      </div>
    </div>
  );
};

export default Marketplace;
