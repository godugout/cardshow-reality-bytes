
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import PageErrorBoundary from "@/components/error-boundaries/PageErrorBoundary";
import Index from "./pages/Index";
import Cards from "./pages/Cards";
import Creator from "./pages/Creator";
import MobileCards from "./pages/MobileCards";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <div className="min-h-screen bg-background relative">
                {/* Subtle Brand Pattern Background */}
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, hsl(var(--brand-collections)) 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                    backgroundPosition: '0 0, 16px 16px'
                  }}
                />
                
                <BrowserRouter>
                  <PageErrorBoundary pageName="Application">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/cards" element={<Cards />} />
                      <Route path="/mobile-cards" element={<MobileCards />} />
                      <Route path="/creator" element={<Creator />} />
                      <Route path="/creators" element={<Creator />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/auth" element={<Auth />} />
                    </Routes>
                  </PageErrorBoundary>
                </BrowserRouter>
              </div>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
