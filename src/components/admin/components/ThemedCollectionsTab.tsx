
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shuffle } from 'lucide-react';
import { ThemeCard } from './ThemeCard';
import { cardThemes } from '../data/cardThemesData';

interface ThemedCollectionsTabProps {
  onGenerateCards: (theme: string) => void;
  onGenerateAllThemes: () => void;
  isLoading: boolean;
  progress: number;
}

export const ThemedCollectionsTab = ({ 
  onGenerateCards, 
  onGenerateAllThemes, 
  isLoading, 
  progress 
}: ThemedCollectionsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="text-gray-300 text-sm mb-4">
        Generate themed card collections with high-quality placeholder content for testing.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(cardThemes).map(([theme, data]) => (
          <ThemeCard
            key={theme}
            theme={theme}
            data={data}
            onGenerate={onGenerateCards}
            isLoading={isLoading}
          />
        ))}
      </div>

      <Button
        onClick={onGenerateAllThemes}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Generate All Themed Collections
      </Button>

      {isLoading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Generating cards...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};
