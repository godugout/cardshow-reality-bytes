import { Suspense, useState, useEffect } from 'react';
import Header from '@/components/Header';
import { CRDStudio } from '@/components/creator/CRDStudio';
import CreatorOnboardingFlow from '@/components/creator/onboarding/CreatorOnboardingFlow';
import { useCreatorOnboarding } from '@/hooks/useCreatorOnboarding';
import { useSafeAuth } from '@/hooks/auth/useSafeAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Rocket, Users, AlertCircle } from 'lucide-react';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';

const Creator = () => {
  const { user, loading: authLoading, initialized: authInitialized, error: authError } = useSafeAuth();
  const { progress, isLoading: onboardingLoading, error: onboardingError } = useCreatorOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  // Show onboarding for new users or those who haven't completed it
  useEffect(() => {
    if (authInitialized && user && progress && !progress.isOnboardingComplete && !onboardingLoading && !onboardingError) {
      console.log('Creator: Showing onboarding for user');
      setShowOnboarding(true);
    }
  }, [authInitialized, user, progress, onboardingLoading, onboardingError]);

  const handleOnboardingComplete = () => {
    console.log('Creator: Onboarding completed');
    setShowOnboarding(false);
    setShowStudio(true);
  };

  const handleOnboardingClose = () => {
    console.log('Creator: Onboarding closed');
    setShowOnboarding(false);
  };

  const enterStudio = () => {
    console.log('Creator: Entering studio');
    setShowStudio(true);
  };

  const exitStudio = () => {
    console.log('Creator: Exiting studio');
    setShowStudio(false);
  };

  // Show loading state while auth or onboarding is loading
  if (authLoading || !authInitialized || onboardingLoading) {
    return (
      <PageErrorBoundary pageName="Creator Loading">
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  // Show error state if auth or onboarding failed to load
  if (authError || onboardingError) {
    return (
      <PageErrorBoundary pageName="Creator Error">
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {authError && `Authentication error: ${authError}`}
                {onboardingError && `Onboarding error: ${onboardingError}`}
              </AlertDescription>
            </Alert>
            <div className="text-center mt-8">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  // Show CRD Studio if user is in studio mode
  if (showStudio) {
    return (
      <PageErrorBoundary pageName="CRD Studio">
        <CRDStudio onBack={exitStudio} />
      </PageErrorBoundary>
    );
  }

  return (
    <PageErrorBoundary pageName="Creator">
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Onboarding Flow */}
        {showOnboarding && progress && (
          <PageErrorBoundary pageName="Creator Onboarding">
            <CreatorOnboardingFlow 
              onClose={handleOnboardingClose}
              onComplete={handleOnboardingComplete}
            />
          </PageErrorBoundary>
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
            <PageErrorBoundary pageName="Creator Actions">
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
            </PageErrorBoundary>

            {/* Progress Overview - Only show if user has some progress */}
            {progress?.isOnboardingComplete && (
              <PageErrorBoundary pageName="Creator Progress">
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
              </PageErrorBoundary>
            )}
          </Suspense>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default Creator;
