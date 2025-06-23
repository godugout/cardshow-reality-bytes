
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Cards from "./pages/Cards";
import Collections from "./pages/Collections";
import Gallery from "./pages/Gallery";
import Marketplace from "./pages/Marketplace";
import Trading from "./pages/Trading";
import Creator from "./pages/Creator";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/creator" element={<Creator />} />
                <Route path="/community" element={<Community />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
