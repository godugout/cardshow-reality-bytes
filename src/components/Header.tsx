
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
    <header className="sticky top-0 z-50 w-full bg-neutral-950/95 backdrop-blur border-b border-neutral-800 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary-600 rounded-2xl shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className="font-manrope text-headline-4 font-bold text-white tracking-tight">
              Cardshow
            </span>
            {isAdminPage && (
              <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-warning-100/10 rounded-xl border border-warning-500/30">
                <Shield className="h-4 w-4 text-warning-400" />
                <span className="font-space-grotesk text-caption-bold text-warning-300">Admin</span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  size="sm"
                  className={isActive(item.href) 
                    ? "bg-primary hover:bg-primary-600 text-white font-manrope font-semibold" 
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800/50 font-open-sans font-medium"
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
                      ? "bg-warning-500 hover:bg-warning-600 text-white border-warning-500 font-manrope font-semibold" 
                      : "text-warning-400 hover:text-warning-300 border-warning-500/50 hover:bg-warning-500/10 font-open-sans font-medium"
                  }
                >
                  <Shield className="w-3 h-3 mr-1" />
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
              className="md:hidden text-neutral-300 hover:text-white hover:bg-neutral-800/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 space-y-2 border-t border-neutral-800 bg-neutral-950/95">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className={`w-full justify-start font-open-sans font-medium ${
                    isActive(item.href) 
                      ? "bg-primary hover:bg-primary-600 text-white" 
                      : "text-neutral-300 hover:text-white hover:bg-neutral-800/50"
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
                      ? "bg-warning-500 hover:bg-warning-600 text-white border-warning-500" 
                      : "text-warning-400 hover:text-warning-300 border-warning-500/50 hover:bg-warning-500/10"
                  }`}
                  size="sm"
                >
                  <Shield className="w-3 h-3 mr-2" />
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
