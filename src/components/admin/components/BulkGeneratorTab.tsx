
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export const BulkGeneratorTab = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Bulk Content Generator
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Generate large amounts of test content for development and testing.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            100 Random Cards
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            50 Collections
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            Complete Dataset
          </Button>
        </div>
      </div>
    </div>
  );
};
