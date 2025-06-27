
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Trophy, Heart, Share2, Zap } from 'lucide-react';

interface CommunityStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const CommunityStep = ({ onNext }: CommunityStepProps) => {
  const communityFeatures = [
    {
      title: 'Creator Forums',
      description: 'Connect with other creators, share tips, and collaborate',
      icon: MessageCircle,
      benefits: ['Get feedback', 'Share techniques', 'Find collaborators'],
      color: 'bg-blue-500'
    },
    {
      title: 'Featured Gallery',
      description: 'Get your best work showcased to thousands of users',
      icon: Trophy,
      benefits: ['Massive exposure', 'Recognition', 'New followers'],
      color: 'bg-gold-500'
    },
    {
      title: 'Social Features',
      description: 'Like, comment, and share cards with the community',
      icon: Heart,
      benefits: ['Build relationships', 'Get feedback', 'Grow following'],
      color: 'bg-pink-500'
    }
  ];

  const communityStats = [
    { label: 'Active Creators', value: '12K+' },
    { label: 'Cards Created', value: '500K+' },
    { label: 'Daily Interactions', value: '25K+' },
    { label: 'Success Stories', value: '800+' }
  ];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Join a Thriving Creator Community
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          You're not alone! Connect with thousands of creators who are on the same journey. 
          Share, learn, and grow together.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {communityStats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {communityFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full ${feature.color} mx-auto mb-4 flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <div className="space-y-1">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <Badge key={benefitIndex} variant="outline" className="text-xs mr-1">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Success Stories Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Alex M. - Fantasy Creator</h4>
                <p className="text-sm text-green-700 mb-2">
                  "The community feedback helped me refine my art style. Now I'm earning $800/month!"
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-green-500 text-xs">$800/mo</Badge>
                  <Badge variant="outline" className="text-xs">6 months</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">Sarah K. - Sports Cards</h4>
                <p className="text-sm text-blue-700 mb-2">
                  "I found my art partner through the forums. We've collaborated on 50+ cards together!"
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-blue-500 text-xs">Partnership</Badge>
                  <Badge variant="outline" className="text-xs">50+ Cards</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Guidelines Preview */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-500" />
            <h3 className="font-bold text-lg">Community Guidelines</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-purple-800">Be Supportive</h4>
              <p className="text-purple-700">Encourage fellow creators and provide constructive feedback</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-800">Share Knowledge</h4>
              <p className="text-purple-700">Help others learn and grow by sharing your techniques</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-800">Respect Originality</h4>
              <p className="text-purple-700">Always credit sources and respect intellectual property</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-800">Stay Professional</h4>
              <p className="text-purple-700">Maintain a professional attitude in all interactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onNext} size="lg" className="px-8">
          <Zap className="w-4 h-4 mr-2" />
          Join the Community!
        </Button>
      </div>
    </div>
  );
};
