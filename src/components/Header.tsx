
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
    { name: 'Home', href: '/' },
    { name: 'Cards', href: '/cards' },
    { name: 'Creator', href: '/creator' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Community', href: '/community' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-0">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-8 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-black text-lg shadow-lg">
              C
            </div>
            <span className="hidden font-black text-xl sm:inline-block bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Cardshow
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-semibold">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-all duration-200 hover:text-primary/80 px-3 py-2 rounded-2xl hover:bg-accent/50 ${
                  isActive(item.href) 
                    ? 'text-primary bg-primary/10 backdrop-blur-sm' 
                    : 'text-foreground/70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden rounded-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="mr-6 flex items-center space-x-3 md:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-black text-lg shadow-lg">
                C
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Cardshow
              </span>
            </Link>
          </div>
          <nav className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative rounded-2xl hover:bg-accent/50">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-primary/80 to-primary border-0">
                    3
                  </Badge>
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-2xl hover:bg-accent/50">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-card/90 backdrop-blur-xl border-0 rounded-3xl p-2" align="end" forceMount>
                    <div className="flex items-center justify-start gap-3 p-4">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-lg">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem asChild className="rounded-2xl m-1 p-3 cursor-pointer">
                      <Link to="/profile">
                        <User className="mr-3 h-5 w-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-2xl m-1 p-3 cursor-pointer">
                      <Link to="/community">
                        <Users className="mr-3 h-5 w-5" />
                        <span className="font-medium">Community</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-2xl m-1 p-3 cursor-pointer">
                      <Settings className="mr-3 h-5 w-5" />
                      <span className="font-medium">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem onClick={() => signOut()} className="rounded-2xl m-1 p-3 cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild className="rounded-2xl px-6">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-0 rounded-b-3xl md:hidden">
            <nav className="container py-6">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`block px-4 py-3 text-base font-semibold transition-all duration-200 hover:text-primary/80 rounded-2xl hover:bg-accent/50 ${
                      isActive(item.href) 
                        ? 'text-primary bg-primary/10 backdrop-blur-sm' 
                        : 'text-foreground/70'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
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
