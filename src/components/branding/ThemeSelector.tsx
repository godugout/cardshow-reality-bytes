
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon } from 'lucide-react';
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
    { id: 'classic', name: 'Classic Red', color: '#DC2626' },
    { id: 'royal', name: 'Royal Blue', color: '#1D4ED8' },
    { id: 'vibrant', name: 'Vibrant Orange', color: '#EA580C' },
    { id: 'fresh', name: 'Fresh Green', color: '#059669' }
  ] as const;

  const handleThemeChange = (themeId: string) => {
    console.log('Changing theme to:', themeId);
    setTheme(themeId as any);
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    console.log('Changing mode to:', newMode);
    setMode(newMode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">Choose Theme</p>
          <p className="text-xs text-muted-foreground">Current: {themes.find(t => t.id === theme)?.name}</p>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2 space-y-1">
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer"
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
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

        <DropdownMenuSeparator />
        
        <div className="p-2">
          <p className="text-xs font-medium px-3 py-1 text-muted-foreground">Appearance</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <DropdownMenuItem
              onClick={() => handleModeChange('light')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
            >
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light</span>
              {mode === 'light' && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleModeChange('dark')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
            >
              <Moon className="w-4 h-4" />
              <span className="text-sm">Dark</span>
              {mode === 'dark' && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
