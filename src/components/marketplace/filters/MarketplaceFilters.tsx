
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ListingFilters } from '@/types/marketplace';

interface MarketplaceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onFiltersChange: (filters: Partial<ListingFilters>) => void;
}

const MarketplaceFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onFiltersChange
}: MarketplaceFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRarity, setSelectedRarity] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    
    onFiltersChange({
      min_price: newRange.min ? Number(newRange.min) : undefined,
      max_price: newRange.max ? Number(newRange.max) : undefined
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedRarity('');
    setSelectedCondition('');
    setSearchTerm('');
    onFiltersChange({});
  };

  return (
    <div className="space-y-4">
      {/* Main Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Label htmlFor="marketplace-search" className="sr-only">
            Search marketplace
          </Label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
          <Input
            id="marketplace-search"
            placeholder="Search cards, collections, or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Search through available marketplace listings
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="min-w-[160px]">
            <Label htmlFor="sort-select" className="sr-only">
              Sort listings by
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-select">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
            aria-expanded={showAdvancedFilters}
            aria-controls="advanced-filters"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card id="advanced-filters">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Advanced Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" aria-hidden="true" />
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Price Range</Label>
                <div className="flex gap-2">
                  <div>
                    <Label htmlFor="min-price" className="sr-only">Minimum price</Label>
                    <Input
                      id="min-price"
                      type="number"
                      placeholder="Min $"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-price" className="sr-only">Maximum price</Label>
                    <Input
                      id="max-price"
                      type="number"
                      placeholder="Max $"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Rarity Filter */}
              <div>
                <Label htmlFor="rarity-select" className="text-sm font-medium mb-2 block">
                  Rarity
                </Label>
                <Select value={selectedRarity} onValueChange={(value) => {
                  setSelectedRarity(value);
                  onFiltersChange({ rarity: value || undefined });
                }}>
                  <SelectTrigger id="rarity-select">
                    <SelectValue placeholder="Any Rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rarity</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="ultra_rare">Ultra Rare</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Filter */}
              <div>
                <Label htmlFor="condition-select" className="text-sm font-medium mb-2 block">
                  Condition
                </Label>
                <Select value={selectedCondition} onValueChange={(value) => {
                  setSelectedCondition(value);
                  onFiltersChange({ condition: value ? [value] : undefined });
                }}>
                  <SelectTrigger id="condition-select">
                    <SelectValue placeholder="Any Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Condition</SelectItem>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="near_mint">Near Mint</SelectItem>
                    <SelectItem value="lightly_played">Lightly Played</SelectItem>
                    <SelectItem value="moderately_played">Moderately Played</SelectItem>
                    <SelectItem value="heavily_played">Heavily Played</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Listing Type Filter */}
              <div>
                <Label htmlFor="listing-type-select" className="text-sm font-medium mb-2 block">
                  Listing Type
                </Label>
                <Select onValueChange={(value) => {
                  onFiltersChange({ listing_type: value ? [value] : undefined });
                }}>
                  <SelectTrigger id="listing-type-select">
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Type</SelectItem>
                    <SelectItem value="fixed_price">Buy Now</SelectItem>
                    <SelectItem value="auction">Auction</SelectItem>
                    <SelectItem value="best_offer">Best Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketplaceFilters;
