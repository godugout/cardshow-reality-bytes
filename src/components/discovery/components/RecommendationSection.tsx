
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CardDisplay from '@/components/cards/CardDisplay';
import { DiscoveryErrorBoundary } from '../DiscoveryErrorBoundary';
import type { RecommendationSection as RecommendationSectionType } from '../types/recommendationTypes';

interface RecommendationSectionProps {
  section: RecommendationSectionType;
  index: number;
}

const RecommendationSection = ({ section, index }: RecommendationSectionProps) => {
  const Icon = section.icon;
  
  return (
    <Card key={index} className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-[#00C851]" />
            <CardTitle className="text-white">{section.title}</CardTitle>
            <Badge variant="outline" className="border-[#00C851] text-[#00C851]">
              {section.badge}
            </Badge>
          </div>
        </div>
        <p className="text-gray-400">{section.description}</p>
      </CardHeader>
      <CardContent>
        {section.cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.cards.slice(0, 4).map((card) => (
              <DiscoveryErrorBoundary key={card.id} componentName="Card Display">
                <CardDisplay
                  card={card}
                  size="md"
                  showStats={true}
                />
              </DiscoveryErrorBoundary>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No cards found for {section.title.toLowerCase()}
          </div>
        )}
        {section.cards.length > 4 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" className="text-[#00C851] hover:text-white hover:bg-[#00C851]">
              View All {section.cards.length} Cards
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationSection;
