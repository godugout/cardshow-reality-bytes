
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DiscoveryErrorBoundary } from './DiscoveryErrorBoundary';
import RecommendationSection from './components/RecommendationSection';
import { useRecommendations } from './hooks/useRecommendations';

const CardRecommendations = () => {
  const { recommendations, isLoading, error, handleRefresh } = useRecommendations();

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <p className="text-red-400 text-lg mb-4">Failed to load recommendations</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <div className="animate-pulse bg-gray-700 h-6 w-48 rounded mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="animate-pulse bg-gray-700 h-64 rounded-lg" />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <p className="text-gray-400 text-lg">No recommendations available</p>
          <p className="text-gray-500 mt-2">Check back later for personalized suggestions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DiscoveryErrorBoundary componentName="Card Recommendations">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Personalized Recommendations</h2>
            <p className="text-gray-400">Discover cards tailored just for you</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-[#00C851] text-[#00C851] hover:bg-[#00C851] hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {recommendations.map((section, index) => (
          <RecommendationSection
            key={index}
            section={section}
            index={index}
          />
        ))}
      </div>
    </DiscoveryErrorBoundary>
  );
};

export default CardRecommendations;
