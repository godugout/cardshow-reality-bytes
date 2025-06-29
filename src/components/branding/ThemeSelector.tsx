
import { useTheme, Theme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeSelector = () => {
  const { theme, mode, setTheme, setMode } = useTheme();

  const themes = [
    { id: 'classic', name: 'Classic Red', color: '#DC2626', description: 'Bold and professional' },
    { id: 'royal', name: 'Royal Blue', color: '#1D4ED8', description: 'Trustworthy and stable' },
    { id: 'vibrant', name: 'Vibrant Orange', color: '#EA580C', description: 'Energetic and creative' },
    { id: 'fresh', name: 'Fresh Green', color: '#059669', description: 'Natural and growth-focused' }
  ] as const;

  const handleThemeChange = (themeId: string) => {
    console.log('🎨 ThemeSelector: User clicked theme:', themeId);
    setTheme(themeId as Theme);
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    console.log('🎨 ThemeSelector: User clicked mode:', newMode);
    setMode(newMode);
  };

  const currentTheme = themes.find(t => t.id === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 rounded-2xl hover:bg-accent/50 transition-colors"
        >
          <div 
            className="w-4 h-4 rounded-full border-2 border-white/30 shadow-sm"
            style={{ backgroundColor: currentTheme?.color }}
          />
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-72 bg-card/95 backdrop-blur-xl border border-border rounded-3xl p-3 z-50"
      >
        <div className="px-3 py-2 border-b border-border/50 mb-2">
          <p className="text-sm font-medium">Choose Theme</p>
          <p className="text-xs text-muted-foreground">
            Current: {currentTheme?.name} • {mode === 'dark' ? 'Dark' : 'Light'} Mode
          </p>
        </div>
        
        <div className="p-2 space-y-1">
          <p className="text-xs font-medium px-3 py-1 text-muted-foreground uppercase tracking-wide">Color Themes</p>
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.id}
              onSelect={() => handleThemeChange(themeOption.id)}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer rounded-2xl hover:bg-accent/50 transition-colors focus:bg-accent/50"
            >
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white/30 shadow-sm flex-shrink-0 ring-2 ring-offset-2 ring-offset-card"
                  style={{ 
                    backgroundColor: themeOption.color,
                    ringColor: theme === themeOption.id ? themeOption.color : 'transparent'
                  }}
                />
                <div>
                  <div className="text-sm font-medium">{themeOption.name}</div>
                  <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                </div>
              </div>
              {theme === themeOption.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="bg-border/50 my-2" />
        
        <div className="p-2">
          <p className="text-xs font-medium px-3 py-1 text-muted-foreground uppercase tracking-wide">Appearance</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <DropdownMenuItem
              onSelect={() => handleModeChange('light')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-2xl hover:bg-accent/50 transition-colors focus:bg-accent/50"
            >
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light</span>
              {mode === 'light' && <Check className="w-3 h-3 text-primary ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => handleModeChange('dark')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-2xl hover:bg-accent/50 transition-colors focus:bg-accent/50"
            >
              <Moon className="w-4 h-4" />
              <span className="text-sm">Dark</span>
              {mode === 'dark' && <Check className="w-3 h-3 text-primary ml-auto" />}
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
