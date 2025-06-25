
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import InteractiveCardPreview from "@/components/landing/InteractiveCardPreview";
import QuickActionButtons from "@/components/landing/QuickActionButtons";
import AnimatedParticles from "@/components/landing/AnimatedParticles";
import MagneticButton from "@/components/landing/MagneticButton";
import TypewriterText from "@/components/landing/TypewriterText";
import AnimatedCounter from "@/components/landing/AnimatedCounter";
import EarningsSimulator from "@/components/landing/EarningsSimulator";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const typewriterWords = ["Create.", "Collect.", "Trade.", "Earn."];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
      {/* Animated Background */}
      <AnimatedParticles />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" style={{ zIndex: 2 }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                <TypewriterText 
                  words={typewriterWords}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C851] to-[#00FF66]"
                />
                <br />
                <span className="animate-fade-in">Your Digital Cards</span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
                Enter the future of digital trading cards with stunning 3D visuals, 
                creator monetization, and a thriving marketplace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '1s' }}>
              <MagneticButton
                size="lg"
                onClick={() => navigate(user ? "/creator" : "/auth")}
                className="bg-[#00C851] hover:bg-[#00A543] text-white font-semibold px-8 py-4 text-lg shadow-lg"
              >
                {user ? "Start Creating" : "Get Started Free"}
              </MagneticButton>
              
              <MagneticButton
                size="lg"
                variant="outline"
                onClick={() => navigate("/marketplace")}
                className="border-[#00C851] text-[#00C851] hover:bg-[#00C851] hover:text-white font-semibold px-8 py-4 text-lg"
              >
                Explore Marketplace
              </MagneticButton>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800 animate-fade-in" style={{ animationDelay: '1.5s' }}>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-[#00C851]">
                  <AnimatedCounter end={10} suffix="K+" />
                </div>
                <div className="text-sm text-gray-400">Cards Created</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-[#00C851]">
                  <AnimatedCounter end={2.5} suffix="K+" />
                </div>
                <div className="text-sm text-gray-400">Active Creators</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-[#00C851]">
                  $<AnimatedCounter end={500} suffix="K+" />
                </div>
                <div className="text-sm text-gray-400">Creator Earnings</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Card Preview */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '2s' }}>
            <InteractiveCardPreview />
          </div>
        </div>

        {/* Earnings Simulator Section */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: '2.5s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Calculate Your Potential</h2>
            <p className="text-gray-400">See how much you could earn as a creator</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <EarningsSimulator />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: '3s' }}>
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
