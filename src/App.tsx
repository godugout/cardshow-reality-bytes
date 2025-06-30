
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
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-800 relative">
                {/* Tech Pattern Overlay */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300C851' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />
                
                {/* Circuit Pattern Accent */}
                <div 
                  className="absolute top-0 right-0 w-1/3 h-1/3 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%2300C851' stroke-width='0.5'/%3E%3Cpath d='M30 30h40v40H30z' fill='none' stroke='%2300C851' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='8' fill='none' stroke='%2300C851' stroke-width='0.5'/%3E%3C/svg%3E")`
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
