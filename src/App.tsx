
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/auth/AuthProvider';
import { FeatureFlagsProvider } from '@/hooks/useFeatureFlags';
import { ErrorBoundary } from 'react-error-boundary';
import AppErrorFallback from '@/components/error-boundaries/AppErrorFallback';

// Lazy loading components
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Cards = lazy(() => import('@/pages/Cards'));
const Collections = lazy(() => import('@/pages/Collections'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Creator = lazy(() => import('@/pages/Creator'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const Community = lazy(() => import('@/pages/Community'));
const EnhancedCommunity = lazy(() => import('@/pages/EnhancedCommunity'));
const Trading = lazy(() => import('@/pages/Trading'));
const Profile = lazy(() => import('@/pages/Profile'));
const Support = lazy(() => import('@/pages/Support'));
const Admin = lazy(() => import('@/pages/Admin'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0F0F0F] flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FeatureFlagsProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0F0F0F]">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/cards" element={<Cards />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/creator" element={<Creator />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community-enhanced" element={<EnhancedCommunity />} />
                    <Route path="/trading" element={<Trading />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </BrowserRouter>
          </FeatureFlagsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
