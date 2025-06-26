
import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import IntegrationDebugPanel from "@/components/IntegrationDebugPanel";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";

const Index = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <Footer />
      
      {/* Debug Panel Toggle (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <Button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="fixed bottom-4 right-4 z-50"
            variant="outline"
            size="sm"
          >
            <Bug className="w-4 h-4 mr-2" />
            Debug
          </Button>
          
          {showDebugPanel && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="relative max-w-6xl w-full max-h-[90vh] overflow-auto">
                <Button
                  onClick={() => setShowDebugPanel(false)}
                  className="absolute top-4 right-4 z-10"
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
                <IntegrationDebugPanel />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;
