
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Database, Users, ShoppingCart } from 'lucide-react';
import { useCardGeneration } from '../hooks/useCardGeneration';
import { cardThemes } from '../data/cardThemesData';

export const BulkGeneratorTab = () => {
  const [bulkProgress, setBulkProgress] = useState(0);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const { generateCards } = useCardGeneration();

  const generateBulkCards = async (count: number) => {
    setIsBulkLoading(true);
    setBulkProgress(0);
    
    const themes = Object.keys(cardThemes);
    const cardsPerTheme = Math.ceil(count / themes.length);
    let totalGenerated = 0;
    
    for (let i = 0; i < themes.length && totalGenerated < count; i++) {
      const theme = themes[i];
      const themeData = cardThemes[theme];
      const cardsToGenerate = Math.min(cardsPerTheme, count - totalGenerated);
      
      // Generate cards for this theme (repeat cards if needed)
      const cardsToUse = [];
      for (let j = 0; j < cardsToGenerate; j++) {
        const cardIndex = j % themeData.cards.length;
        const originalCard = themeData.cards[cardIndex];
        cardsToUse.push({
          ...originalCard,
          title: `${originalCard.title} ${j > 0 ? `#${j + 1}` : ''}`,
          serial_number: j + 1
        });
      }
      
      await generateCards(theme, cardsToUse);
      totalGenerated += cardsToGenerate;
      setBulkProgress((totalGenerated / count) * 100);
      
      // Small delay between themes
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsBulkLoading(false);
    setBulkProgress(0);
  };

  const generateCollections = async (count: number) => {
    // This would create sample collections
    console.log(`Would generate ${count} collections`);
  };

  const generateCompleteDataset = async () => {
    setIsBulkLoading(true);
    setBulkProgress(0);
    
    // Generate all theme cards
    const themes = Object.keys(cardThemes);
    for (let i = 0; i < themes.length; i++) {
      const theme = themes[i];
      const themeData = cardThemes[theme];
      await generateCards(theme, themeData.cards);
      setBulkProgress(((i + 1) / themes.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsBulkLoading(false);
    setBulkProgress(0);
  };

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => generateBulkCards(100)}
            disabled={isBulkLoading}
          >
            <Database className="w-4 h-4 mr-2" />
            100 Random Cards
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => generateBulkCards(250)}
            disabled={isBulkLoading}
          >
            <Database className="w-4 h-4 mr-2" />
            250 Cards
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => generateCollections(50)}
            disabled={isBulkLoading}
          >
            <Users className="w-4 h-4 mr-2" />
            50 Collections
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => generateBulkCards(500)}
            disabled={isBulkLoading}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            500 Cards
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700 md:col-span-2"
            onClick={generateCompleteDataset}
            disabled={isBulkLoading}
          >
            <Zap className="w-4 h-4 mr-2" />
            Complete Dataset (All Themes)
          </Button>
        </div>

        {isBulkLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Generating bulk content...</span>
              <span>{Math.round(bulkProgress)}%</span>
            </div>
            <Progress value={bulkProgress} className="h-2" />
          </div>
        )}
      </div>

      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Generation Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Available Themes</div>
            <div className="text-white font-semibold">{Object.keys(cardThemes).length}</div>
          </div>
          <div>
            <div className="text-gray-400">Base Cards</div>
            <div className="text-white font-semibold">
              {Object.values(cardThemes).reduce((sum, theme) => sum + theme.cards.length, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Rarity Types</div>
            <div className="text-white font-semibold">6</div>
          </div>
          <div>
            <div className="text-gray-400">Card Types</div>
            <div className="text-white font-semibold">5</div>
          </div>
        </div>
      </div>
    </div>
  );
};
