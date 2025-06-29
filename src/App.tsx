
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { FeatureFlagsProvider } from "@/hooks/useFeatureFlags";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Cards from "./pages/Cards";
import Collections from "./pages/Collections";
import Gallery from "./pages/Gallery";
import Creator from "./pages/Creator";
import Trading from "./pages/Trading";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Admin from "./pages/Admin";
import AdminContentGenerator from "./pages/AdminContentGenerator";
import BetaLaunch from "./pages/BetaLaunch";
import SecurityDashboard from "./pages/SecurityDashboard";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import MobileCards from "./pages/MobileCards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FeatureFlagsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/creator" element={<Creator />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/community" element={<Community />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/content-generator" element={<AdminContentGenerator />} />
              <Route path="/admin/beta-launch" element={<BetaLaunch />} />
              <Route path="/admin/security" element={<SecurityDashboard />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/mobile/cards" element={<MobileCards />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FeatureFlagsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
