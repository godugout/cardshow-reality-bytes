
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { CardCreationData } from '@/hooks/useCardCreation';

interface EffectsSectionProps {
  cardData: CardCreationData;
  updateDesignConfig: (updates: any) => void;
}

export const EffectsSection = ({ cardData, updateDesignConfig }: EffectsSectionProps) => {
  const hasActiveEffects = cardData.designConfig.effects.holographic || 
                          cardData.designConfig.effects.foil || 
                          cardData.designConfig.effects.chrome;

  return (
    <div className="space-y-4">
      <div className="text-center pb-3">
        <h3 className="text-sm font-bold text-slate-200 mb-1">Special Effects</h3>
        <p className="text-xs text-slate-400">Add premium effects to make your card stand out</p>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-semibold text-slate-200 text-sm">Holographic Effect</Label>
              <p className="text-xs text-slate-400">Rainbow shimmer effect</p>
            </div>
            <Switch
              checked={cardData.designConfig.effects.holographic}
              onCheckedChange={(checked) => 
                updateDesignConfig({ 
                  effects: { ...cardData.designConfig.effects, holographic: checked }
                })
              }
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-semibold text-slate-200 text-sm">Foil Effect</Label>
              <p className="text-xs text-slate-400">Metallic foil shine</p>
            </div>
            <Switch
              checked={cardData.designConfig.effects.foil}
              onCheckedChange={(checked) => 
                updateDesignConfig({ 
                  effects: { ...cardData.designConfig.effects, foil: checked }
                })
              }
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-semibold text-slate-200 text-sm">Chrome Effect</Label>
              <p className="text-xs text-slate-400">Mirror chrome reflection</p>
            </div>
            <Switch
              checked={cardData.designConfig.effects.chrome}
              onCheckedChange={(checked) => 
                updateDesignConfig({ 
                  effects: { ...cardData.designConfig.effects, chrome: checked }
                })
              }
            />
          </div>
        </div>

        {hasActiveEffects && (
          <>
            <Separator className="bg-slate-600" />
            <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold text-slate-200 text-sm">Effect Intensity</Label>
                <span className="text-xs font-medium text-slate-200 bg-slate-700 px-2 py-1 rounded">
                  {Math.round(cardData.designConfig.effects.intensity * 100)}%
                </span>
              </div>
              <Slider
                value={[cardData.designConfig.effects.intensity]}
                onValueChange={([value]) => 
                  updateDesignConfig({ 
                    effects: { ...cardData.designConfig.effects, intensity: value }
                  })
                }
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
