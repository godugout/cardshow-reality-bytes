
import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: 'Create Your Card',
      description: 'Upload your artwork and choose from professional templates',
      image: '/placeholder.svg',
    },
    {
      title: 'Add 3D Effects',
      description: 'Apply stunning holographic and material effects',
      image: '/placeholder.svg',
    },
    {
      title: 'Share & Trade',
      description: 'List on marketplace or trade with other collectors',
      image: '/placeholder.svg',
    },
  ];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-lg p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">See How It Works</h3>
        <p className="text-gray-400 mb-6">
          Experience the complete card creation and trading process in under 30 seconds
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={startDemo}
            disabled={isPlaying}
            className="bg-[#00C851] hover:bg-[#00A543] text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {isPlaying ? 'Playing Demo...' : 'Start Demo'}
          </Button>
          
          <Button
            onClick={resetDemo}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoSteps.map((step, index) => (
          <Card
            key={index}
            className={`p-6 transition-all duration-500 ${
              currentStep === index
                ? 'bg-[#00C851]/10 border-[#00C851] scale-105'
                : 'bg-[#1a1a1a] border-gray-700'
            }`}
          >
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                currentStep >= index ? 'bg-[#00C851]' : 'bg-gray-600'
              }`}>
                <span className="text-white font-bold">{index + 1}</span>
              </div>
              
              {currentStep === index && (
                <div className="absolute -top-2 -left-2 w-16 h-16 rounded-full border-2 border-[#00C851] animate-pulse" />
              )}
            </div>
            
            <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <h4 className="font-semibold text-white mb-2">{step.title}</h4>
            <p className="text-sm text-gray-400">{step.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DemoSection;
