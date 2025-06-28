
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
    <nav className="nav-base">
      <div className="nav-container">
        {/* Brand */}
        <LogoThemeSelector variant="descriptive" />

        {/* Desktop Navigation */}
        <div className="nav-menu">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'nav-item',
                  isActive(item.href) && 'active'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <ThemeSelector />
          
          {user ? (
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.email}</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="nav-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-menu animate-slide-in-down">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'nav-mobile-item',
                  isActive(item.href) && 'active'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
