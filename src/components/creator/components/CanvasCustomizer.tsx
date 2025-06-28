
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCanvasCustomizer } from '../hooks/useCanvasCustomizer';
import { Palette, Grid3x3, Eye } from 'lucide-react';

export const CanvasCustomizer = () => {
  const {
    canvasState,
    updateCanvasState,
    selectTheme,
    availableThemes,
  } = useCanvasCustomizer();

  return (
    <div className="space-y-6">
      {/* Theme Presets */}
      <div>
        <Label className="text-sm font-semibold text-slate-200 mb-3 block">
          <Palette className="w-4 h-4 inline mr-2" />
          Canvas Themes
        </Label>
        <div className="space-y-3">
          {availableThemes.map((theme) => (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all duration-200 ${
                canvasState.selectedTheme === theme.id
                  ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500/50'
                  : 'hover:bg-slate-700/50 bg-slate-700/30 border-slate-600'
              }`}
              onClick={() => selectTheme(theme.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Theme Preview */}
                  <div 
                    className="w-12 h-8 rounded border-2 border-slate-500 flex-shrink-0"
                    style={{
                      backgroundColor: theme.backgroundColor,
                      backgroundImage: theme.patternOverlay,
                      backgroundSize: '8px 8px',
                    }}
                  >
                    {theme.showGrid && (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `
                            linear-gradient(${theme.gridColor} 1px, transparent 1px),
                            linear-gradient(90deg, ${theme.gridColor} 1px, transparent 1px)
                          `,
                          backgroundSize: '4px 4px',
                          opacity: theme.gridOpacity,
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Theme Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-200 text-sm truncate">
                        {theme.name}
                      </h3>
                      {canvasState.selectedTheme === theme.id && (
                        <Badge variant="default" className="text-xs bg-emerald-600 text-white">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {theme.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-600" />

      {/* Custom Background Color */}
      <div>
        <Label className="text-sm font-semibold text-slate-200 mb-3 block">
          Custom Background
        </Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={canvasState.customBackgroundColor}
            onChange={(e) => updateCanvasState({ customBackgroundColor: e.target.value })}
            className="w-12 h-10 rounded-lg border border-slate-600 cursor-pointer bg-slate-700"
          />
          <Input
            value={canvasState.customBackgroundColor}
            onChange={(e) => updateCanvasState({ customBackgroundColor: e.target.value })}
            className="flex-1 bg-slate-700 border-slate-600 text-slate-100 focus:border-emerald-500"
            placeholder="#1a2332"
          />
        </div>
      </div>

      <Separator className="bg-slate-600" />

      {/* Grid Settings */}
      <div>
        <Label className="text-sm font-semibold text-slate-200 mb-3 block">
          <Grid3x3 className="w-4 h-4 inline mr-2" />
          Grid Settings
        </Label>
        
        <div className="space-y-4">
          {/* Show Grid Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Show Grid</Label>
            <Switch
              checked={canvasState.showGrid}
              onCheckedChange={(checked) => updateCanvasState({ showGrid: checked })}
            />
          </div>

          {canvasState.showGrid && (
            <>
              {/* Grid Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm text-slate-300">Grid Size</Label>
                  <span className="text-xs font-medium text-slate-200 bg-slate-700 px-2 py-1 rounded">
                    {canvasState.gridSize}px
                  </span>
                </div>
                <Slider
                  value={[canvasState.gridSize]}
                  onValueChange={([value]) => updateCanvasState({ gridSize: value })}
                  min={8}
                  max={64}
                  step={4}
                  className="w-full"
                />
              </div>

              {/* Grid Opacity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm text-slate-300">Grid Opacity</Label>
                  <span className="text-xs font-medium text-slate-200 bg-slate-700 px-2 py-1 rounded">
                    {Math.round(canvasState.gridOpacity * 100)}%
                  </span>
                </div>
                <Slider
                  value={[canvasState.gridOpacity]}
                  onValueChange={([value]) => updateCanvasState({ gridOpacity: value })}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Grid Color */}
              <div>
                <Label className="text-sm text-slate-300 mb-2 block">Grid Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={canvasState.gridColor}
                    onChange={(e) => updateCanvasState({ gridColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer bg-slate-700"
                  />
                  <Input
                    value={canvasState.gridColor}
                    onChange={(e) => updateCanvasState({ gridColor: e.target.value })}
                    className="flex-1 bg-slate-700 border-slate-600 text-slate-100 focus:border-emerald-500"
                    placeholder="#3a5a7a"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
