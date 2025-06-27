
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Sparkles, Settings, Zap } from 'lucide-react';

interface DesignToolsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const DesignToolsStep = ({ onNext }: DesignToolsStepProps) => {
  const basicTools = [
    {
      title: 'Color Themes',
      description: 'Choose from 20+ professionally designed color schemes',
      icon: Palette,
      badge: 'Easy'
    },
    {
      title: 'Text Styling',
      description: 'Fonts, sizes, and positioning for perfect typography',
      icon: Settings,
      badge: 'Essential'
    },
    {
      title: 'Layout Options',
      description: 'Multiple card layouts and content positioning',
      icon: Settings,
      badge: 'Flexible'
    }
  ];

  const premiumEffects = [
    {
      title: 'Holographic Effect',
      description: 'Rainbow shimmer that changes with viewing angle',
      preview: 'linear-gradient(45deg, #ff0000, #ff7f00, #00ff00, #0000ff, #8b00ff)',
      badge: '✨ Premium'
    },
    {
      title: 'Foil Finish',
      description: 'Metallic shine for a luxurious look',
      preview: 'linear-gradient(135deg, #c0c0c0, #silver, #c0c0c0)',
      badge: '✨ Premium'
    },
    {
      title: 'Chrome Effect',
      description: 'Mirror-like reflective surface',
      preview: 'linear-gradient(45deg, #333, #666, #999, #ccc)',
      badge: '✨ Premium'
    }
  ];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Powerful Design Tools at Your Fingertips
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          From simple customization to advanced effects, we have everything you need to make stunning cards.
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="basic">Basic Tools</TabsTrigger>
          <TabsTrigger value="effects">Premium Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {basicTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="outline" className="mb-3">{tool.badge}</Badge>
                    <h3 className="font-bold text-lg mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-lg mb-2">🎯 Perfect for Beginners</h3>
              <p className="text-muted-foreground mb-4">
                Start with these tools to create professional-looking cards in minutes.
                No design experience required!
              </p>
              <Button variant="outline">Try Basic Tools Now</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumEffects.map((effect, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div 
                  className="h-24 opacity-50"
                  style={{ background: effect.preview }}
                />
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {effect.badge}
                  </Badge>
                  <h3 className="font-bold text-lg mb-2">{effect.title}</h3>
                  <p className="text-sm text-muted-foreground">{effect.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <h3 className="font-bold text-lg">Premium Effects</h3>
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-muted-foreground mb-4">
                These advanced effects make your cards stand out and command higher prices.
                Premium creators report 3x higher sales with effect-enhanced cards.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">3x Higher Sales</Badge>
                <Badge className="bg-blue-500">Stand Out</Badge>
                <Badge className="bg-purple-500">Premium Quality</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Button onClick={onNext} size="lg" className="px-8">
          <Zap className="w-4 h-4 mr-2" />
          Ready to Publish Your First Card!
        </Button>
      </div>
    </div>
  );
};
