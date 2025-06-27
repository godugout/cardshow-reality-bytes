
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ConditionFilterProps {
  selectedCondition: string;
  onConditionChange: (value: string) => void;
}

const ConditionFilter = ({ selectedCondition, onConditionChange }: ConditionFilterProps) => {
  return (
    <div>
      <Label htmlFor="condition-select" className="text-sm font-medium mb-2 block">
        Condition
      </Label>
      <Select value={selectedCondition} onValueChange={onConditionChange}>
        <SelectTrigger id="condition-select">
          <SelectValue placeholder="Any Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Condition</SelectItem>
          <SelectItem value="mint">Mint</SelectItem>
          <SelectItem value="near_mint">Near Mint</SelectItem>
          <SelectItem value="lightly_played">Lightly Played</SelectItem>
          <SelectItem value="moderately_played">Moderately Played</SelectItem>
          <SelectItem value="heavily_played">Heavily Played</SelectItem>
          <SelectItem value="damaged">Damaged</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ConditionFilter;
