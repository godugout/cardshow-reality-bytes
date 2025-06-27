
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Trophy, Heart } from 'lucide-react';

interface CommunityStepProps {
  onNext: () => void;
}

const CommunityStep = ({ onNext }: CommunityStepProps) => {
  const communityFeatures = [
    {
      icon: MessageCircle,
      title: "Creator Forums",
      description: "Connect with other creators, share tips, and get feedback",
      benefits: ["Get design feedback", "Share techniques", "Network with peers"]
    },
    {
      icon: Trophy,
      title: "Challenges & Contests",
      description: "Participate in themed challenges to win prizes and recognition",
      benefits: ["Win cash prizes", "Gain exposure", "Improve skills"]
    },
    {
      icon: Users,
      title: "Collaboration Tools",
      description: "Work together with other creators on joint projects",
      benefits: ["Split revenue", "Learn from others", "Create bigger projects"]
    },
    {
      icon: Heart,
      title: "Fan Engagement",
      description: "Build a following and interact with your card collectors",
      benefits: ["Direct feedback", "Loyal fanbase", "Commission requests"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Creator Community</h2>
        <p className="text-muted-foreground mb-6">
          Connect with thousands of creators, collectors, and fans. 
          The community is here to support your creative journey!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communityFeatures.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <div className="space-y-1">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h4 className="font-semibold text-purple-900 mb-3">Community Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
          <div>
            <h5 className="font-medium mb-2">Be Respectful</h5>
            <ul className="space-y-1">
              <li>• Provide constructive feedback</li>
              <li>• Respect different art styles</li>
              <li>• Help newcomers learn</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Share Knowledge</h5>
            <ul className="space-y-1">
              <li>• Share your techniques</li>
              <li>• Answer questions</li>
              <li>• Celebrate others' success</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStep;
