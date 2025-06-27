
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Eye, Lock } from 'lucide-react';

interface PublishStepProps {
  onNext: () => void;
}

const PublishStep = ({ onNext }: PublishStepProps) => {
  const visibilityOptions = [
    {
      icon: Globe,
      title: "Public",
      description: "Anyone can discover and view your cards",
      benefits: ["Maximum visibility", "Potential for viral growth", "Community engagement"]
    },
    {
      icon: Users,
      title: "Unlisted",
      description: "Only people with the link can view",
      benefits: ["Controlled sharing", "Private collections", "Client previews"]
    },
    {
      icon: Lock,
      title: "Private",
      description: "Only you can see your cards",
      benefits: ["Work in progress", "Personal collection", "Draft storage"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Publishing Your Cards</h2>
        <p className="text-muted-foreground mb-6">
          Learn about different visibility settings and how to share your creations 
          with the world or keep them private.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibilityOptions.map((option, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="mb-4">
                <option.icon className="w-12 h-12 mx-auto text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{option.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {option.description}
              </p>
              <div className="space-y-2">
                {option.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Publishing Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Start with public cards to build your audience</li>
              <li>• Use descriptive titles and tags for better discovery</li>
              <li>• Engage with the community by commenting and favoriting</li>
              <li>• Share your cards on social media to drive traffic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishStep;
