
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal } from 'lucide-react';
import AdvancedFiltersPanel from './AdvancedFiltersPanel';
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
        <AdvancedFiltersPanel
          priceRange={priceRange}
          selectedRarity={selectedRarity}
          selectedCondition={selectedCondition}
          onPriceChange={handlePriceChange}
          onRarityChange={setSelectedRarity}
          onConditionChange={setSelectedCondition}
          onListingTypeChange={() => {}}
          onClearFilters={clearFilters}
          onFiltersChange={onFiltersChange}
        />
      )}
    </div>
  );
};

export default MarketplaceFilters;
