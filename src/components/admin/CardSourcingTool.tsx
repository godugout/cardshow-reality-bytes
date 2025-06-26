
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe } from 'lucide-react';
import { useCardGeneration } from './hooks/useCardGeneration';
import { ThemedCollectionsTab } from './components/ThemedCollectionsTab';
import { CustomSearchTab } from './components/CustomSearchTab';
import { BulkGeneratorTab } from './components/BulkGeneratorTab';
import { cardThemes } from './data/cardThemesData';

const CardSourcingTool = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, progress, generateCards } = useCardGeneration();

  const handleGenerateCards = (theme: string) => {
    const themeData = cardThemes[theme];
    if (themeData) {
      generateCards(theme, themeData.cards);
    }
  };

  const handleGenerateAllThemes = async () => {
    for (const theme of Object.keys(cardThemes)) {
      await generateCards(theme, cardThemes[theme].cards);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Card Sourcing & Content Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="themes" className="w-full">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="themes">Themed Collections</TabsTrigger>
              <TabsTrigger value="custom">Custom Search</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Generator</TabsTrigger>
            </TabsList>

            <TabsContent value="themes">
              <ThemedCollectionsTab
                onGenerateCards={handleGenerateCards}
                onGenerateAllThemes={handleGenerateAllThemes}
                isLoading={isLoading}
                progress={progress}
              />
            </TabsContent>

            <TabsContent value="custom">
              <CustomSearchTab
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
              />
            </TabsContent>

            <TabsContent value="bulk">
              <BulkGeneratorTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardSourcingTool;
