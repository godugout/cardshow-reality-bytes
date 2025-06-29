
import { Suspense, useState, useEffect } from 'react';
import Header from '@/components/Header';
import { CRDStudio } from '@/components/creator/CRDStudio';
import CreatorOnboardingFlow from '@/components/creator/onboarding/CreatorOnboardingFlow';
import { CreatorPageHeader } from '@/components/creator/CreatorPageHeader';
import { CreatorQuickActions } from '@/components/creator/CreatorQuickActions';
import { CreatorProgressOverview } from '@/components/creator/CreatorProgressOverview';
import { useCreatorOnboarding } from '@/hooks/useCreatorOnboarding';
import { useSafeAuth } from '@/hooks/auth/useSafeAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';

const Creator = () => {
  const { user, loading: authLoading, initialized: authInitialized, error: authError } = useSafeAuth();
  const { progress, isLoading: onboardingLoading, error: onboardingError } = useCreatorOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  // Show onboarding for new users or those who haven't completed it
  useEffect(() => {
    if (authInitialized && 
        user && 
        progress && 
        typeof progress.isOnboardingComplete === 'boolean' &&
        !progress.isOnboardingComplete && 
        !onboardingLoading && 
        !onboardingError) {
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

  // Show loading state while auth or onboarding are loading
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
          <CreatorPageHeader 
            onEnterStudio={enterStudio}
            onShowOnboarding={() => setShowOnboarding(true)}
          />

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
            <PageErrorBoundary pageName="Creator Actions">
              <CreatorQuickActions 
                onEnterStudio={enterStudio}
                onShowOnboarding={() => setShowOnboarding(true)}
              />
            </PageErrorBoundary>

            {/* Progress Overview - Only show if user has some progress */}
            {progress?.isOnboardingComplete && (
              <PageErrorBoundary pageName="Creator Progress">
                <CreatorProgressOverview progress={progress} />
              </PageErrorBoundary>
            )}
          </Suspense>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default Creator;
