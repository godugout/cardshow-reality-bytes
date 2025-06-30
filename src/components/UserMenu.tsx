
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { 
  User, 
  Settings, 
  LogOut, 
  CreditCard, 
  Heart, 
  Palette,
  Sun,
  Moon,
  Monitor,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { theme, mode, setTheme, setMode, systemTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const themes = [
    { id: 'classic', name: 'Classic Red', color: 'rgb(220 38 38)' },
    { id: 'royal', name: 'Royal Blue', color: 'rgb(29 78 216)' },
    { id: 'vibrant', name: 'Vibrant Orange', color: 'rgb(234 88 12)' },
    { id: 'fresh', name: 'Fresh Green', color: 'rgb(5 150 105)' }
  ] as const;

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "See you next time!"
      });
      navigate('/');
    }
    setIsLoggingOut(false);
  };

  if (!user) return null;

  const userInitials = user.email?.charAt(0).toUpperCase() || 'U';
  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 hover:opacity-80 transition-all rounded-lg p-2 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2">
          <Avatar className="w-8 h-8 ring-2 ring-border">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">
              {user.user_metadata?.username || user.email?.split('@')[0]}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 bg-popover/95 backdrop-blur-sm border-border/50" align="end">
        {/* User Info Header */}
        <div className="px-3 py-3 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {user.user_metadata?.username || user.email?.split('@')[0]}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="py-2">
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-accent"
            onClick={() => navigate('/profile')}
          >
            <User className="w-4 h-4 mr-3" />
            Profile
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-accent"
            onClick={() => navigate('/cards')}
          >
            <CreditCard className="w-4 h-4 mr-3" />
            My Cards
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-accent"
            onClick={() => navigate('/collections')}
          >
            <Heart className="w-4 h-4 mr-3" />
            Collections
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Theme & Appearance Controls */}
        <div className="py-2">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Palette className="w-4 h-4 mr-3" />
              <span>Theme</span>
              <div 
                className="w-3 h-3 rounded-full ml-auto border border-border/50"
                style={{ backgroundColor: currentTheme.color }}
              />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 bg-popover/95 backdrop-blur-sm">
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Color Theme</p>
                <div className="space-y-1">
                  {themes.map((themeOption) => (
                    <DropdownMenuItem
                      key={themeOption.id}
                      onClick={() => setTheme(themeOption.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3 border border-border/50"
                          style={{ backgroundColor: themeOption.color }}
                        />
                        <span className="text-sm">{themeOption.name}</span>
                      </div>
                      {theme === themeOption.id && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              {mode === 'light' ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
              Appearance
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40 bg-popover/95 backdrop-blur-sm">
              <DropdownMenuItem
                onClick={() => setMode('light')}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Sun className="w-4 h-4 mr-3" />
                  <span>Light</span>
                </div>
                {mode === 'light' && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => setMode('dark')}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Moon className="w-4 h-4 mr-3" />
                  <span>Dark</span>
                </div>
                {mode === 'dark' && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => setMode(systemTheme)}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Monitor className="w-4 h-4 mr-3" />
                  <span>System</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem className="cursor-pointer focus:bg-accent">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />
        
        {/* Sign Out */}
        <div className="py-2">
          <DropdownMenuItem 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
            onClick={handleSignOut}
            disabled={isLoggingOut}
          >
            <LogOut className="w-4 h-4 mr-3" />
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
