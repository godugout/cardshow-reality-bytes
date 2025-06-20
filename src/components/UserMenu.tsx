
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
import { User, Settings, LogOut, CreditCard, Heart } from 'lucide-react';
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
        <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-[#00C851] text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-white hidden md:block">
            {user.user_metadata?.username || user.email?.split('@')[0]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800" align="end">
        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
          <CreditCard className="w-4 h-4 mr-2" />
          My Cards
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
          <Heart className="w-4 h-4 mr-2" />
          Collections
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem 
          className="text-red-400 hover:bg-gray-800 cursor-pointer"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
