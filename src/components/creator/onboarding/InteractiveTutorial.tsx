
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle, 
  BookOpen,
  Video,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'interactive' | 'reading';
  duration: string;
  completed: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: TutorialStep[];
  category: string;
}

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Creating Your First Card',
    description: 'Learn the basics of card design with our intuitive tools',
    difficulty: 'beginner',
    estimatedTime: '15 min',
    category: 'Getting Started',
    steps: [
      {
        id: '1-1',
        title: 'Choose a Template',
        description: 'Pick from our professional template library',
        type: 'interactive',
        duration: '3 min',
        completed: false
      },
      {
        id: '1-2',
        title: 'Upload Your Image',
        description: 'Add your artwork or photo',
        type: 'interactive',
        duration: '2 min',
        completed: false
      },
      {
        id: '1-3',
        title: 'Customize Effects',
        description: 'Add holographic and premium effects',
        type: 'video',
        duration: '5 min',
        completed: false
      },
      {
        id: '1-4',
        title: 'Publish Your Card',
        description: 'Make your card available to collectors',
        type: 'interactive',
        duration: '5 min',
        completed: false
      }
    ]
  },
  {
    id: '2',
    title: 'Understanding Card Effects',
    description: 'Master holographic, foil, and custom effects',
    difficulty: 'intermediate',
    estimatedTime: '25 min',
    category: 'Design Skills',
    steps: [
      {
        id: '2-1',
        title: 'Holographic Effects',
        description: 'Create stunning rainbow effects',
        type: 'video',
        duration: '8 min',
        completed: false
      },
      {
        id: '2-2',
        title: 'Foil Techniques',
        description: 'Add metallic shine to your cards',
        type: 'interactive',
        duration: '10 min',
        completed: false
      },
      {
        id: '2-3',
        title: 'Custom Animations',
        description: 'Create unique motion effects',
        type: 'video',
        duration: '7 min',
        completed: false
      }
    ]
  },
  {
    id: '3',
    title: 'Marketplace Success',
    description: 'Learn how to price and market your cards effectively',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    category: 'Business',
    steps: [
      {
        id: '3-1',
        title: 'Pricing Strategies',
        description: 'Find the sweet spot for your cards',
        type: 'reading',
        duration: '8 min',
        completed: false
      },
      {
        id: '3-2',
        title: 'Building Your Brand',
        description: 'Create a recognizable creator identity',
        type: 'video',
        duration: '12 min',
        completed: false
      }
    ]
  }
];

const InteractiveTutorial = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const typeIcons = {
    video: Video,
    interactive: Rocket,
    reading: BookOpen
  };

  if (selectedTutorial) {
    const currentTutorialStep = selectedTutorial.steps[currentStep];
    const StepIcon = typeIcons[currentTutorialStep.type];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedTutorial(null)}
            className="border-gray-600 text-gray-300"
          >
            ← Back to Tutorials
          </Button>
          <Badge variant="outline" className={difficultyColors[selectedTutorial.difficulty]}>
            {selectedTutorial.difficulty}
          </Badge>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{selectedTutorial.title}</CardTitle>
            <p className="text-gray-400">{selectedTutorial.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            <div className="flex justify-between text-sm text-gray-400">
              <span>Step {currentStep + 1} of {selectedTutorial.steps.length}</span>
              <span>{selectedTutorial.estimatedTime}</span>
            </div>

            {/* Current Step */}
            <div className="bg-gray-700/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <StepIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{currentTutorialStep.title}</h3>
                  <p className="text-gray-400 text-sm">{currentTutorialStep.description}</p>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                {currentTutorialStep.type === 'video' && (
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                      {isPlaying ? 'Pause' : 'Play'} Tutorial
                    </Button>
                  </div>
                )}

                {currentTutorialStep.type === 'interactive' && (
                  <div className="text-center py-8">
                    <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Interactive Exercise</h4>
                    <p className="text-gray-400 mb-4">
                      Follow along with the guided steps to practice this skill
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Start Interactive Session
                    </Button>
                  </div>
                )}

                {currentTutorialStep.type === 'reading' && (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Reading Material</h4>
                    <p className="text-gray-400 mb-4">
                      Essential concepts and strategies to master
                    </p>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      Read Article
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="border-gray-600 text-gray-300"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    if (currentStep < selectedTutorial.steps.length - 1) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      setSelectedTutorial(null);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {currentStep === selectedTutorial.steps.length - 1 ? 'Complete' : 'Next'}
                  <SkipForward className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Learn & Create</h2>
        <p className="text-gray-400">Master card creation with our interactive tutorials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTutorials.map((tutorial) => (
          <Card key={tutorial.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={difficultyColors[tutorial.difficulty]}>
                  {tutorial.difficulty}
                </Badge>
                <span className="text-sm text-gray-400">{tutorial.estimatedTime}</span>
              </div>
              <CardTitle className="text-white text-lg">{tutorial.title}</CardTitle>
              <p className="text-gray-400 text-sm">{tutorial.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{tutorial.steps.length} steps</span>
                  <span>{tutorial.category}</span>
                </div>
                <div className="space-y-1">
                  {tutorial.steps.slice(0, 3).map((step) => {
                    const StepIcon = typeIcons[step.type];
                    return (
                      <div key={step.id} className="flex items-center gap-2 text-sm">
                        <StepIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400">{step.title}</span>
                        {step.completed && <CheckCircle className="w-3 h-3 text-green-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button
                onClick={() => setSelectedTutorial(tutorial)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTutorial;
