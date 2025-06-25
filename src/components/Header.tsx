import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserMenu from './UserMenu';
import NotificationCenter from './social/NotificationCenter';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const navigation = [
    { name: 'Cards', href: '/cards' },
    { name: 'Collections', href: '/collections' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Trading', href: '/trading' },
    { name: 'Creator', href: '/creator' },
    { name: 'Community', href: '/community' },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#00C851] to-[#00A543] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-bold text-xl">Cardshow</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/cards" className="text-gray-300 hover:text-white transition-colors">
              Browse
            </Link>
            <Link to="/discover" className="text-gray-300 hover:text-white transition-colors">
              Discover
            </Link>
            <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link to="/collections" className="text-gray-300 hover:text-white transition-colors">
              Collections
            </Link>
            <Link to="/creator" className="text-gray-300 hover:text-white transition-colors">
              Create
            </Link>
            <Link to="/community" className="text-gray-300 hover:text-white transition-colors">
              Community
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search cards, collections, creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-[#00C851] focus:ring-[#00C851]"
              />
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationCenter />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/creator')}
                  className="hidden sm:flex border-gray-600 text-gray-300 hover:text-white hover:bg-[#00C851] hover:border-[#00C851] transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
                <UserMenu />
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-[#00C851] hover:bg-[#00A543] text-white"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search cards, collections, creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-[#00C851]"
            />
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg transition-colors ${
                    isActiveRoute(item.href)
                      ? 'bg-[#00C851] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <Button
                  onClick={() => {
                    navigate('/creator');
                    setIsMenuOpen(false);
                  }}
                  className="mt-4 bg-[#00C851] hover:bg-[#00A543] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Cards
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="mt-4 bg-[#00C851] hover:bg-[#00A543] text-white"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
