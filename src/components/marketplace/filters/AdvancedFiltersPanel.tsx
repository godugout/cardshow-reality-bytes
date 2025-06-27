
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import PriceRangeFilter from './PriceRangeFilter';
import RarityFilter from './RarityFilter';
import ConditionFilter from './ConditionFilter';
import ListingTypeFilter from './ListingTypeFilter';
import type { ListingFilters } from '@/types/marketplace';

interface AdvancedFiltersPanelProps {
  priceRange: { min: string; max: string };
  selectedRarity: string;
  selectedCondition: string;
  onPriceChange: (type: 'min' | 'max', value: string) => void;
  onRarityChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onListingTypeChange: (value: string) => void;
  onClearFilters: () => void;
  onFiltersChange: (filters: Partial<ListingFilters>) => void;
}

const AdvancedFiltersPanel = ({
  priceRange,
  selectedRarity,
  selectedCondition,
  onPriceChange,
  onRarityChange,
  onConditionChange,
  onListingTypeChange,
  onClearFilters,
  onFiltersChange
}: AdvancedFiltersPanelProps) => {
  const handleRarityChange = (value: string) => {
    onRarityChange(value);
    onFiltersChange({ rarity: value || undefined });
  };

  const handleConditionChange = (value: string) => {
    onConditionChange(value);
    onFiltersChange({ condition: value ? [value] : undefined });
  };

  const handleListingTypeChange = (value: string) => {
    onListingTypeChange(value);
    onFiltersChange({ listing_type: value ? [value] : undefined });
  };

  return (
    <Card id="advanced-filters">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Advanced Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" aria-hidden="true" />
            Clear All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PriceRangeFilter 
            priceRange={priceRange}
            onPriceChange={onPriceChange}
          />
          <RarityFilter 
            selectedRarity={selectedRarity}
            onRarityChange={handleRarityChange}
          />
          <ConditionFilter 
            selectedCondition={selectedCondition}
            onConditionChange={handleConditionChange}
          />
          <ListingTypeFilter 
            onListingTypeChange={handleListingTypeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFiltersPanel;
