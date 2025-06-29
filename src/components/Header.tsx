
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Sparkles, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Cards', href: '/cards' },
    { name: 'Collections', href: '/collections' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Creator', href: '/creator' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Community', href: '/community' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-panel">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Cardshow</span>
                <span className="text-xs text-slate-300">Digital Collectibles</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'px-4 py-2 rounded-xl font-medium transition-all duration-300 text-white',
                    isActive(item.href)
                      ? 'bg-[#00C851] text-white shadow-lg shadow-[#00C851]/30'
                      : 'text-slate-200 hover:text-white hover:bg-white/15'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="rounded-xl text-white hover:bg-white/15">
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl text-white hover:bg-white/15">
                    <User className="w-4 h-4" />
                  </Button>
                  <Badge className="bg-[#00C851]/30 text-[#00C851] border border-[#00C851]/40 backdrop-blur-sm">
                    {user.email}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/auth">
                    <Button variant="ghost" className="rounded-xl text-white hover:bg-white/15">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-[#00C851] hover:bg-[#00C851]/90 text-white rounded-xl">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden rounded-xl text-white hover:bg-white/15"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="glass-panel border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <nav className="flex flex-col gap-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'px-4 py-3 rounded-xl font-medium transition-all duration-300',
                      isActive(item.href)
                        ? 'bg-[#00C851] text-white'
                        : 'text-slate-200 hover:text-white hover:bg-white/15'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
