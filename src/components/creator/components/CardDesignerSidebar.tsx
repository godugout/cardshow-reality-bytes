
import { Card, CardContent } from '@/components/ui/card';
import { CardDesignerTabs } from './CardDesignerTabs';
import { ContentSection } from './ContentSection';
import { DesignSection } from './DesignSection';
import { EffectsSection } from './EffectsSection';
import { CanvasCustomizer } from './CanvasCustomizer';
import { CardCreationData } from '@/hooks/useCardCreation';

type ActiveSection = 'content' | 'design' | 'effects' | 'canvas';

interface CardDesignerSidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  cardData: CardCreationData;
  uploadProgress: number;
  updateCardData: (updates: Partial<CardCreationData>) => void;
  updateDesignConfig: (updates: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
}

export const CardDesignerSidebar = ({
  activeSection,
  onSectionChange,
  cardData,
  uploadProgress,
  updateCardData,
  updateDesignConfig,
  uploadImage
}: CardDesignerSidebarProps) => {
  console.log('CardDesignerSidebar rendering with activeSection:', activeSection);
  console.log('Available sections: content, design, effects, canvas');

  const renderActiveSection = () => {
    console.log('Rendering section:', activeSection);
    
    switch (activeSection) {
      case 'content':
        console.log('Rendering ContentSection');
        return (
          <ContentSection
            cardData={cardData}
            uploadProgress={uploadProgress}
            updateCardData={updateCardData}
            uploadImage={uploadImage}
          />
        );
      case 'design':
        console.log('Rendering DesignSection');
        return (
          <DesignSection
            cardData={cardData}
            updateDesignConfig={updateDesignConfig}
          />
        );
      case 'effects':
        console.log('Rendering EffectsSection');
        return (
          <EffectsSection
            cardData={cardData}
            updateDesignConfig={updateDesignConfig}
          />
        );
      case 'canvas':
        console.log('SUCCESS: Rendering CanvasCustomizer with theme presets and CRD logo!');
        return <CanvasCustomizer />;
      default:
        console.log('ERROR: No matching section for:', activeSection);
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>Unknown section: {activeSection}</p>
            <p>Available: content, design, effects, canvas</p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 flex flex-col space-y-4">
      <CardDesignerTabs
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />

      <Card className="bg-card/80 backdrop-blur-sm border-cards/20 shadow-card flex-1">
        <CardContent className="p-6 h-full overflow-y-auto">
          {renderActiveSection()}
        </CardContent>
      </Card>
    </div>
  );
};
