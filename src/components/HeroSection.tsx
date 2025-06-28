
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star, Zap, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentCard, setCurrentCard] = useState(0);
  
  const featuredCards = [
    {
      id: 1,
      title: "Legendary Phoenix",
      rarity: "legendary",
      image: "/placeholder.svg",
      glow: "from-orange-500 to-red-500"
    },
    {
      id: 2,
      title: "Epic Dragon",
      rarity: "epic",
      image: "/placeholder.svg",
      glow: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Mythic Warrior",
      rarity: "mythic",
      image: "/placeholder.svg",
      glow: "from-blue-500 to-cyan-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % featuredCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container-xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Premium Digital Trading Cards</span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Collect
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Create
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Conquer
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl">
              Enter the future of digital collectibles with stunning 3D cards, 
              immersive experiences, and a thriving creator economy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/cards">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Collecting
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Link to="/creator">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group border-2 border-purple-400/50 bg-slate-900/50 backdrop-blur-sm hover:bg-purple-500/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:text-purple-400 transition-colors" />
                  Create Cards
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-slate-400 text-sm">Active Collectors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  500K+
                </div>
                <div className="text-slate-400 text-sm">Cards Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  $2M+
                </div>
                <div className="text-slate-400 text-sm">Creator Earnings</div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Cards */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Featured Card */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${featuredCards[currentCard].glow} opacity-50 blur-2xl rounded-3xl animate-pulse`}></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 shadow-2xl transform hover:scale-105 transition-all duration-500">
                  <div className="aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Star className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {featuredCards[currentCard].title}
                      </h3>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        {featuredCards[currentCard].rarity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-slate-300">
                      <div className="text-sm">Current Value</div>
                      <div className="text-2xl font-bold text-white">$1,250</div>
                    </div>
                    <div className="text-right text-slate-300">
                      <div className="text-sm">Rarity</div>
                      <div className="text-lg font-semibold text-purple-400">
                        {featuredCards[currentCard].rarity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {featuredCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCard(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentCard 
                        ? 'bg-purple-500 shadow-lg shadow-purple-500/50' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
