
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, SortAsc } from 'lucide-react';
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
  return (
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
            <SelectItem value="most_watched">Most Watched</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="border-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
