
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Cards from "./pages/Cards";
import Creator from "./pages/Creator";
import MobileCards from "./pages/MobileCards";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

function App() {
  return (
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
            <BrowserRouter>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/cards" element={<Cards />} />
                  <Route path="/mobile-cards" element={<MobileCards />} />
                  <Route path="/creator" element={<Creator />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/auth" element={<Auth />} />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
