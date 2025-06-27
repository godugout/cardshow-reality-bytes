
import { Suspense, useState, useEffect } from 'react';
import Header from '@/components/Header';
import { CRDStudio } from '@/components/creator/CRDStudio';
import CreatorOnboardingFlow from '@/components/creator/onboarding/CreatorOnboardingFlow';
import { useCreatorOnboarding } from '@/hooks/useCreatorOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Rocket, Users } from 'lucide-react';

const Creator = () => {
  const { user } = useAuth();
  const { progress } = useCreatorOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  // Show onboarding for new users or those who haven't completed it
  useEffect(() => {
    if (user && !progress.isOnboardingComplete) {
      setShowOnboarding(true);
    }
  }, [user, progress.isOnboardingComplete]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowStudio(true);
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
  };

  const enterStudio = () => {
    setShowStudio(true);
  };

  const exitStudio = () => {
    setShowStudio(false);
  };

  // Show CRD Studio if user is in studio mode
  if (showStudio) {
    return <CRDStudio onBack={exitStudio} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Onboarding Flow */}
      {showOnboarding && (
        <CreatorOnboardingFlow 
          onClose={handleOnboardingClose}
          onComplete={handleOnboardingComplete}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 font-display">
            Creator Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Design, create, and monetize your digital trading cards with professional tools and a thriving community
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        }>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={enterStudio}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Enter Studio</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access the full creator toolkit with advanced design features
                </p>
                <Button className="w-full">
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Studio
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Join Community</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other creators and share your work
                </p>
                <Button variant="outline" className="w-full">
                  Explore Community
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Quick Tutorial</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn the basics or refresh your skills
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowOnboarding(true)}
                >
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview - Only show if user has some progress */}
          {progress.isOnboardingComplete && (
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-8">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Your Creator Journey</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {progress.hasCreatedCard ? '✓' : '○'}
                    </div>
                    <div className="text-sm text-muted-foreground">First Card</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {progress.hasPublishedCard ? '✓' : '○'}
                    </div>
                    <div className="text-sm text-muted-foreground">Published</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">○</div>
                    <div className="text-sm text-muted-foreground">First Sale</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">○</div>
                    <div className="text-sm text-muted-foreground">Community</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Creator;
