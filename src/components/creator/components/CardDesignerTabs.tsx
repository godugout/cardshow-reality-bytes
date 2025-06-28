
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Type, Palette, Sparkles, Grid3x3 } from 'lucide-react';

type ActiveSection = 'content' | 'design' | 'effects' | 'canvas';

interface CardDesignerTabsProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export const CardDesignerTabs = ({ activeSection, onSectionChange }: CardDesignerTabsProps) => {
  // Debug logging
  console.log('CardDesignerTabs rendering with activeSection:', activeSection);
  console.log('All 4 tabs should be visible: Content, Design, Effects, Canvas');
  
  const getButtonClasses = (section: ActiveSection) => 
    `flex-1 h-9 text-xs min-w-0 ${
      activeSection === section 
        ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700' 
        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-600'
    }`;

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-4 bg-slate-700/50 p-1 rounded-lg gap-1 w-full">
          <Button
            variant={activeSection === 'content' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              console.log('Content tab clicked');
              onSectionChange('content');
            }}
            className={getButtonClasses('content')}
          >
            <Type className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Content</span>
          </Button>
          <Button
            variant={activeSection === 'design' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              console.log('Design tab clicked');
              onSectionChange('design');
            }}
            className={getButtonClasses('design')}
          >
            <Palette className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Design</span>
          </Button>
          <Button
            variant={activeSection === 'effects' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              console.log('Effects tab clicked');
              onSectionChange('effects');
            }}
            className={getButtonClasses('effects')}
          >
            <Sparkles className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Effects</span>
          </Button>
          <Button
            variant={activeSection === 'canvas' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              console.log('Canvas tab clicked - this should work now!');
              onSectionChange('canvas');
            }}
            className={getButtonClasses('canvas')}
          >
            <Grid3x3 className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Canvas</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
