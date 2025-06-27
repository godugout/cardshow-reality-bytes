
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Plus,
  ArrowLeft 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

const MobileNavigation = ({ showBack, onBack, title }: MobileNavigationProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isMobile) return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Discover', path: '/mobile-cards' },
    { icon: Plus, label: 'Create', path: '/creator' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border safe-area-inset-top">
        <div className="flex items-center justify-between h-14 px-4">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack || (() => navigate(-1))}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="w-10" />
          )}
          
          {title && (
            <h1 className="font-semibold text-lg truncate">{title}</h1>
          )}
          
          <div className="w-10" />
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center h-12 w-12 p-1',
                  'text-xs gap-1',
                  isActive && 'text-[#00C851]'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] leading-tight">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
