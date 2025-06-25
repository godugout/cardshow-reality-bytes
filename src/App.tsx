
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Cards from "./pages/Cards";
import Collections from "./pages/Collections";
import Gallery from "./pages/Gallery";
import Marketplace from "./pages/Marketplace";
import Trading from "./pages/Trading";
import Creator from "./pages/Creator";
import Community from "./pages/Community";
import Support from "./pages/Support";
import Admin from "./pages/Admin";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Suspense 
                fallback={
                  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={
                    <ErrorBoundary>
                      <Profile />
                    </ErrorBoundary>
                  } />
                  <Route path="/cards" element={
                    <ErrorBoundary>
                      <Cards />
                    </ErrorBoundary>
                  } />
                  <Route path="/collections" element={
                    <ErrorBoundary>
                      <Collections />
                    </ErrorBoundary>
                  } />
                  <Route path="/collections/:collectionId/gallery" element={
                    <ErrorBoundary>
                      <Gallery />
                    </ErrorBoundary>
                  } />
                  <Route path="/marketplace" element={
                    <ErrorBoundary>
                      <Marketplace />
                    </ErrorBoundary>
                  } />
                  <Route path="/trading" element={
                    <ErrorBoundary>
                      <Trading />
                    </ErrorBoundary>
                  } />
                  <Route path="/creator" element={
                    <ErrorBoundary>
                      <Creator />
                    </ErrorBoundary>
                  } />
                  <Route path="/community" element={
                    <ErrorBoundary>
                      <Community />
                    </ErrorBoundary>
                  } />
                  <Route path="/support" element={
                    <ErrorBoundary>
                      <Support />
                    </ErrorBoundary>
                  } />
                  <Route path="/admin" element={
                    <ErrorBoundary>
                      <Admin />
                    </ErrorBoundary>
                  } />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
