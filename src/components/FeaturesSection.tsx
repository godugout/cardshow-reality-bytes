
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Users, TrendingUp, Zap, Shield, Globe } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Palette,
      title: "Creator Studio",
      description: "Design stunning cards with our AI-powered tools, 3D templates, and collaborative workspace.",
      badge: "70/30 Revenue Split",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with collectors, showcase your work, and build your following in dedicated creator spaces.",
      badge: "Social Features",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Smart Trading",
      description: "Real-time market analytics, price predictions, and automated trading suggestions.",
      badge: "AI-Powered",
      gradient: "from-[#00C851] to-[#00A543]"
    },
    {
      icon: Zap,
      title: "Instant Rendering",
      description: "View and interact with cards in real-time 3D. Rotate, zoom, and explore every detail.",
      badge: "WebGL 3D",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Secure Ownership",
      description: "Blockchain-verified authenticity with secure wallet integration and fraud protection.",
      badge: "Verified",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Trade with collectors worldwide. Multi-currency support and instant settlements.",
      badge: "Worldwide",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30">
            Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              dominate
            </span>{" "}
            the market
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            From creation to collection, our platform provides all the tools you need 
            to succeed in the digital trading card revolution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gray-900/50 border-gray-800 hover:border-[#00C851]/50 transition-all duration-300 group hover:scale-105"
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                    {feature.badge}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#00C851] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
