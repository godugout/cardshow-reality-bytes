
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ListingTypeFilterProps {
  onListingTypeChange: (value: string) => void;
}

const ListingTypeFilter = ({ onListingTypeChange }: ListingTypeFilterProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="listing-type-select" className="text-sm font-semibold">
        Listing Type
      </Label>
      <Select onValueChange={onListingTypeChange}>
        <SelectTrigger id="listing-type-select" className="rounded-3xl border-0 bg-background/50 backdrop-blur-sm">
          <SelectValue placeholder="Any Type" />
        </SelectTrigger>
        <SelectContent className="rounded-3xl border-0 bg-card/90 backdrop-blur-xl">
          <SelectItem value="all" className="rounded-2xl">Any Type</SelectItem>
          <SelectItem value="fixed_price" className="rounded-2xl">Buy Now</SelectItem>
          <SelectItem value="auction" className="rounded-2xl">Auction</SelectItem>
          <SelectItem value="best_offer" className="rounded-2xl">Best Offer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ListingTypeFilter;
