
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ListingTypeFilterProps {
  onListingTypeChange: (value: string) => void;
}

const ListingTypeFilter = ({ onListingTypeChange }: ListingTypeFilterProps) => {
  return (
    <div>
      <Label htmlFor="listing-type-select" className="text-sm font-medium mb-2 block">
        Listing Type
      </Label>
      <Select onValueChange={onListingTypeChange}>
        <SelectTrigger id="listing-type-select">
          <SelectValue placeholder="Any Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Type</SelectItem>
          <SelectItem value="fixed_price">Buy Now</SelectItem>
          <SelectItem value="auction">Auction</SelectItem>
          <SelectItem value="best_offer">Best Offer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ListingTypeFilter;
