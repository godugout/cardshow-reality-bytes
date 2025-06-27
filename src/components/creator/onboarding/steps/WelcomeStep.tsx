
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Palette, DollarSign, Users } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const benefits = [
    {
      icon: Palette,
      title: 'Create Stunning Cards',
      description: 'Use our advanced tools to design professional trading cards',
      color: 'bg-blue-500'
    },
    {
      icon: Sparkles,
      title: 'Add Visual Effects',
      description: 'Apply holographic, foil, and chrome effects to make cards pop',
      color: 'bg-purple-500'
    },
    {
      icon: DollarSign,
      title: 'Monetize Your Art',
      description: 'Sell your cards and earn revenue from your creative work',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Join the Community',
      description: 'Connect with other creators and card enthusiasts',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-8 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Welcome to Cardshow Creator Studio
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of creators building amazing digital trading cards. 
          We'll guide you through everything you need to know to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index} className="text-left hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${benefit.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Badge variant="secondary" className="px-3 py-1">
          ⚡ 5-minute setup
        </Badge>
        <Badge variant="secondary" className="px-3 py-1">
          🎨 Professional tools
        </Badge>
        <Badge variant="secondary" className="px-3 py-1">
          💰 Monetization ready
        </Badge>
      </div>
    </div>
  );
};
