
import { useState } from 'react';
import Header from '@/components/Header';
import { CreatorModeSelector } from '@/components/creator/CreatorModeSelector';
import { BasicCRDCreator } from '@/components/creator/BasicCRDCreator';
import { CRDStudio } from '@/components/creator/CRDStudio';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Creator() {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<'selector' | 'basic' | 'studio'>('selector');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-white">Welcome to Creator Portal</h1>
            <p className="text-gray-400 mb-8">
              Join our community of creators and start designing amazing digital trading cards.
            </p>
            <div className="space-y-4">
              <Link to="/auth">
                <Button size="lg" className="bg-[#00C851] hover:bg-[#00A543] text-white px-8 py-3">
                  Sign Up to Start Creating
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Already have an account? <Link to="/auth" className="text-[#00C851] hover:underline">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleModeSelect = (mode: 'basic' | 'studio') => {
    setSelectedMode(mode);
  };

  const handleBackToSelector = () => {
    setSelectedMode('selector');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {selectedMode === 'selector' && <Header />}
      
      {selectedMode === 'selector' && (
        <CreatorModeSelector 
          onModeSelect={handleModeSelect}
          currentMode={undefined}
        />
      )}
      
      {selectedMode === 'basic' && (
        <BasicCRDCreator onBack={handleBackToSelector} />
      )}
      
      {selectedMode === 'studio' && (
        <CRDStudio onBack={handleBackToSelector} />
      )}
    </div>
  );
}
