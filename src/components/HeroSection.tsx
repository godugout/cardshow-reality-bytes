
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C851]/10 via-transparent to-[#00A543]/5" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement Badge */}
          <Badge className="mb-8 bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30 hover:bg-[#00C851]/30">
            <Zap className="w-3 h-3 mr-1" />
            Now in Beta - Join Early Access
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Create. Collect.
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              Render Reality.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            The first digital trading card platform that empowers creators with 3D visualization, 
            real-time trading, and fair monetization tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="bg-[#00C851] hover:bg-[#00A543] text-white px-8 py-4 text-lg">
              Start Creating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-[#00C851]/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-white rounded-md opacity-90" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3D Card Rendering</h3>
              <p className="text-gray-400 text-sm">
                Experience your cards in stunning 3D with interactive physics and lighting effects
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-[#00C851]/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-white rounded-md opacity-90" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Creator Tools</h3>
              <p className="text-gray-400 text-sm">
                Design, mint, and monetize your digital cards with our intuitive creation suite
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-[#00C851]/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-white rounded-md opacity-90" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Marketplace</h3>
              <p className="text-gray-400 text-sm">
                Trade cards in real-time with secure transactions and instant settlements
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
