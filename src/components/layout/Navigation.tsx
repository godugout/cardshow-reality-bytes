
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, Bell, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import LogoThemeSelector from '@/components/branding/LogoThemeSelector';
import ThemeSelector from '@/components/branding/ThemeSelector';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Cards', href: '/cards', icon: Sparkles },
    { name: 'Creator', href: '/creator', icon: User },
    { name: 'Marketplace', href: '/marketplace', icon: Search },
    { name: 'Community', href: '/community', icon: Bell },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Main Navigation Bar with Enhanced Styling */}
      <div className="bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container-xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Brand Section */}
            <div className="flex items-center">
              <LogoThemeSelector variant="descriptive" className="hover:scale-105 transition-transform duration-200" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                      active
                        ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:shadow-sm'
                    )}
                  >
                    <Icon className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      active ? 'text-primary' : 'group-hover:scale-110'
                    )} />
                    <span className="font-medium">{item.name}</span>
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions Section */}
            <div className="flex items-center space-x-3">
              <ThemeSelector />
              
              {user ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 hover:bg-accent/80 rounded-xl transition-all duration-200 hover:shadow-sm"
                >
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                </Button>
              ) : (
                <Link to="/auth">
                  <Button 
                    size="sm" 
                    className="text-sm font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-accent/80 rounded-xl transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-xl border-b border-border/50 shadow-lg">
          <div className="container-xl mx-auto px-6 py-6">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:shadow-sm'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200',
                      active ? 'bg-primary/10' : 'bg-muted/50'
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {!user && (
                <div className="pt-4 mt-4 border-t border-border/50">
                  <Link
                    to="/auth"
                    className="flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
