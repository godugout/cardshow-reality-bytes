
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Globe, Users, TrendingUp, Shield, Rocket } from 'lucide-react';

interface PublishStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const PublishStep = ({ onNext }: PublishStepProps) => {
  const publishingOptions = [
    {
      type: 'public',
      title: 'Public Gallery',
      description: 'Anyone can discover and view your cards',
      icon: Globe,
      benefits: ['Maximum exposure', 'Community feedback', 'Organic discovery'],
      color: 'bg-blue-500'
    },
    {
      type: 'community',
      title: 'Community Showcase',
      description: 'Share with the creator community first',
      icon: Users,
      benefits: ['Creator feedback', 'Collaboration opportunities', 'Safe testing ground'],
      color: 'bg-green-500'
    },
    {
      type: 'private',
      title: 'Private Collection',
      description: 'Keep your cards private while you perfect them',
      icon: Shield,
      benefits: ['Perfect in private', 'Share when ready', 'Portfolio building'],
      color: 'bg-gray-500'
    }
  ];

  const tips = [
    {
      icon: Eye,
      title: 'First Impressions Matter',
      description: 'Your first card sets the tone for your entire collection'
    },
    {
      icon: TrendingUp,
      title: 'Consistency Builds Following',
      description: 'Regular publishing helps build an audience over time'
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'Respond to comments and feedback to grow your network'
    }
  ];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Ready to Share Your Creation?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose how you want to publish your first card. You can always change this later!
        </p>
      </div>

      <Tabs defaultValue="options" className="w-full max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="options">Publishing Options</TabsTrigger>
          <TabsTrigger value="tips">Success Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishingOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.type} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full ${option.color} mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                    <div className="space-y-2">
                      {option.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <Rocket className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg mb-2">Recommended: Start Public</h3>
              <p className="text-muted-foreground mb-4">
                Most successful creators start by publishing publicly to get immediate feedback 
                and start building their audience from day one.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">Faster Growth</Badge>
                <Badge className="bg-blue-500">Community Support</Badge>
                <Badge className="bg-purple-500">Immediate Feedback</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-center">🚀 Launch Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Week 1-2:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Publish 3-5 cards</li>
                    <li>• Engage with community</li>
                    <li>• Gather feedback</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Week 3-4:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Establish posting rhythm</li>
                    <li>• Experiment with styles</li>
                    <li>• Build following</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Button onClick={onNext} size="lg" className="px-8">
          <Globe className="w-4 h-4 mr-2" />
          Publish My First Card!
        </Button>
      </div>
    </div>
  );
};
