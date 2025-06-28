
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Zap, Trophy } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 pt-20 pb-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container-xl relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                <Sparkles className="w-4 h-4" />
                Next-Gen Digital Trading Cards
              </div>
              
              <h1 className="text-display-2xl bg-gradient-to-r from-foreground via-primary to-accent-purple-500 bg-clip-text text-transparent leading-tight">
                Create, Trade & Collect
                <br />
                <span className="text-display-xl">Digital Trading Cards</span>
              </h1>
              
              <p className="text-body-xl text-muted-foreground max-w-2xl leading-relaxed">
                Join the future of collectibles with our advanced 3D card creation platform. 
                Design stunning cards, build your collection, and trade with creators worldwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/creator">
                <Button size="xl" className="gap-3 group">
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start Creating
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/cards">
                <Button variant="outline" size="xl" className="gap-3">
                  <Trophy className="w-5 h-5" />
                  Explore Cards
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/20">
              <div className="text-center">
                <div className="text-display-sm text-primary font-bold">50K+</div>
                <div className="text-body-sm text-muted-foreground">Cards Created</div>
              </div>
              <div className="text-center">
                <div className="text-display-sm text-accent-purple-500 font-bold">10K+</div>
                <div className="text-body-sm text-muted-foreground">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-display-sm text-accent-emerald-500 font-bold">1M+</div>
                <div className="text-body-sm text-muted-foreground">Trades Completed</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-2 gap-6 rotate-6 hover:rotate-3 transition-transform duration-700">
              <div className="space-y-6">
                <Card 
                  variant="premium" 
                  className="aspect-card p-6 bg-gradient-to-br from-primary/20 to-accent-purple-500/20 border-primary/30 hover-lift"
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Legendary</h3>
                      <p className="text-sm text-muted-foreground">Ultra Rare</p>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  variant="glass" 
                  className="aspect-card p-6 hover-lift"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="w-12 h-12 bg-accent-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-accent-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Champion</h3>
                      <p className="text-sm text-muted-foreground">Epic Card</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="space-y-6 mt-12">
                <Card 
                  variant="glass" 
                  className="aspect-card p-6 hover-lift"
                  style={{ animationDelay: '0.6s' }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="w-12 h-12 bg-accent-pink-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-accent-pink-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Lightning</h3>
                      <p className="text-sm text-muted-foreground">Rare Find</p>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  variant="premium" 
                  className="aspect-card p-6 bg-gradient-to-br from-accent-amber-500/20 to-accent-pink-500/20 border-accent-amber-500/30 hover-lift"
                  style={{ animationDelay: '0.8s' }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="w-12 h-12 bg-accent-amber-500/20 rounded-xl flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-accent-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Phoenix</h3>
                      <p className="text-sm text-muted-foreground">Mythic</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-accent-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-accent-emerald-500/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
