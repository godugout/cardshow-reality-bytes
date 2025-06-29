
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ContextualButton } from '@/components/ui/contextual-button';
import { useMarketplaceListings } from '@/hooks/useMarketplace';
import MarketplaceCard from '../MarketplaceCard';
import DiscoveryFilters from './DiscoveryFilters';
import type { ListingFilters } from '@/types/marketplace';

const DiscoverySection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>({});
  
  const appliedFilters = useMemo(() => {
    const applied = [];
    if (filters.min_price) applied.push(`Min: $${filters.min_price}`);
    if (filters.max_price) applied.push(`Max: $${filters.max_price}`);
    if (filters.rarity) applied.push(`${filters.rarity} Rarity`);
    if (filters.condition?.length) applied.push(`${filters.condition.join(', ')} Condition`);
    return applied;
  }, [filters]);

  const searchFilters = useMemo(() => ({
    ...filters,
    search: searchTerm || undefined
  }), [filters, searchTerm]);

  const { listings, isLoading } = useMarketplaceListings(searchFilters);

  const handleFiltersChange = (newFilters: Partial<ListingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search cards, collections, or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-3xl border-marketplace/20 focus:border-marketplace bg-background/50 backdrop-blur-sm"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-14 rounded-3xl border-0 bg-background/50 backdrop-blur-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-3xl border-0 bg-card/90 backdrop-blur-xl">
              <SelectItem value="newest" className="rounded-2xl">Newest First</SelectItem>
              <SelectItem value="price_low" className="rounded-2xl">Price: Low to High</SelectItem>
              <SelectItem value="price_high" className="rounded-2xl">Price: High to Low</SelectItem>
              <SelectItem value="popular" className="rounded-2xl">Most Popular</SelectItem>
              <SelectItem value="ending_soon" className="rounded-2xl">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
          
          <ContextualButton
            context="marketplace"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 h-14 px-6 rounded-3xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </ContextualButton>
        </div>
      </div>

      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">Filters:</span>
          {appliedFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-marketplace/10 text-marketplace border-marketplace/20">
              {filter}
              <X className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors" onClick={clearFilters} />
            </Badge>
          ))}
          <ContextualButton 
            context="marketplace" 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="rounded-2xl"
          >
            Clear all
          </ContextualButton>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-6 border-0 shadow-card">
          <DiscoveryFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground font-medium">
            {isLoading ? 'Loading...' : `${listings.length} cards found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card/50 backdrop-blur-xl rounded-3xl h-96 animate-pulse border-0 shadow-card" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <MarketplaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!isLoading && listings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-marketplace/10 rounded-3xl flex items-center justify-center">
              <Search className="w-10 h-10 text-marketplace" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">No cards found</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : 'No cards are currently available'}
            </p>
            {(searchTerm || Object.keys(filters).length > 0) && (
              <ContextualButton 
                context="marketplace" 
                variant="outline" 
                onClick={clearFilters} 
                className="rounded-3xl px-8 py-3"
              >
                Clear search and filters
              </ContextualButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverySection;
