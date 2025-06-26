
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe } from 'lucide-react';

interface CustomSearchTabProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export const CustomSearchTab = ({ searchQuery, onSearchQueryChange }: CustomSearchTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for specific card themes or types..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
        />
        <Button disabled className="bg-gray-700">
          <Globe className="w-4 h-4 mr-2" />
          Search Web
        </Button>
      </div>
      <div className="text-gray-400 text-sm">
        Custom web scraping coming soon. For now, use the themed collections above.
      </div>
    </div>
  );
};
