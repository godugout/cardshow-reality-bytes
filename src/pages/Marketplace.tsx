
import Header from '@/components/Header';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import MarketplaceFilters from '@/components/marketplace/filters/MarketplaceFilters';
import { Button } from '@/components/ui/button';
import PasswordResetDialog from '@/components/PasswordResetDialog';
import { Send } from 'lucide-react';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              Marketplace
            </h1>
            <p className="text-gray-400 text-lg">
              Discover and trade premium digital cards
            </p>
          </div>
          
          {/* Temporary Send button for password reset */}
          <PasswordResetDialog
            trigger={
              <Button className="bg-[#00C851] hover:bg-[#00A543] text-white">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <MarketplaceFilters />
          </div>
          <div className="lg:col-span-3">
            <MarketplaceGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
