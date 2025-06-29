
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModernCard } from '@/components/ui/modern-card';
import { Play, Sparkles, Zap, Trophy, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0F0F0F]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,200,81,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,165,67,0.08)_0%,transparent_50%)]" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#00C851]/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-[#00A543]/8 blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <Badge className="bg-[#00C851]/20 text-[#00C851] border-0 px-4 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Gen Digital Collectibles
            </Badge>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                <span className="text-white">Create</span>
                <br />
                <span className="gradient-text">Extraordinary</span>
                <br />
                <span className="text-white">Digital Cards</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Transform your creativity into stunning 3D digital collectibles. 
                Create, trade, and showcase your cards in our premium platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/creator">
                <Button className="modern-button text-lg px-10 py-6">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              
              <Link to="/gallery">
                <Button className="modern-button-outline text-lg px-10 py-6">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">25K+</div>
                <div className="text-sm text-muted-foreground">Cards Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">8K+</div>
                <div className="text-sm text-muted-foreground">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">$2M+</div>
                <div className="text-sm text-muted-foreground">Volume Traded</div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Featured Card 1 - Sports Figure */}
              <ModernCard variant="glow" interactive className="p-6 space-y-4">
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Trophy className="w-12 h-12 text-[#00C851] mx-auto" />
                    <div className="text-sm font-semibold">Baseball Legend</div>
                    <Badge variant="secondary" className="bg-[#00C851]/20 text-[#00C851]">
                      Ultra Rare
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Championship Series</h3>
                  <p className="text-sm text-muted-foreground">Limited Edition</p>
                </div>
              </ModernCard>

              {/* Featured Card 2 - Basketball Figure */}
              <ModernCard variant="glass" interactive className="p-6 space-y-4 mt-8">
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Users className="w-12 h-12 text-[#00A543] mx-auto" />
                    <div className="text-sm font-semibold">Basketball Elite</div>
                    <Badge variant="secondary" className="bg-[#00A543]/20 text-[#00A543]">
                      Legendary
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">All-Star Collection</h3>
                  <p className="text-sm text-muted-foreground">Premium Series</p>
                </div>
              </ModernCard>

              {/* Featured Card 3 - Group Collection */}
              <ModernCard variant="elevated" interactive className="p-6 space-y-4 col-span-2">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Sparkles className="w-16 h-16 text-[#00C851] mx-auto" />
                    <div className="text-lg font-bold">Dream Team Collection</div>
                    <Badge variant="secondary" className="bg-gradient-primary text-white px-4 py-1">
                      Exclusive Set
                    </Badge>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">Premium Collectible Set</h3>
                  <p className="text-muted-foreground">Three legendary figures in one exclusive pack</p>
                  <div className="flex justify-center gap-2 pt-2">
                    <Badge variant="outline" className="border-[#00C851] text-[#00C851]">3D Animated</Badge>
                    <Badge variant="outline" className="border-[#00A543] text-[#00A543]">Interactive</Badge>
                  </div>
                </div>
              </ModernCard>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-[#00C851]/20 blur-xl animate-bounce" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#00A543]/20 blur-xl animate-bounce delay-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
