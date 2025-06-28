
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Sparkles, Trophy, DollarSign, Star, Globe, Award } from 'lucide-react';

const StatsSection = () => {
  const [counters, setCounters] = useState({
    users: 0,
    cards: 0,
    volume: 0,
    creators: 0
  });

  const finalStats = {
    users: 52000,
    cards: 540000,
    volume: 2400000,
    creators: 5200
  };

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounters(prev => ({
        users: Math.min(prev.users + Math.ceil(finalStats.users / steps), finalStats.users),
        cards: Math.min(prev.cards + Math.ceil(finalStats.cards / steps), finalStats.cards),
        volume: Math.min(prev.volume + Math.ceil(finalStats.volume / steps), finalStats.volume),
        creators: Math.min(prev.creators + Math.ceil(finalStats.creators / steps), finalStats.creators)
      }));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
  };

  const mainStats = [
    {
      icon: Users,
      label: "Active Collectors",
      value: formatNumber(counters.users),
      description: "Passionate collectors from 120+ countries building amazing collections",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Sparkles,
      label: "Cards Created",
      value: formatNumber(counters.cards),
      description: "Unique digital masterpieces minted by talented creators worldwide",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      icon: DollarSign,
      label: "Trading Volume",
      value: formatCurrency(counters.volume),
      description: "Total marketplace value exchanged in our thriving economy",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: Trophy,
      label: "Verified Creators",
      value: formatNumber(counters.creators),
      description: "Professional artists earning sustainable income from their art",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10"
    }
  ];

  const achievementStats = [
    { icon: Globe, label: "Global Reach", value: "120+ Countries", color: "text-blue-400" },
    { icon: Award, label: "Awards Won", value: "15 Industry", color: "text-yellow-400" },
    { icon: Star, label: "User Rating", value: "4.9/5 Stars", color: "text-purple-400" },
    { icon: TrendingUp, label: "Growth Rate", value: "300% YoY", color: "text-green-400" }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 container-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Community Impact</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Powering the future
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              of digital collecting
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join a thriving ecosystem where creators earn, collectors discover treasures, 
            and digital art reaches new heights of value and appreciation.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainStats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-4xl font-black text-white mb-2 group-hover:text-slate-100 transition-colors">
                  {stat.value}
                </div>
                
                <div className="text-lg font-semibold text-slate-300 mb-3 group-hover:text-slate-200 transition-colors">
                  {stat.label}
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {stat.description}
                </p>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
              
              {/* Floating Stars */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Stats */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-8 mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievementStats.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-700/50 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{achievement.value}</div>
                <div className="text-sm text-slate-400">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 cursor-pointer">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Be part of this revolution</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
