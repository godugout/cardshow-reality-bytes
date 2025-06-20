
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "./UserMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              Cardshow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/cards" className="text-gray-300 hover:text-[#00C851] transition-colors">
              Cards
            </Link>
            <a href="#marketplace" className="text-gray-300 hover:text-[#00C851] transition-colors">
              Marketplace
            </a>
            <a href="#creators" className="text-gray-300 hover:text-[#00C851] transition-colors">
              Creators
            </a>
            <a href="#about" className="text-gray-300 hover:text-[#00C851] transition-colors">
              About
            </a>
          </nav>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-700 rounded-full"></div>
            ) : user ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-[#00C851] hover:bg-[#00A543] text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link to="/cards" className="text-gray-300 hover:text-[#00C851] transition-colors">
                Cards
              </Link>
              <a href="#marketplace" className="text-gray-300 hover:text-[#00C851] transition-colors">
                Marketplace
              </a>
              <a href="#creators" className="text-gray-300 hover:text-[#00C851] transition-colors">
                Creators
              </a>
              <a href="#about" className="text-gray-300 hover:text-[#00C851] transition-colors">
                About
              </a>
              <div className="pt-4 space-y-3">
                {loading ? (
                  <div className="w-full h-10 animate-pulse bg-gray-700 rounded"></div>
                ) : user ? (
                  <div className="flex items-center space-x-2 text-white">
                    <span>Welcome, {user.email?.split('@')[0]}</span>
                  </div>
                ) : (
                  <>
                    <Link to="/auth" className="block">
                      <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-gray-800">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" className="block">
                      <Button className="w-full bg-[#00C851] hover:bg-[#00A543] text-white">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
