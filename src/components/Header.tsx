
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import { Menu, X, Sparkles, Shield } from "lucide-react";
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

  // Admin routes - only show if user is authenticated
  const adminItems = [
    { href: "/admin", label: "Admin", isAdmin: true },
    { href: "/admin/content-generator", label: "Content Gen", isAdmin: true }
  ];

  const isActive = (path: string) => location.pathname === path;
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border shadow-sm">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:m-2"
      >
        Skip to main content
      </a>
      
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
            aria-label="Cardshow Home"
          >
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary-600 rounded-2xl shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className="font-manrope text-headline-4 font-bold text-foreground tracking-tight">
              Cardshow
            </span>
            {isAdminPage && (
              <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-warning-50 rounded-xl border border-warning-200">
                <Shield className="h-4 w-4 text-warning-600" />
                <span className="font-space-grotesk text-caption-bold text-warning-700">Admin</span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  size="sm"
                  className={isActive(item.href) 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground font-manrope font-semibold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent font-open-sans font-medium"
                  }
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Admin Navigation - only show if user is authenticated */}
            {user && adminItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "outline"} 
                  size="sm"
                  className={
                    isActive(item.href) 
                      ? "bg-warning hover:bg-warning/90 text-warning-foreground border-warning font-manrope font-semibold" 
                      : "text-warning hover:text-warning/90 border-warning/50 hover:bg-warning/10 font-open-sans font-medium"
                  }
                >
                  <Shield className="w-3 h-3 mr-1" aria-hidden="true" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button className="font-manrope font-semibold">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="md:hidden py-6 space-y-2 border-t border-border bg-background/95"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className={`w-full justify-start font-open-sans font-medium ${
                    isActive(item.href) 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
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
                  variant={isActive(item.href) ? "default" : "outline"} 
                  className={`w-full justify-start font-open-sans font-medium ${
                    isActive(item.href) 
                      ? "bg-warning hover:bg-warning/90 text-warning-foreground border-warning" 
                      : "text-warning hover:text-warning/90 border-warning/50 hover:bg-warning/10"
                  }`}
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
