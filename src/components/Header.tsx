
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogIn } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              Cardshow
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-[#00C851] transition-colors">
              Features
            </a>
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button className="bg-[#00C851] hover:bg-[#00A543] text-white">
              Get Started
            </Button>
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
              <a href="#features" className="text-gray-300 hover:text-[#00C851] transition-colors">
                Features
              </a>
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
                <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-gray-800">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button className="w-full bg-[#00C851] hover:bg-[#00A543] text-white">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
