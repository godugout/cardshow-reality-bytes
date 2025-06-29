
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Settings, 
  LogOut, 
  CreditCard, 
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      
      <DropdownMenuContent className="w-64 glass-panel border-border/50" align="end">
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
