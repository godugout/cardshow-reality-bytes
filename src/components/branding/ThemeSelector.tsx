
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeSelector = () => {
  const { theme, mode, setTheme, setMode, toggleMode } = useTheme();

  const themes = [
    { id: 'classic', name: 'Classic Red', color: '#DC2626', description: 'Bold and energetic' },
    { id: 'royal', name: 'Royal Blue', color: '#1D4ED8', description: 'Professional and trust' },
    { id: 'vibrant', name: 'Vibrant Orange', color: '#EA580C', description: 'Creative and dynamic' },
    { id: 'fresh', name: 'Fresh Green', color: '#059669', description: 'Growth and harmony' }
  ] as const;

  const modes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="focus-ring">
          <Palette className="w-4 h-4" />
          <span className="hide-mobile ml-2">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-elevated shadow-xl border border-primary">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-primary">Choose Theme</p>
          <p className="text-xs text-secondary">Customize your experience</p>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2 space-y-1">
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as any)}
              className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${
                theme === themeOption.id 
                  ? 'bg-brand text-inverse' 
                  : 'hover:bg-secondary'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: themeOption.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{themeOption.name}</div>
                <div className="text-xs opacity-70">{themeOption.description}</div>
              </div>
              {theme === themeOption.id && (
                <div className="w-2 h-2 bg-current rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        
        <div className="p-2">
          <p className="text-xs font-medium text-primary px-3 py-1">Appearance</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {modes.map((modeOption) => {
              const Icon = modeOption.icon;
              return (
                <DropdownMenuItem
                  key={modeOption.id}
                  onClick={() => setMode(modeOption.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
                    mode === modeOption.id 
                      ? 'bg-brand text-inverse' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{modeOption.name}</span>
                </DropdownMenuItem>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
