
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Image, 
  Palette, 
  Sparkles,
  Grid3x3
} from 'lucide-react';

type ActiveSection = 'content' | 'design' | 'effects' | 'canvas';

interface CardDesignerTabsProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export const CardDesignerTabs = ({ activeSection, onSectionChange }: CardDesignerTabsProps) => {
  console.log('CardDesignerTabs rendering with activeSection:', activeSection);
  console.log('All 5 tabs should be visible: Content, Image, Design, Effects, Canvas');

  const tabs = [
    {
      id: 'content' as const,
      label: 'Content',
      icon: Type,
      description: 'Card title and description'
    },
    {
      id: 'design' as const,
      label: 'Design', 
      icon: Palette,
      description: 'Colors and styling'
    },
    {
      id: 'effects' as const,
      label: 'Effects',
      icon: Sparkles,
      description: 'Visual effects'
    },
    {
      id: 'canvas' as const,
      label: 'Canvas',
      icon: Grid3x3,
      description: 'Canvas themes & CRD logo'
    }
  ];

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 mb-3">
        Design Tools
      </div>
      
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start h-12 px-4 ${
              isActive 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => {
              console.log(`Switching to ${tab.id} tab`);
              onSectionChange(tab.id);
            }}
          >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex flex-col items-start flex-1">
              <span className="font-medium">{tab.label}</span>
              <span className={`text-xs ${
                isActive ? 'text-emerald-100' : 'text-slate-500'
              }`}>
                {tab.description}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
};
