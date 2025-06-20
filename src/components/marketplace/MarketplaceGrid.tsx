
import { useState, useEffect } from 'react';
import { useMarketplaceListings } from '@/hooks/useMarketplace';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SortAsc } from 'lucide-react';
import MarketplaceCard from './MarketplaceCard';
import type { ListingFilters } from '@/types/marketplace';

const MarketplaceGrid = () => {
  const [filters, setFilters] = useState<ListingFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const { listings, isLoading, error } = useMarketplaceListings(filters);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm || undefined }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePriceFilter = (min?: number, max?: number) => {
    setFilters(prev => ({
      ...prev,
      min_price: min,
      max_price: max,
    }));
  };

  const handleConditionFilter = (conditions: string[]) => {
    setFilters(prev => ({
      ...prev,
      condition: conditions.length > 0 ? conditions : undefined,
    }));
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading marketplace: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search marketplace..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-gray-900 border-gray-700">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="ending_soon">Ending Soon</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-[#00C851] hover:text-white transition-colors"
          onClick={() => handleConditionFilter(['mint'])}
        >
          Mint Condition
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-[#00C851] hover:text-white transition-colors"
          onClick={() => handlePriceFilter(undefined, 50)}
        >
          Under $50
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-[#00C851] hover:text-white transition-colors"
          onClick={() => handlePriceFilter(50, 200)}
        >
          $50 - $200
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-[#00C851] hover:text-white transition-colors"
          onClick={() => setFilters(prev => ({ ...prev, listing_type: ['auction'] }))}
        >
          Auctions Only
        </Badge>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-96 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              {listings.length} listings found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <MarketplaceCard key={listing.id} listing={listing} />
            ))}
          </div>

          {listings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No listings found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarketplaceGrid;
