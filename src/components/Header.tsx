
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-[#00C851]" />
            <span className="text-xl font-bold text-white">Cardshow</span>
            {isAdminPage && (
              <div className="flex items-center gap-2 ml-4">
                <Shield className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-500 font-medium">Admin</span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className={isActive(item.href) ? "bg-[#00C851] hover:bg-[#00a844]" : "text-gray-300 hover:text-white"}
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Admin Navigation - only show if user is authenticated */}
            {user && adminItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className={
                    isActive(item.href) 
                      ? "bg-amber-600 hover:bg-amber-700" 
                      : "text-amber-400 hover:text-amber-300 border border-amber-600/30"
                  }
                  size="sm"
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
                <Button className="bg-[#00C851] hover:bg-[#00a844] text-white">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className={`w-full justify-start ${
                    isActive(item.href) ? "bg-[#00C851] hover:bg-[#00a844]" : "text-gray-300 hover:text-white"
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
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className={`w-full justify-start ${
                    isActive(item.href) 
                      ? "bg-amber-600 hover:bg-amber-700" 
                      : "text-amber-400 hover:text-amber-300 border border-amber-600/30"
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
