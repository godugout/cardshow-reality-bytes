
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Cards from "./pages/Cards";
import Collections from "./pages/Collections";
import Trading from "./pages/Trading";
import Marketplace from "./pages/Marketplace";
import Creator from "./pages/Creator";
import Community from "./pages/Community";
import Admin from "./pages/Admin";
import Support from "./pages/Support";
import Gallery from "./pages/Gallery";
import BetaLaunch from "./pages/BetaLaunch";
import SecurityDashboard from "./pages/SecurityDashboard";
import Privacy from "./pages/Privacy";
import AdminContentGenerator from "./pages/AdminContentGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/creator" element={<Creator />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/content-generator" element={<AdminContentGenerator />} />
            <Route path="/support" element={<Support />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/beta-launch" element={<BetaLaunch />} />
            <Route path="/security" element={<SecurityDashboard />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
