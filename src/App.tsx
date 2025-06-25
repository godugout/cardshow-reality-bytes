import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Cards from '@/pages/Cards';
import Collections from '@/pages/Collections';
import Marketplace from '@/pages/Marketplace';
import Trading from '@/pages/Trading';
import Creator from '@/pages/Creator';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import Gallery from '@/pages/Gallery';
import Admin from '@/pages/Admin';
import Privacy from '@/pages/Privacy';
import Support from '@/pages/Support';
import BetaLaunch from '@/pages/BetaLaunch';
import SecurityDashboard from '@/pages/SecurityDashboard';
import NotFound from '@/pages/NotFound';
import Discover from '@/pages/Discover';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Support />} />
          <Route path="/beta-launch" element={<BetaLaunch />} />
          <Route path="/security" element={<SecurityDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
