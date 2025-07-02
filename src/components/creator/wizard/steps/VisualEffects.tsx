import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Type, Zap, Chrome, Rainbow, Eye } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

interface VisualEffectsProps {
  wizard: ReturnType<typeof useCardCreationWizard>;
}

export const VisualEffects = ({ wizard }: VisualEffectsProps) => {
  const { state, updateState } = wizard;
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const updateVisualEffects = (updates: Partial<typeof state.visualEffects>) => {
    updateState({
      visualEffects: {
        ...state.visualEffects,
        ...updates
      }
    });
  };

  const updateColors = (updates: Partial<typeof state.colors>) => {
    updateState({
      colors: {
        ...state.colors,
        ...updates
      }
    });
  };

  const updateTextStyles = (updates: Partial<typeof state.textStyles>) => {
    updateState({
      textStyles: {
        ...state.textStyles,
        ...updates
      }
    });
  };

  const ColorPicker = ({ colorKey, label, currentColor }: { 
    colorKey: string; 
    label: string; 
    currentColor: string; 
  }) => (
    <div>
      <Label className="text-white font-medium mb-2 block">{label}</Label>
      <div className="relative">
        <button
          className="w-full h-10 rounded-lg border border-slate-600 flex items-center gap-3 px-3 hover:border-slate-500 transition-colors"
          onClick={() => setActiveColorPicker(activeColorPicker === colorKey ? null : colorKey)}
        >
          <div 
            className="w-6 h-6 rounded border border-slate-500"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-white font-mono text-sm">{currentColor}</span>
        </button>
        
        {activeColorPicker === colorKey && (
          <div className="absolute top-12 left-0 z-50 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl">
            <HexColorPicker
              color={currentColor}
              onChange={(color) => {
                if (colorKey.startsWith('effect-')) {
                  updateVisualEffects({ glowColor: color });
                } else {
                  updateColors({ [colorKey]: color });
                }
              }}
            />
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => setActiveColorPicker(null)}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Visual Effects & Style
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Customize your card's appearance with special effects, colors, and typography.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Effects */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              Special Effects
            </h3>

            <div className="space-y-6">
              {/* Effect Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <Label className="text-white">Holographic</Label>
                  </div>
                  <Switch
                    checked={state.visualEffects.holographic}
                    onCheckedChange={(checked) => updateVisualEffects({ holographic: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <Label className="text-white">Foil</Label>
                  </div>
                  <Switch
                    checked={state.visualEffects.foil}
                    onCheckedChange={(checked) => updateVisualEffects({ foil: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Chrome className="w-4 h-4 text-gray-400" />
                    <Label className="text-white">Chrome</Label>
                  </div>
                  <Switch
                    checked={state.visualEffects.chrome}
                    onCheckedChange={(checked) => updateVisualEffects({ chrome: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Rainbow className="w-4 h-4 text-purple-400" />
                    <Label className="text-white">Rainbow</Label>
                  </div>
                  <Switch
                    checked={state.visualEffects.rainbow}
                    onCheckedChange={(checked) => updateVisualEffects({ rainbow: checked })}
                  />
                </div>
              </div>

              {/* Effect Intensity */}
              <div>
                <Label className="text-white font-medium mb-3 block">
                  Effect Intensity: {Math.round(state.visualEffects.intensity * 100)}%
                </Label>
                <Slider
                  value={[state.visualEffects.intensity]}
                  onValueChange={([value]) => updateVisualEffects({ intensity: value })}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Glow Color */}
              <ColorPicker
                colorKey="effect-glow"
                label="Glow Color"
                currentColor={state.visualEffects.glowColor}
              />
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-primary" />
              Color Scheme
            </h3>

            <div className="space-y-4">
              <ColorPicker
                colorKey="primary"
                label="Primary Color"
                currentColor={state.colors.primary}
              />
              <ColorPicker
                colorKey="secondary"
                label="Secondary Color"
                currentColor={state.colors.secondary}
              />
              <ColorPicker
                colorKey="accent"
                label="Accent Color"
                currentColor={state.colors.accent}
              />
              <ColorPicker
                colorKey="text"
                label="Text Color"
                currentColor={state.colors.text}
              />
            </div>

            {/* Color Presets */}
            <div className="mt-6">
              <Label className="text-white font-medium mb-3 block">Quick Presets</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Default', colors: { primary: '#00C851', secondary: '#1a1a1a', accent: '#ffffff', text: '#ffffff' } },
                  { name: 'Ocean', colors: { primary: '#0891b2', secondary: '#0f172a', accent: '#38bdf8', text: '#ffffff' } },
                  { name: 'Sunset', colors: { primary: '#f59e0b', secondary: '#7c2d12', accent: '#fbbf24', text: '#ffffff' } },
                  { name: 'Purple', colors: { primary: '#8b5cf6', secondary: '#1e1b4b', accent: '#c4b5fd', text: '#ffffff' } },
                  { name: 'Rose', colors: { primary: '#f43f5e', secondary: '#4c1d24', accent: '#fda4af', text: '#ffffff' } },
                  { name: 'Mint', colors: { primary: '#10b981', secondary: '#064e3b', accent: '#6ee7b7', text: '#ffffff' } },
                ].map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 border-slate-600 hover:border-slate-500"
                    onClick={() => updateColors(preset.colors)}
                  >
                    <div className="text-center">
                      <div className="flex gap-1 mb-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.colors.primary }} />
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.colors.secondary }} />
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.colors.accent }} />
                      </div>
                      <span className="text-xs text-slate-300">{preset.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Type className="w-5 h-5 mr-2 text-primary" />
              Typography
            </h3>

            <div className="space-y-6">
              {/* Title Font Size */}
              <div>
                <Label className="text-white font-medium mb-3 block">
                  Title Size: {state.textStyles.titleSize}px
                </Label>
                <Slider
                  value={[state.textStyles.titleSize]}
                  onValueChange={([value]) => updateTextStyles({ titleSize: value })}
                  max={48}
                  min={12}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Description Font Size */}
              <div>
                <Label className="text-white font-medium mb-3 block">
                  Description Size: {state.textStyles.descriptionSize}px
                </Label>
                <Slider
                  value={[state.textStyles.descriptionSize]}
                  onValueChange={([value]) => updateTextStyles({ descriptionSize: value })}
                  max={24}
                  min={8}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Font Families */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-medium mb-2 block">Title Font</Label>
                  <select
                    value={state.textStyles.titleFont}
                    onChange={(e) => updateTextStyles({ titleFont: e.target.value })}
                    className="w-full p-2 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white font-medium mb-2 block">Description Font</Label>
                  <select
                    value={state.textStyles.descriptionFont}
                    onChange={(e) => updateTextStyles({ descriptionFont: e.target.value })}
                    className="w-full p-2 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-primary" />
              Live Preview
            </h3>
            
            <div className="aspect-[3/4] bg-slate-900 rounded-lg border border-slate-600 relative overflow-hidden">
              {/* Background with effects */}
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: state.colors.secondary }}
              >
                {state.visualEffects.holographic && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
                )}
                {state.visualEffects.rainbow && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10" />
                )}
                {state.visualEffects.chrome && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/20" />
                )}
              </div>

              {/* Content */}
              <div className="absolute inset-4 flex flex-col justify-end">
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: `${state.colors.primary}20`,
                    borderColor: state.colors.accent,
                    borderWidth: '1px'
                  }}
                >
                  <h4 
                    className="font-bold mb-1"
                    style={{ 
                      color: state.colors.text,
                      fontSize: `${state.textStyles.titleSize * 0.5}px`,
                      fontFamily: state.textStyles.titleFont
                    }}
                  >
                    {state.cardDetails.title || 'Card Title'}
                  </h4>
                  <p 
                    className="text-xs opacity-80"
                    style={{ 
                      color: state.colors.text,
                      fontSize: `${state.textStyles.descriptionSize * 0.6}px`,
                      fontFamily: state.textStyles.descriptionFont
                    }}
                  >
                    {state.cardDetails.description || 'Card description...'}
                  </p>
                </div>
              </div>

              {/* Glow effect */}
              {(state.visualEffects.holographic || state.visualEffects.foil) && (
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    boxShadow: `inset 0 0 20px ${state.visualEffects.glowColor}`,
                    opacity: state.visualEffects.intensity
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};