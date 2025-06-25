
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Target, 
  Zap, 
  Trophy, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface WelcomeWizardProps {
  onComplete: (userData: any) => void;
}

const WelcomeWizard = ({ onComplete }: WelcomeWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    experienceLevel: '',
    goals: [],
    interests: [],
    timeCommitment: '',
    primaryMotivation: ''
  });

  const steps = [
    {
      title: "Welcome to Your Creator Journey!",
      subtitle: "Let's personalize your experience",
      component: <WelcomeStep />
    },
    {
      title: "What's your experience level?",
      subtitle: "This helps us customize your learning path",
      component: <ExperienceStep userData={userData} setUserData={setUserData} />
    },
    {
      title: "What are your goals?",
      subtitle: "Select all that apply",
      component: <GoalsStep userData={userData} setUserData={setUserData} />
    },
    {
      title: "What interests you most?",
      subtitle: "Choose your preferred card types",
      component: <InterestsStep userData={userData} setUserData={setUserData} />
    },
    {
      title: "Almost done!",
      subtitle: "One final question",
      component: <FinalStep userData={userData} setUserData={setUserData} />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500/20 p-3 rounded-full">
              <Palette className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white mb-2">
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-gray-400">{steps[currentStep].subtitle}</p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep].component}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WelcomeStep = () => (
  <div className="text-center space-y-6">
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="bg-blue-500/20 p-4 rounded-lg mb-2">
          <Zap className="w-8 h-8 text-blue-400 mx-auto" />
        </div>
        <h3 className="text-white font-medium">Create Amazing Cards</h3>
        <p className="text-gray-400 text-sm">Professional tools made simple</p>
      </div>
      <div className="text-center">
        <div className="bg-purple-500/20 p-4 rounded-lg mb-2">
          <Target className="w-8 h-8 text-purple-400 mx-auto" />
        </div>
        <h3 className="text-white font-medium">Earn Real Money</h3>
        <p className="text-gray-400 text-sm">Monetize your creativity</p>
      </div>
      <div className="text-center">
        <div className="bg-yellow-500/20 p-4 rounded-lg mb-2">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto" />
        </div>
        <h3 className="text-white font-medium">Join the Community</h3>
        <p className="text-gray-400 text-sm">Connect with fellow creators</p>
      </div>
    </div>
    <p className="text-gray-300">
      Let's get you started with a personalized experience that matches your goals and skill level.
    </p>
  </div>
);

const ExperienceStep = ({ userData, setUserData }: any) => {
  const levels = [
    { id: 'beginner', label: 'Complete Beginner', desc: 'New to digital card creation' },
    { id: 'some-experience', label: 'Some Experience', desc: 'Created a few cards before' },
    { id: 'experienced', label: 'Experienced', desc: 'Comfortable with design tools' },
    { id: 'expert', label: 'Expert', desc: 'Professional designer/artist' }
  ];

  return (
    <div className="space-y-4">
      {levels.map((level) => (
        <div
          key={level.id}
          onClick={() => setUserData({ ...userData, experienceLevel: level.id })}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            userData.experienceLevel === level.id
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <h3 className="text-white font-medium">{level.label}</h3>
          <p className="text-gray-400 text-sm">{level.desc}</p>
        </div>
      ))}
    </div>
  );
};

const GoalsStep = ({ userData, setUserData }: any) => {
  const goals = [
    'Earn passive income',
    'Build a personal brand',
    'Express creativity',
    'Learn new skills',
    'Connect with community',
    'Sell physical prints'
  ];

  const toggleGoal = (goal: string) => {
    const currentGoals = userData.goals || [];
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g: string) => g !== goal)
      : [...currentGoals, goal];
    setUserData({ ...userData, goals: updatedGoals });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {goals.map((goal) => (
        <div
          key={goal}
          onClick={() => toggleGoal(goal)}
          className={`p-3 border rounded-lg cursor-pointer transition-colors text-center ${
            userData.goals?.includes(goal)
              ? 'border-green-500 bg-green-500/10 text-green-400'
              : 'border-gray-600 hover:border-gray-500 text-gray-300'
          }`}
        >
          {userData.goals?.includes(goal) && (
            <CheckCircle className="w-4 h-4 mx-auto mb-2" />
          )}
          <p className="text-sm">{goal}</p>
        </div>
      ))}
    </div>
  );
};

const InterestsStep = ({ userData, setUserData }: any) => {
  const interests = [
    'Sports Cards',
    'Gaming Cards',
    'Art & Illustration',
    'Photography',
    'Abstract Design',
    'Character Design'
  ];

  const toggleInterest = (interest: string) => {
    const currentInterests = userData.interests || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i: string) => i !== interest)
      : [...currentInterests, interest];
    setUserData({ ...userData, interests: updatedInterests });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {interests.map((interest) => (
        <div
          key={interest}
          onClick={() => toggleInterest(interest)}
          className={`p-3 border rounded-lg cursor-pointer transition-colors text-center ${
            userData.interests?.includes(interest)
              ? 'border-green-500 bg-green-500/10 text-green-400'
              : 'border-gray-600 hover:border-gray-500 text-gray-300'
          }`}
        >
          {userData.interests?.includes(interest) && (
            <CheckCircle className="w-4 h-4 mx-auto mb-2" />
          )}
          <p className="text-sm">{interest}</p>
        </div>
      ))}
    </div>
  );
};

const FinalStep = ({ userData, setUserData }: any) => {
  const commitments = [
    { id: 'casual', label: 'Casual', desc: 'A few hours per week' },
    { id: 'part-time', label: 'Part-time', desc: '10-20 hours per week' },
    { id: 'full-time', label: 'Full-time', desc: '40+ hours per week' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-medium mb-4">How much time can you dedicate?</h3>
        <div className="space-y-3">
          {commitments.map((commitment) => (
            <div
              key={commitment.id}
              onClick={() => setUserData({ ...userData, timeCommitment: commitment.id })}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                userData.timeCommitment === commitment.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <h4 className="text-white font-medium">{commitment.label}</h4>
              <p className="text-gray-400 text-sm">{commitment.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-700/50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">You're all set!</span>
        </div>
        <p className="text-gray-300 text-sm">
          We'll create a personalized experience based on your preferences. You can always change these settings later.
        </p>
      </div>
    </div>
  );
};

export default WelcomeWizard;
