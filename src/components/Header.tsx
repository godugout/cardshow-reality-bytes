
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import LogoThemeSelector from "@/components/branding/LogoThemeSelector";
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
    <header className="sticky top-0 z-50 w-full bg-card backdrop-blur border-b border-border shadow-sm">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-max focus:bg-primary focus:text-primary-foreground focus:p-4 focus:rounded focus:m-2"
      >
        Skip to main content
      </a>
      
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
              <LogoThemeSelector />
            </Link>
            
            {isAdminPage && (
              <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Admin</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  size="sm"
                  className="transition-colors"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Admin Navigation */}
            {user && adminItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "outline"} 
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Shield className="w-3 h-3 mr-1" aria-hidden="true" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Menu & Controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button>
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
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
            className="md:hidden py-6 space-y-2 border-t border-border bg-card animate-fade-in"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className="w-full justify-start"
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
                  className="w-full justify-start border-destructive text-destructive"
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
