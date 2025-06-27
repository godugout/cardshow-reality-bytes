
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import { Menu, X, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/cards", label: "Cards" },
    { href: "/collections", label: "Collections" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/trading", label: "Trading" },
    { href: "/creator", label: "Creator" },
    { href: "/community", label: "Community" },
    { href: "/gallery", label: "Gallery" },
  ];

  const adminItems = [
    { href: "/admin", label: "Admin", isAdmin: true },
    { href: "/admin/content-generator", label: "Content Gen", isAdmin: true }
  ];

  const isActive = (path: string) => location.pathname === path;
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-max focus:bg-primary focus:text-primary-foreground focus:p-4 focus:rounded focus:m-2"
      >
        Skip to main content
      </a>
      
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo as Primary Navigation */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-lg p-2 -m-2 transition-all"
            >
              {/* Clean, Minimal Logo */}
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2s-.9-2-2-2c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 1.1.9 2 2 2s2-.9 2-2c0-5.52-4.48-10-10-10z"/>
                  </svg>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground font-display group-hover:text-primary transition-colors">
                  Cardshow
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Digital Trading Cards
                </span>
              </div>
            </Link>
            
            {/* Admin Badge */}
            {isAdminPage && (
              <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Admin</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation - Simplified */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  size="sm"
                  className={`
                    transition-all relative
                    ${isActive(item.href) 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Button>
              </Link>
            ))}
            
            {/* Admin Navigation */}
            {user && adminItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "destructive" : "outline"} 
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  <Shield className="w-3 h-3 mr-1" aria-hidden="true" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button className="shadow-sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-accent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="lg:hidden pb-6 pt-4 space-y-2 border-t border-border/50 bg-card/50 animate-fade-in backdrop-blur-sm"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className="w-full justify-start text-left"
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Admin Navigation for Mobile */}
            {user && adminItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive(item.href) ? "destructive" : "outline"} 
                  className="w-full justify-start border-destructive/30 text-destructive"
                  size="sm"
                >
                  <Shield className="w-3 h-3 mr-2" aria-hidden="true" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
