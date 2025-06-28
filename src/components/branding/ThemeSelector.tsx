
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon, Sparkles, Gem, Leaf } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

const ThemeSelector = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const themes = [
    { 
      id: 'original', 
      name: 'Original', 
      icon: Sparkles,
      colors: ['#DC2626', '#7C2D12']
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      icon: Gem,
      colors: ['#A855F7', '#EC4899']
    },
    { 
      id: 'emerald', 
      name: 'Emerald', 
      icon: Leaf,
      colors: ['#10B981', '#059669']
    }
  ] as const;

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  const handleThemeChange = (themeId: string) => {
    console.log('Changing theme to:', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setTheme(themeId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover-lift">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="px-2 py-2 mb-2">
          <p className="text-sm font-semibold">Choose Theme</p>
          <p className="text-xs text-muted-foreground">
            Current: {currentTheme.name}
          </p>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="space-y-1 py-2">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <DropdownMenuItem
                key={themeOption.id}
                onClick={() => handleThemeChange(themeOption.id)}
                className="flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl hover:bg-accent/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg border-2 border-white/20 shadow-sm flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${themeOption.colors[0]}, ${themeOption.colors[1]})` 
                    }}
                  >
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">{themeOption.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {themeOption.id === 'original' && 'Classic CRD theme'}
                      {themeOption.id === 'premium' && 'Modern gradient theme'}
                      {themeOption.id === 'emerald' && 'Nature-inspired theme'}
                    </div>
                  </div>
                </div>
                {theme === themeOption.id && (
                  <div className="w-2 h-2 bg-primary rounded-full ml-auto" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />
        
        <div className="p-2">
          <p className="text-xs font-medium px-2 py-1 text-muted-foreground">Mode</p>
          <div className="flex gap-1 mt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme('light')}
              className={`flex-1 gap-2 ${resolvedTheme === 'light' ? 'bg-accent' : ''}`}
            >
              <Sun className="w-4 h-4" />
              <span className="text-xs">Light</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme('dark')}
              className={`flex-1 gap-2 ${resolvedTheme === 'dark' ? 'bg-accent' : ''}`}
            >
              <Moon className="w-4 h-4" />
              <span className="text-xs">Dark</span>
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
