
import { Card, CardContent } from '@/components/ui/card';

interface CreatorProgressOverviewProps {
  progress: {
    hasCreatedCard: boolean;
    hasPublishedCard: boolean;
    isOnboardingComplete: boolean;
  };
}

export const CreatorProgressOverview = ({ progress }: CreatorProgressOverviewProps) => {
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-8">
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-4">Your Creator Journey</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {progress.hasCreatedCard ? '✓' : '○'}
            </div>
            <div className="text-sm text-muted-foreground">First Card</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {progress.hasPublishedCard ? '✓' : '○'}
            </div>
            <div className="text-sm text-muted-foreground">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">○</div>
            <div className="text-sm text-muted-foreground">First Sale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">○</div>
            <div className="text-sm text-muted-foreground">Community</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
