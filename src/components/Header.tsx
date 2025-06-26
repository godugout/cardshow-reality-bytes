
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import { Menu, X, Sparkles } from "lucide-react";
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

  // Add admin routes for authenticated users
  if (user) {
    navItems.push(
      { href: "/admin", label: "Admin" },
      { href: "/admin/content-generator", label: "Content Gen" }
    );
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-[#00C851]" />
            <span className="text-xl font-bold text-white">Cardshow</span>
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
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
