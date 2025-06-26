
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Globe, Shuffle, Star, Zap } from 'lucide-react';

interface SourcedCard {
  name: string;
  description: string;
  image_url: string;
  rarity: string;
  card_type: string;
  theme: string;
  source_url?: string;
}

const CardSourcingTool = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sourcedCards, setSourcedCards] = useState<SourcedCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample card themes and data for testing
  const cardThemes = {
    'Fantasy Warriors': {
      cards: [
        {
          name: 'Dragon Knight Commander',
          description: 'A legendary warrior who commands the ancient dragons of the realm.',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
          rarity: 'legendary',
          card_type: 'character',
          power: 8,
          toughness: 6,
          abilities: ['Flying', 'Dragon Bond', 'Leadership']
        },
        {
          name: 'Mystic Forest Guardian',
          description: 'Protector of the enchanted woods, wielding nature\'s power.',
          image_url: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369',
          rarity: 'rare',
          card_type: 'creature',
          power: 5,
          toughness: 7,
          abilities: ['Regenerate', 'Forest Walk']
        },
        {
          name: 'Shadow Assassin',
          description: 'Swift and deadly, striking from the darkness.',
          image_url: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f',
          rarity: 'uncommon',
          card_type: 'character',
          power: 6,
          toughness: 3,
          abilities: ['Stealth', 'First Strike']
        }
      ]
    },
    'Sci-Fi Technology': {
      cards: [
        {
          name: 'Quantum Processing Core',
          description: 'Advanced computing system capable of infinite calculations.',
          image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
          rarity: 'mythic',
          card_type: 'artifact',
          power: 0,
          toughness: 8,
          abilities: ['Quantum Computing', 'Reality Shift']
        },
        {
          name: 'Cybernetic Enhancement',
          description: 'Biotech upgrade that enhances human capabilities.',
          image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
          rarity: 'rare',
          card_type: 'artifact',
          power: 0,
          toughness: 0,
          abilities: ['Enhancement', 'Tech Boost']
        },
        {
          name: 'Neural Interface Pilot',
          description: 'Human pilot enhanced with direct machine interface.',
          image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
          rarity: 'epic',
          card_type: 'character',
          power: 4,
          toughness: 4,
          abilities: ['Tech Interface', 'Pilot']
        }
      ]
    },
    'Wildlife & Nature': {
      cards: [
        {
          name: 'Majestic Mountain Eagle',
          description: 'Soaring high above the peaks, master of the skies.',
          image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
          rarity: 'rare',
          card_type: 'creature',
          power: 4,
          toughness: 3,
          abilities: ['Flying', 'Keen Sight']
        },
        {
          name: 'Forest Pack Alpha',
          description: 'Leader of the wilderness pack, fierce and loyal.',
          image_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742',
          rarity: 'uncommon',
          card_type: 'creature',
          power: 5,
          toughness: 4,
          abilities: ['Pack Leader', 'Howl']
        },
        {
          name: 'Ocean Depths Leviathan',
          description: 'Ancient creature from the deepest ocean trenches.',
          image_url: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4',
          rarity: 'legendary',
          card_type: 'creature',
          power: 9,
          toughness: 8,
          abilities: ['Aquatic', 'Tsunami', 'Ancient']
        }
      ]
    },
    'Urban Architecture': {
      cards: [
        {
          name: 'Skyscraper Fortress',
          description: 'Towering structure that dominates the city skyline.',
          image_url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
          rarity: 'rare',
          card_type: 'artifact',
          power: 0,
          toughness: 12,
          abilities: ['Fortress', 'Urban Defense']
        },
        {
          name: 'Glass Cathedral',
          description: 'Modern architectural marvel of glass and steel.',
          image_url: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a',
          rarity: 'epic',
          card_type: 'artifact',
          power: 0,
          toughness: 6,
          abilities: ['Inspire', 'Light Refraction']
        },
        {
          name: 'Bridge of Connections',
          description: 'Spanning great distances, connecting worlds.',
          image_url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
          rarity: 'uncommon',
          card_type: 'artifact',
          power: 0,
          toughness: 4,
          abilities: ['Bridge', 'Path Finding']
        }
      ]
    }
  };

  const generateCards = async (theme: string) => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      const themeData = cardThemes[theme as keyof typeof cardThemes];
      if (!themeData) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to create cards.',
          variant: 'destructive'
        });
        return;
      }

      let createdCount = 0;
      const totalCards = themeData.cards.length;

      for (const cardData of themeData.cards) {
        setProgress((createdCount / totalCards) * 100);
        
        const { error } = await supabase
          .from('cards')
          .insert({
            name: cardData.name,
            description: cardData.description,
            image_url: cardData.image_url,
            rarity: cardData.rarity,
            card_type: cardData.card_type,
            power: cardData.power,
            toughness: cardData.toughness,
            abilities: cardData.abilities,
            creator_id: user.id,
            is_public: true,
            visibility: 'public',
            current_market_value: Math.floor(Math.random() * 100) + 10,
            tags: [theme, cardData.card_type, cardData.rarity]
          });

        if (error) {
          console.error(`Error creating card ${cardData.name}:`, error);
        } else {
          createdCount++;
        }

        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setProgress(100);
      
      toast({
        title: 'Cards Created Successfully',
        description: `Created ${createdCount} cards for the ${theme} theme.`
      });

      // Create a themed collection
      await createThemedCollection(theme, user.id);

    } catch (error) {
      console.error('Error generating cards:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate cards. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const createThemedCollection = async (theme: string, userId: string) => {
    try {
      // First create the collection
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert({
          name: `${theme} Collection`,
          description: `A curated collection of ${theme.toLowerCase()} themed cards.`,
          user_id: userId,
          visibility: 'public',
          is_featured: true
        })
        .select()
        .single();

      if (collectionError || !collection) {
        console.error('Error creating collection:', collectionError);
        return;
      }

      // Get the cards we just created for this theme
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('id')
        .contains('tags', [theme])
        .eq('creator_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (cardsError || !cards) {
        console.error('Error fetching theme cards:', cardsError);
        return;
      }

      // Add cards to the collection
      const collectionCards = cards.map((card, index) => ({
        collection_id: collection.id,
        card_id: card.id,
        display_order: index
      }));

      const { error: cardInsertError } = await supabase
        .from('collection_cards')
        .insert(collectionCards);

      if (cardInsertError) {
        console.error('Error adding cards to collection:', cardInsertError);
      }

    } catch (error) {
      console.error('Error creating themed collection:', error);
    }
  };

  const generateAllThemes = async () => {
    for (const theme of Object.keys(cardThemes)) {
      await generateCards(theme);
      // Delay between themes
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

            <TabsContent value="themes" className="space-y-4">
              <div className="text-gray-300 text-sm mb-4">
                Generate themed card collections with high-quality placeholder content for testing.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(cardThemes).map(([theme, data]) => (
                  <Card key={theme} className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-white font-semibold">{theme}</h3>
                        <Badge variant="secondary">{data.cards.length} cards</Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        {data.cards.map(card => card.name).join(', ')}
                      </p>
                      <Button
                        onClick={() => generateCards(theme)}
                        disabled={isLoading}
                        className="w-full bg-[#00C851] hover:bg-[#00a844]"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generate {theme} Cards
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                onClick={generateAllThemes}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Generate All Themed Collections
              </Button>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for specific card themes or types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
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
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Generating cards...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardSourcingTool;
