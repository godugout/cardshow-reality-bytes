
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
    <div className="space-y-6">
      {/* Main Search and Sort Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Label htmlFor="marketplace-search" className="sr-only">
            Search marketplace
          </Label>
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" aria-hidden="true" />
          <Input
            id="marketplace-search"
            placeholder="Search cards, collections, or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-16 h-16 rounded-3xl border-0 bg-background/50 backdrop-blur-xl text-lg"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Search through available marketplace listings
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="min-w-[200px]">
            <Label htmlFor="sort-select" className="sr-only">
              Sort listings by
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-select" className="h-16 rounded-3xl border-0 bg-background/50 backdrop-blur-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-3xl border-0 bg-card/90 backdrop-blur-xl">
                <SelectItem value="newest" className="rounded-2xl">Newest First</SelectItem>
                <SelectItem value="oldest" className="rounded-2xl">Oldest First</SelectItem>
                <SelectItem value="price_low" className="rounded-2xl">Price: Low to High</SelectItem>
                <SelectItem value="price_high" className="rounded-2xl">Price: High to Low</SelectItem>
                <SelectItem value="popular" className="rounded-2xl">Most Popular</SelectItem>
                <SelectItem value="ending_soon" className="rounded-2xl">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-3 h-16 px-6 rounded-3xl border-0 bg-background/50 backdrop-blur-xl font-bold"
            aria-expanded={showAdvancedFilters}
            aria-controls="advanced-filters"
          >
            <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
            Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="animate-modern-slide-up">
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
        </div>
      )}
    </div>
  );
};

export default MarketplaceFilters;
