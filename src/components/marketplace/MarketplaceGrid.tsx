
import { useState, useEffect } from 'react';
import { useMarketplaceListings } from '@/hooks/useMarketplace';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BarChart3, Briefcase } from 'lucide-react';
import MarketAnalyticsDashboard from './MarketAnalyticsDashboard';
import PortfolioDashboard from './PortfolioDashboard';
import MarketplaceFilters from './filters/MarketplaceFilters';
import QuickFilters from './filters/QuickFilters';
import MarketplaceResults from './results/MarketplaceResults';
import type { ListingFilters } from '@/types/marketplace';

const MarketplaceGrid = () => {
  const [filters, setFilters] = useState<ListingFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('listings');
  
  const { listings, isLoading, error } = useMarketplaceListings(filters);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm || undefined }));
    }, 500);

    return () => clearInterval(timer);
  }, [searchTerm]);

  const handleFiltersChange = (newFilters: Partial<ListingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading marketplace: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Portfolio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-6">
          <MarketplaceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onFiltersChange={handleFiltersChange}
          />

          <QuickFilters onFilterChange={handleFiltersChange} />

          <MarketplaceResults listings={listings} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="analytics">
          <MarketAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceGrid;
