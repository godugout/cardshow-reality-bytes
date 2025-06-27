
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">Choose Theme</p>
          <p className="text-xs text-muted-foreground">Customize your experience</p>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2 space-y-1">
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as any)}
              className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${
                theme === themeOption.id ? 'bg-accent' : ''
              }`}
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
          <p className="text-xs font-medium px-3 py-1">Appearance</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <DropdownMenuItem
              onClick={() => setMode('light')}
              className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer ${
                mode === 'light' ? 'bg-accent' : ''
              }`}
            >
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setMode('dark')}
              className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer ${
                mode === 'dark' ? 'bg-accent' : ''
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="text-sm">Dark</span>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
