
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Type, Palette, Sparkles, Grid3x3 } from 'lucide-react';

type ActiveSection = 'content' | 'design' | 'effects' | 'canvas';

interface CardDesignerTabsProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export const CardDesignerTabs = ({ activeSection, onSectionChange }: CardDesignerTabsProps) => {
  const getButtonClasses = (section: ActiveSection) => 
    `flex-1 h-9 text-xs ${
      activeSection === section 
        ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700' 
        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-600'
    }`;

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg">
      <CardContent className="p-4">
        <div className="flex bg-slate-700/50 p-1 rounded-lg">
          <Button
            variant={activeSection === 'content' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSectionChange('content')}
            className={getButtonClasses('content')}
          >
            <Type className="w-3 h-3 mr-1" />
            Content
          </Button>
          <Button
            variant={activeSection === 'design' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSectionChange('design')}
            className={getButtonClasses('design')}
          >
            <Palette className="w-3 h-3 mr-1" />
            Design
          </Button>
          <Button
            variant={activeSection === 'effects' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSectionChange('effects')}
            className={getButtonClasses('effects')}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Effects
          </Button>
          <Button
            variant={activeSection === 'canvas' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSectionChange('canvas')}
            className={getButtonClasses('canvas')}
          >
            <Grid3x3 className="w-3 h-3 mr-1" />
            Canvas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
