
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, User, LogOut, Settings, Bell, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', color: 'from-brand-marketplace to-brand-marketplace/80', theme: 'marketplace' },
    { name: 'Cards', href: '/cards', color: 'from-brand-cards to-brand-cards/80', theme: 'cards' },
    { name: 'Creator', href: '/creator', color: 'from-brand-cards to-brand-cards/80', theme: 'cards' },
    { name: 'Marketplace', href: '/marketplace', color: 'from-brand-marketplace to-brand-marketplace/80', theme: 'marketplace' },
    { name: 'Community', href: '/community', color: 'from-brand-collections to-brand-collections/80', theme: 'collections' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur-xl border-b border-border shadow-card">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-8 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-collections to-brand-collections/80 text-white font-black text-lg shadow-lg">
              C
            </div>
            <span className="hidden font-black text-xl sm:inline-block bg-gradient-to-r from-brand-collections to-brand-collections/80 bg-clip-text text-transparent">
              Cardshow
            </span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-semibold">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative transition-all duration-300 hover:scale-105 px-4 py-2 rounded-2xl group ${
                  isActive(item.href) 
                    ? 'text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive(item.href) && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-90`} />
                )}
                {!isActive(item.href) && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-slate-800/50 focus-visible:bg-slate-800/50 focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden rounded-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="mr-6 flex items-center space-x-3 md:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-[#00C851] to-[#00A543] text-white font-black text-lg shadow-lg">
                C
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
                Cardshow
              </span>
            </Link>
          </div>
          <nav className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative rounded-2xl hover:bg-slate-800/50 text-slate-300 hover:text-white">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-[#00C851] to-[#00A543] border-0">
                    3
                  </Badge>
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-2xl hover:bg-slate-800/50">
                      <Avatar className="h-10 w-10 border-2 border-[#00C851]/30">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback className="bg-gradient-to-r from-[#00C851]/20 to-[#00A543]/20 text-[#00C851] font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-64 bg-slate-800/95 backdrop-blur-xl border-slate-700/50 rounded-3xl p-2" 
                    align="end" 
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-3 p-4">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-lg text-white">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="w-[200px] truncate text-sm text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-700/50" />
                    <DropdownMenuItem asChild className="rounded-2xl m-1 p-3 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700/50">
                      <Link to="/profile">
                        <User className="mr-3 h-5 w-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-2xl m-1 p-3 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700/50">
                      <Link to="/community">
                        <Users className="mr-3 h-5 w-5" />
                        <span className="font-medium">Community</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-2xl m-1 p-3 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700/50">
                      <Settings className="mr-3 h-5 w-5" />
                      <span className="font-medium">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700/50" />
                    <DropdownMenuItem 
                      onClick={() => signOut()} 
                      className="rounded-2xl m-1 p-3 cursor-pointer text-red-400 focus:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild className="rounded-2xl px-6 bg-gradient-to-r from-[#00C851] to-[#00A543] hover:from-[#00A543] hover:to-[#008A36] text-white">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 rounded-b-3xl md:hidden">
            <nav className="container py-6">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative block px-4 py-3 text-base font-semibold transition-all duration-300 rounded-2xl group ${
                      isActive(item.href) 
                        ? 'text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isActive(item.href) && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-90`} />
                    )}
                    {!isActive(item.href) && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
