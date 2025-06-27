
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gamepad2, Trophy, Zap, Sparkles, Users, Camera } from 'lucide-react';

interface InspirationStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const InspirationStep = ({ onNext }: InspirationStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    {
      id: 'gaming',
      title: 'Gaming Cards',
      description: 'Characters, weapons, and collectibles from your favorite games',
      icon: Gamepad2,
      color: 'bg-blue-500',
      examples: ['Character Cards', 'Weapon Collections', 'Achievement Cards']
    },
    {
      id: 'sports',
      title: 'Sports Cards',
      description: 'Athletes, teams, and memorable sports moments',
      icon: Trophy,
      color: 'bg-green-500',
      examples: ['Player Cards', 'Team Collections', 'Historic Moments']
    },
    {
      id: 'art',
      title: 'Art & Design',
      description: 'Original artwork, digital art, and creative designs',
      icon: Sparkles,
      color: 'bg-purple-500',
      examples: ['Digital Art', 'Photography', 'Abstract Designs']
    },
    {
      id: 'entertainment',
      title: 'Entertainment',
      description: 'Movies, TV shows, music, and pop culture',
      icon: Camera,
      color: 'bg-orange-500',
      examples: ['Movie Characters', 'Band Cards', 'TV Moments']
    },
    {
      id: 'fantasy',
      title: 'Fantasy & Sci-Fi',
      description: 'Dragons, spaceships, and imaginary worlds',
      icon: Zap,
      color: 'bg-indigo-500',
      examples: ['Mythical Creatures', 'Space Ships', 'Magic Items']
    },
    {
      id: 'community',
      title: 'Community Cards',
      description: 'Local events, personal collections, and custom themes',
      icon: Users,
      color: 'bg-pink-500',
      examples: ['Event Cards', 'Personal Milestones', 'Custom Themes']
    }
  ];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          What Type of Cards Inspire You?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose a category that excites you. Don't worry - you can create cards in any category later!
        </p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="browse">Browse Categories</TabsTrigger>
          <TabsTrigger value="examples">Success Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Card 
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full ${category.color} mx-auto mb-4 flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <div className="space-y-1">
                        {category.examples.map((example, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedCategory && (
            <div className="text-center">
              <Button onClick={onNext} size="lg" className="px-8">
                Great Choice! Let's Create Your First Card
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Sarah's Gaming Collection</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Started with 5 character cards, now earning $500/month from her gaming-themed collection.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">$500/mo</Badge>
                  <Badge variant="outline">150+ Cards</Badge>
                  <Badge variant="outline">2.1K Followers</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Mike's Sports Cards</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Local sports photography turned into a thriving card business with 300+ sales.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500">$1.2K/mo</Badge>
                  <Badge variant="outline">300+ Sales</Badge>
                  <Badge variant="outline">850 Followers</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button onClick={onNext} size="lg" className="px-8">
              I'm Inspired! Let's Start Creating
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
