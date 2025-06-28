
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { CardCreationData } from '@/hooks/useCardCreation';

interface DesignSectionProps {
  cardData: CardCreationData;
  updateDesignConfig: (updates: any) => void;
}

export const DesignSection = ({ cardData, updateDesignConfig }: DesignSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold text-slate-200 mb-3 block">Colors</Label>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-slate-300 mb-2 block">Background Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={cardData.designConfig.backgroundColor}
                onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer bg-slate-700"
              />
              <Input
                value={cardData.designConfig.backgroundColor}
                onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                className="flex-1 bg-slate-700 border-slate-600 text-slate-100 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-slate-300 mb-2 block">Text Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={cardData.designConfig.titleColor}
                onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer bg-slate-700"
              />
              <Input
                value={cardData.designConfig.titleColor}
                onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                className="flex-1 bg-slate-700 border-slate-600 text-slate-100 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-600" />

      <div>
        <Label className="text-sm font-semibold text-slate-200 mb-3 block">Layout</Label>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-slate-300">Border Radius</Label>
              <span className="text-xs font-medium text-slate-200 bg-slate-700 px-2 py-1 rounded">
                {cardData.designConfig.borderRadius}px
              </span>
            </div>
            <Slider
              value={[cardData.designConfig.borderRadius]}
              onValueChange={([value]) => updateDesignConfig({ borderRadius: value })}
              max={32}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-xs text-slate-300 mb-2 block">Text Position</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['top', 'center', 'bottom'] as const).map((position) => (
                <Button
                  key={position}
                  variant={cardData.designConfig.textPosition === position ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateDesignConfig({ textPosition: position })}
                  className={`capitalize text-xs ${
                    cardData.designConfig.textPosition === position
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'
                  }`}
                >
                  {position}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
