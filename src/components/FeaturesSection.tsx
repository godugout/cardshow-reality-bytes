
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Palette, 
  Eye, 
  TrendingUp, 
  Shield, 
  Users,
  Gamepad2,
  Sparkles,
  Zap,
  Globe,
  Trophy
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Palette,
      title: "AI-Powered Creation",
      description: "Create stunning cards with advanced AI tools, professional templates, and intuitive design systems that bring your vision to life.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      icon: Eye,
      title: "Immersive 3D Experience",
      description: "Experience your cards in stunning 3D with realistic lighting, dynamic effects, and interactive viewing that makes every card come alive.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: TrendingUp,
      title: "Dynamic Marketplace",
      description: "Trade and discover rare cards with real-time pricing, advanced analytics, and market insights that help you make informed decisions.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: Shield,
      title: "Blockchain Verified",
      description: "Each card is authenticated and secured with blockchain technology, ensuring provenance, ownership, and protection against fraud.",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10"
    },
    {
      icon: Users,
      title: "Creator Economy",
      description: "Monetize your creativity with our revenue-sharing program, royalty systems, and direct fan engagement tools that reward artistic excellence.",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10"
    },
    {
      icon: Gamepad2,
      title: "Interactive Gaming",
      description: "Use your cards in competitive tournaments, mini-games, and interactive experiences that add utility beyond just collecting.",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/10 to-rose-500/10"
    }
  ];

  const platformBenefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for instant loading and smooth 3D rendering"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with collectors and creators from around the world"
    },
    {
      icon: Trophy,
      title: "Premium Quality",
      description: "Curated collections of high-quality, verified digital artwork"
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(120,119,198,0.3),_rgba(255,255,255,0))]"></div>
      </div>

      <div className="relative z-10 container-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Platform Features</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
              Everything you need
            </span>
            <br />
            <span className="text-slate-600">to create and collect</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover the most advanced digital trading card platform with cutting-edge 
            technology, creator-focused tools, and a passionate global community.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                  {feature.description}
                </p>
              </CardContent>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Platform Benefits */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Cardshow?</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built for creators, collectors, and traders who demand the best in digital collectibles.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {platformBenefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h4>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
