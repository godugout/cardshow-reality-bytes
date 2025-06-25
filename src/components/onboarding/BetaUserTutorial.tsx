
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Play,
  Sparkles,
  Users,
  CreditCard,
  Palette,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  prerequisites?: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Cardshow Beta!',
    description: 'Discover the future of digital trading cards with 3D visualization and real-time trading.',
    icon: <Sparkles className="w-8 h-8 text-[#00C851]" />,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#00C851] rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Welcome to Cardshow Beta!</h3>
          <p className="text-gray-400">
            You're among the first to experience our revolutionary 3D card platform. 
            Let's get you started with a quick tour of the key features.
          </p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2">What's New in Beta:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Enhanced 3D card rendering with premium effects</li>
            <li>• Real-time trading and marketplace</li>
            <li>• Advanced creator tools and analytics</li>
            <li>• Community features and social trading</li>
          </ul>
        </div>
      </div>
    )
  },
  
  {
    id: 'create-card',
    title: 'Create Your First Card',
    description: 'Learn how to design and create stunning 3D trading cards.',
    icon: <Palette className="w-8 h-8 text-[#00C851]" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Create Your First Card</h3>
        <p className="text-gray-400">
          The card creator is your gateway to building amazing digital collectibles. 
          Here's what you can do:
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#00C851] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            <div>
              <div className="font-medium text-white">Choose a Template</div>
              <div className="text-sm text-gray-400">Start with pre-designed templates for sports, gaming, or custom cards</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#00C851] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
            <div>
              <div className="font-medium text-white">Upload Your Image</div>
              <div className="text-sm text-gray-400">Add your artwork, photo, or design</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#00C851] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
            <div>
              <div className="font-medium text-white">Customize Effects</div>
              <div className="text-sm text-gray-400">Add holographic, chrome, or other premium effects</div>
            </div>
          </div>
        </div>
      </div>
    ),
    action: {
      label: 'Go to Creator',
      href: '/creator'
    }
  },
  
  {
    id: 'explore-marketplace',
    title: 'Explore the Marketplace',
    description: 'Discover and trade cards with other collectors.',
    icon: <ShoppingBag className="w-8 h-8 text-[#00C851]" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Marketplace Features</h3>
        <p className="text-gray-400">
          The marketplace is where the magic happens. Buy, sell, and discover amazing cards from creators worldwide.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">Buy Cards</div>
            <div className="text-sm text-gray-400">Purchase cards instantly or place bids on auctions</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">Sell Your Cards</div>
            <div className="text-sm text-gray-400">List your cards for fixed prices or create auctions</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">Price Discovery</div>
            <div className="text-sm text-gray-400">Track market values and price trends</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">3D Preview</div>
            <div className="text-sm text-gray-400">View cards in stunning 3D before purchasing</div>
          </div>
        </div>
      </div>
    ),
    action: {
      label: 'Visit Marketplace',
      href: '/marketplace'
    }
  },
  
  {
    id: 'trading-system',
    title: 'Real-time Trading',
    description: 'Trade cards directly with other users in real-time.',
    icon: <Users className="w-8 h-8 text-[#00C851]" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Trading Made Easy</h3>
        <p className="text-gray-400">
          Our real-time trading system lets you negotiate and trade cards directly with other collectors.
        </p>
        
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">🔄 Direct Trading</div>
            <div className="text-sm text-gray-400">Trade multiple cards in complex deals</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">💬 Real-time Chat</div>
            <div className="text-sm text-gray-400">Negotiate directly with trading partners</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">🔒 Secure Transactions</div>
            <div className="text-sm text-gray-400">All trades are secured and verified</div>
          </div>
        </div>
      </div>
    ),
    action: {
      label: 'Start Trading',
      href: '/trading'
    }
  },
  
  {
    id: 'payment-setup',
    title: 'Payment & Earnings',
    description: 'Set up payments to buy cards and earn from your creations.',
    icon: <CreditCard className="w-8 h-8 text-[#00C851]" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Monetize Your Creativity</h3>
        <p className="text-gray-400">
          Cardshow uses Stripe for secure payments. Set up your account to start earning from your card sales.
        </p>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Creator Benefits:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Earn 70% revenue from card sales</li>
            <li>• Automatic royalties on secondary sales</li>
            <li>• Monthly payouts via Stripe</li>
            <li>• Detailed analytics and reporting</li>
          </ul>
        </div>
        
        <Badge variant="secondary" className="w-full justify-center py-2">
          Beta users get reduced platform fees for the first 6 months!
        </Badge>
      </div>
    )
  }
];

interface BetaUserTutorialProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

const BetaUserTutorial = ({ onComplete, autoStart = false }: BetaUserTutorialProps) => {
  const [isOpen, setIsOpen] = useState(autoStart);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has already seen the tutorial
    const hasSeenTutorial = localStorage.getItem('cardshow-tutorial-completed');
    if (autoStart && !hasSeenTutorial && user) {
      setIsOpen(true);
    }
  }, [autoStart, user]);

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set(prev).add(stepId));
  };

  const handleNext = () => {
    const currentStepData = tutorialSteps[currentStep];
    handleStepComplete(currentStepData.id);
    
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('cardshow-tutorial-completed', 'true');
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem('cardshow-tutorial-skipped', 'true');
    setIsOpen(false);
    onComplete?.();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Play className="w-4 h-4 mr-2" />
        Tutorial
      </Button>
    );
  }

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {currentStepData.icon}
              <div>
                <h2 className="text-xl font-bold text-white">{currentStepData.title}</h2>
                <p className="text-sm text-gray-400">{currentStepData.description}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {currentStepData.action && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentStepData.action?.href) {
                      window.open(currentStepData.action.href, '_blank');
                    }
                    currentStepData.action?.onClick?.();
                  }}
                  className="border-[#00C851] text-[#00C851]"
                >
                  {currentStepData.action.label}
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="bg-[#00C851] hover:bg-[#00a844]"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaUserTutorial;
