
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Star } from 'lucide-react';

interface InspirationStepProps {
  onNext: () => void;
}

const InspirationStep = ({ onNext }: InspirationStepProps) => {
  const examples = [
    {
      title: "Fantasy Warriors",
      category: "Fantasy",
      views: "12.5K",
      likes: "2.1K",
      rarity: "Legendary"
    },
    {
      title: "Sports Champions",
      category: "Sports",
      views: "8.3K",
      likes: "1.5K",
      rarity: "Epic"
    },
    {
      title: "Sci-Fi Heroes",
      category: "Sci-Fi",
      views: "15.2K",
      likes: "3.2K",
      rarity: "Mythic"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Get Inspired</h2>
        <p className="text-muted-foreground mb-6">
          Check out some popular card examples to spark your creativity. 
          What kind of cards would you like to create?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {examples.map((example, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <Star className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="font-semibold mb-2">{example.title}</h3>
              <Badge variant="outline" className="mb-2">{example.category}</Badge>
              <Badge variant="secondary" className="mb-2 ml-2">{example.rarity}</Badge>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {example.views}
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {example.likes}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InspirationStep;
