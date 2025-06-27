
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Palette, Users } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-4">Welcome to Cardshow Creator!</h2>
        <p className="text-muted-foreground mb-6">
          You're about to embark on an exciting journey as a digital card creator. 
          Let's get you set up with everything you need to start creating amazing cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Palette className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold mb-2">Design Tools</h3>
            <p className="text-sm text-muted-foreground">
              Access powerful design tools to create stunning cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold mb-2">Monetization</h3>
            <p className="text-sm text-muted-foreground">
              Earn money from your creations with our revenue sharing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with other creators and build your audience
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeStep;
