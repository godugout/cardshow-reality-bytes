
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import InteractiveCardPreview from "@/components/landing/InteractiveCardPreview";
import QuickActionButtons from "@/components/landing/QuickActionButtons";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                Create.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C851] to-[#00FF66]">
                  Collect.
                </span>{" "}
                Trade.
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Enter the future of digital trading cards with stunning 3D visuals, 
                creator monetization, and a thriving marketplace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => navigate(user ? "/creator" : "/auth")}
                className="bg-[#00C851] hover:bg-[#00A543] text-white font-semibold px-8 py-4 text-lg"
              >
                {user ? "Start Creating" : "Get Started Free"}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/marketplace")}
                className="border-[#00C851] text-[#00C851] hover:bg-[#00C851] hover:text-white font-semibold px-8 py-4 text-lg"
              >
                Explore Marketplace
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-[#00C851]">10K+</div>
                <div className="text-sm text-gray-400">Cards Created</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-[#00C851]">2.5K+</div>
                <div className="text-sm text-gray-400">Active Creators</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-[#00C851]">$500K+</div>
                <div className="text-sm text-gray-400">Creator Earnings</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Card Preview */}
          <div className="flex justify-center">
            <InteractiveCardPreview />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What would you like to do?</h2>
            <p className="text-gray-400">Jump right in with these popular actions</p>
          </div>
          <QuickActionButtons />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
