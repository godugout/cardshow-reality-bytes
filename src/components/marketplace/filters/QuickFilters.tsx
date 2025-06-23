
import { Badge } from '@/components/ui/badge';
import type { ListingFilters } from '@/types/marketplace';

interface QuickFiltersProps {
  onFilterChange: (filters: Partial<ListingFilters>) => void;
}

const QuickFilters = ({ onFilterChange }: QuickFiltersProps) => {
  const handlePriceFilter = (min?: number, max?: number) => {
    onFilterChange({
      min_price: min,
      max_price: max,
    });
  };

  const handleConditionFilter = (conditions: string[]) => {
    onFilterChange({
      condition: conditions.length > 0 ? conditions : undefined,
    });
  };

  const handleListingTypeFilter = (types: string[]) => {
    onFilterChange({
      listing_type: types.length > 0 ? types : undefined,
    });
  };

  return (
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
        onClick={() => handleListingTypeFilter(['auction'])}
      >
        Auctions Only
      </Badge>
      <Badge 
        variant="outline" 
        className="cursor-pointer hover:bg-[#00C851] hover:text-white transition-colors"
        onClick={() => handleListingTypeFilter(['fixed_price'])}
      >
        Buy It Now
      </Badge>
    </div>
  );
};

export default QuickFilters;
