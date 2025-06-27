
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import CardshowLogo from "@/components/branding/CardshowLogo";
import ThemeSelector from "@/components/branding/ThemeSelector";
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
    <header className="sticky top-0 z-50 w-full bg-elevated backdrop-blur border-b border-primary shadow-sm">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-max focus:bg-brand focus:text-inverse focus:p-4 focus:rounded focus:m-2"
      >
        Skip to main content
      </a>
      
      <div className="container mx-auto p-6">
        <div className="flex h-20 items-center justify-between">
          <Link 
            to="/" 
            className="focus-ring rounded p-1"
            aria-label="Cardshow Home"
          >
            <CardshowLogo size="md" />
            {isAdminPage && (
              <div className="flex items-center gap-2 ml-4 badge badge--warning">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hide-mobile nav" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  size="sm"
                  className={isActive(item.href) ? "btn btn--primary" : "nav__item"}
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
                  className={
                    isActive(item.href) 
                      ? "btn btn--primary" 
                      : "btn btn--outline text-warning border-warning hover:bg-warning hover:text-inverse"
                  }
                >
                  <Shield className="w-3 h-3 mr-1" aria-hidden="true" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Menu & Controls */}
          <div className="flex items-center gap-4">
            <ThemeSelector />
            
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button className="btn btn--primary">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="show-mobile btn btn--ghost"
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
            className="show-mobile py-6 space-y-2 border-t border-primary bg-elevated animate-fade-in"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className={`w-full justify-start ${
                    isActive(item.href) ? "btn btn--primary" : "nav__item"
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
                  className={`w-full justify-start ${
                    isActive(item.href) 
                      ? "btn btn--primary" 
                      : "btn btn--outline text-warning border-warning"
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
