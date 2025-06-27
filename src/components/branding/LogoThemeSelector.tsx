
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ChevronDown, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LogoThemeSelector = () => {
  const { theme, mode, setTheme, setMode, systemTheme } = useTheme();

  const themes = [
    { id: 'classic', name: 'Classic Red', color: 'rgb(220 38 38)' },
    { id: 'royal', name: 'Royal Blue', color: 'rgb(29 78 216)' },
    { id: 'vibrant', name: 'Vibrant Orange', color: 'rgb(234 88 12)' },
    { id: 'fresh', name: 'Fresh Green', color: 'rgb(5 150 105)' }
  ] as const;

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
        {/* Logo Icon with Current Theme Color */}
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md"
          style={{ backgroundColor: currentTheme.color }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2s-.9-2-2-2c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 1.1.9 2 2 2s2-.9 2-2c0-5.52-4.48-10-10-10z"/>
          </svg>
        </div>
        
        {/* Brand Name */}
        <span className="text-xl font-bold text-foreground font-display">
          Cardshow
        </span>
        
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-64 bg-popover border-border">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-popover-foreground">Theme & Appearance</p>
          <p className="text-xs text-muted-foreground">Customize your Cardshow experience</p>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Theme Selection */}
        <div className="p-2">
          <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Color Theme</p>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((themeOption) => (
              <DropdownMenuItem
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md"
              >
                <div 
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: themeOption.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{themeOption.name}</div>
                </div>
                {theme === themeOption.id && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />
        
        {/* Appearance Mode */}
        <div className="p-2">
          <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Appearance</p>
          <div className="space-y-1">
            <DropdownMenuItem
              onClick={() => setMode('light')}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md"
            >
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light</span>
              {mode === 'light' && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => setMode('dark')}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md"
            >
              <Moon className="w-4 h-4" />
              <span className="text-sm">Dark</span>
              {mode === 'dark' && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => setMode(systemTheme)}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md"
            >
              <Monitor className="w-4 h-4" />
              <span className="text-sm">System</span>
              <div className="w-2 h-2 bg-primary rounded-full ml-auto opacity-0" />
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LogoThemeSelector;
