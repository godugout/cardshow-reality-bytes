
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Sparkles, 
  Zap, 
  Crown, 
  ArrowRight,
  Check,
  Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface CreatorModeSelectorProps {
  onModeSelect: (mode: 'basic' | 'studio') => void;
  currentMode?: 'basic' | 'studio';
}

export const CreatorModeSelector = ({ onModeSelect, currentMode }: CreatorModeSelectorProps) => {
  const { user } = useAuth();
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  const studioUnlocked = true; // TODO: Check user progress/achievements

  const basicFeatures = [
    'Pre-designed frame templates',
    'Basic photo upload & cropping',
    'Simple text overlay',
    'Color theme selection',
    'Logo placement',
    'Export in standard formats'
  ];

  const studioFeatures = [
    'Advanced 3D rendering',
    'Custom frame creation',
    'Professional lighting controls',
    'Material & texture editor',
    'Element marketplace access',
    'Create & sell custom elements',
    'Advanced export options',
    'Collaboration tools'
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Creative Path
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select the creation mode that matches your skill level and goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic CRD Mode */}
          <Card 
            className={`bg-gray-900/50 border-2 transition-all duration-300 cursor-pointer ${
              currentMode === 'basic' 
                ? 'border-[#00C851] shadow-lg shadow-[#00C851]/20' 
                : hoveredMode === 'basic'
                ? 'border-gray-600 shadow-lg'
                : 'border-gray-800 hover:border-gray-700'
            }`}
            onMouseEnter={() => setHoveredMode('basic')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => onModeSelect('basic')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                  <Palette className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                Create CRD
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Basic
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Perfect for beginners and quick card creation
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {basicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                size="lg"
              >
                Start Creating <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* CRD Studio Mode */}
          <Card 
            className={`bg-gray-900/50 border-2 transition-all duration-300 cursor-pointer relative ${
              currentMode === 'studio' 
                ? 'border-[#00C851] shadow-lg shadow-[#00C851]/20' 
                : hoveredMode === 'studio'
                ? 'border-gray-600 shadow-lg'
                : 'border-gray-800 hover:border-gray-700'
            }`}
            onMouseEnter={() => setHoveredMode('studio')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => studioUnlocked && onModeSelect('studio')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-2xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                CRD Studio
                <Badge variant="secondary" className="bg-gradient-to-r from-[#00C851] to-[#00A543] text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Professional tools for advanced creators
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {studioFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-300">
                    {studioUnlocked ? (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${!studioUnlocked ? 'text-gray-500' : ''}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full ${
                  studioUnlocked 
                    ? 'bg-gradient-to-r from-[#00C851] to-[#00A543] hover:from-[#00A543] hover:to-[#008B37]'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
                size="lg"
                disabled={!studioUnlocked}
              >
                {studioUnlocked ? (
                  <>
                    Enter Studio <Zap className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock Studio
                  </>
                )}
              </Button>
            </CardContent>

            {!studioUnlocked && (
              <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 font-medium mb-2">Studio Mode Locked</p>
                  <p className="text-gray-500 text-sm">Create 5 cards in Basic mode to unlock</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            You can switch between modes anytime. All your creations are saved.
          </p>
        </div>
      </div>
    </div>
  );
};
