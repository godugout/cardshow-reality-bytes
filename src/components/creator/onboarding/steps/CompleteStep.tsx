
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Rocket, Palette, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompleteStepProps {
  onNext: () => void;
}

const CompleteStep = ({ onNext }: CompleteStepProps) => {
  const navigate = useNavigate();

  const nextSteps = [
    {
      icon: Palette,
      title: "Create Your First Card",
      description: "Use our design tools to create your debut card",
      action: "Start Creating",
      onClick: () => navigate('/creator')
    },
    {
      icon: Users,
      title: "Join the Community",
      description: "Connect with other creators and share your work",
      action: "Visit Community",
      onClick: () => navigate('/community')
    },
    {
      icon: Rocket,
      title: "Explore Marketplace",
      description: "See what's trending and get inspired",
      action: "Browse Cards",
      onClick: () => navigate('/marketplace')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-4">Welcome to the Creator Community!</h2>
        <p className="text-muted-foreground mb-6">
          Congratulations! You've completed the onboarding process. 
          You're now ready to start creating amazing digital trading cards.
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-green-900 mb-2">🎉 You're All Set!</h3>
        <p className="text-green-800 text-sm">
          Your creator account is now active. Start creating, earning, and connecting with the community!
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-center">What would you like to do first?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextSteps.map((step, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <step.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {step.description}
                </p>
                <Button className="w-full" onClick={step.onClick}>
                  {step.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Need help getting started? Check out our resources:
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="sm">
            📚 Creator Guide
          </Button>
          <Button variant="outline" size="sm">
            🎥 Video Tutorials
          </Button>
          <Button variant="outline" size="sm">
            💬 Get Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompleteStep;
