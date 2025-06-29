
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
    { id: 'classic', name: 'Classic Red', color: '#DC2626', bgLight: '#FEF2F2', bgDark: '#0F172A' },
    { id: 'royal', name: 'Royal Blue', color: '#1D4ED8', bgLight: '#EFF6FF', bgDark: '#0F172A' },
    { id: 'vibrant', name: 'Vibrant Orange', color: '#EA580C', bgLight: '#FFF7ED', bgDark: '#0F172A' },
    { id: 'fresh', name: 'Fresh Green', color: '#059669', bgLight: '#ECFDF5', bgDark: '#0F172A' }
  ] as const;

  const handleThemeChange = (themeId: string) => {
    console.log('ThemeSelector: User selected theme:', themeId);
    setTheme(themeId as Theme);
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    console.log('ThemeSelector: User selected mode:', newMode);
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
            className="w-4 h-4 rounded-full border-2 border-white/20 shadow-sm"
            style={{ backgroundColor: currentTheme?.color }}
          />
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-card/95 backdrop-blur-xl border border-border rounded-3xl p-3 z-50"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium">Choose Theme</p>
          <p className="text-xs text-muted-foreground">
            Current: {currentTheme?.name} ({mode === 'dark' ? 'Dark' : 'Light'})
          </p>
        </div>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <div className="p-2 space-y-1">
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.id}
              onSelect={() => handleThemeChange(themeOption.id)}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer rounded-2xl hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="w-5 h-5 rounded-full border-2 border-white/30 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: themeOption.color }}
                />
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-white/20"
                    style={{ backgroundColor: mode === 'dark' ? themeOption.bgDark : themeOption.bgLight }}
                  />
                  <span className="text-sm font-medium">{themeOption.name}</span>
                </div>
              </div>
              {theme === themeOption.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="bg-border/50" />
        
        <div className="p-2">
          <p className="text-xs font-medium px-3 py-1 text-muted-foreground">Appearance</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <DropdownMenuItem
              onSelect={() => handleModeChange('light')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-2xl hover:bg-accent/50 transition-colors"
            >
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light</span>
              {mode === 'light' && <Check className="w-3 h-3 text-primary ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => handleModeChange('dark')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-2xl hover:bg-accent/50 transition-colors"
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
