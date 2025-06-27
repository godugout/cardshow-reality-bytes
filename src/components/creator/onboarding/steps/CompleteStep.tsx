
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Rocket, Sparkles, Target, Users, DollarSign } from 'lucide-react';

interface CompleteStepProps {
  onFinish: () => void;
}

export const CompleteStep = ({ onFinish }: CompleteStepProps) => {
  const achievements = [
    {
      title: 'Creator Account Setup',
      description: 'Your profile is ready to showcase your work',
      icon: CheckCircle,
      status: 'complete'
    },
    {
      title: 'First Card Created',
      description: 'You know the basics of card creation',
      icon: CheckCircle,
      status: 'complete'
    },
    {
      title: 'Design Tools Mastered',
      description: 'You understand our powerful design system',
      icon: CheckCircle,
      status: 'complete'
    },
    {
      title: 'Publishing Ready',
      description: 'You can share your work with the world',
      icon: CheckCircle,
      status: 'complete'
    },
    {
      title: 'Monetization Enabled',
      description: 'You understand how to earn from your cards',
      icon: CheckCircle,
      status: 'complete'
    },
    {
      title: 'Community Connected',
      description: 'You know how to engage with other creators',
      icon: CheckCircle,
      status: 'complete'
    }
  ];

  const nextSteps = [
    {
      title: 'Create Your First 5 Cards',
      description: 'Build momentum with a small collection',
      icon: Target,
      timeframe: 'This week'
    },
    {
      title: 'Join Creator Forums',
      description: 'Connect with other creators and get feedback',
      icon: Users,
      timeframe: 'Today'
    },
    {
      title: 'Set Up Revenue Streams',
      description: 'Enable sales and start monetizing',
      icon: DollarSign,
      timeframe: 'Next few days'
    }
  ];

  return (
    <div className="p-8 text-center">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Rocket className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          🎉 Congratulations, You're All Set!
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You've completed the creator onboarding and have all the tools you need to succeed. 
          Time to create amazing cards and build your creative business!
        </p>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <Card key={index} className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-semibold text-sm text-green-800">{achievement.title}</h4>
                    <p className="text-xs text-green-700">{achievement.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-8">
        <CardContent className="p-6">
          <h3 className="font-bold text-xl mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Your Next Steps to Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {step.timeframe}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary mb-1">5 cards</div>
            <div className="text-xs text-muted-foreground">First milestone</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary mb-1">$50</div>
            <div className="text-xs text-muted-foreground">First month goal</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary mb-1">100</div>
            <div className="text-xs text-muted-foreground">Followers target</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary mb-1">30 days</div>
            <div className="text-xs text-muted-foreground">To success</div>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA */}
      <div className="space-y-4">
        <Button onClick={onFinish} size="lg" className="px-12 py-3 text-lg">
          <Rocket className="w-5 h-5 mr-2" />
          Enter Creator Studio
        </Button>
        <p className="text-sm text-muted-foreground">
          Ready to create your first masterpiece? Let's go!
        </p>
      </div>
    </div>
  );
};
