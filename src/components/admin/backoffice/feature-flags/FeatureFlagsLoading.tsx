
import { Card, CardContent } from '@/components/ui/card';

const FeatureFlagsLoading = () => {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureFlagsLoading;
