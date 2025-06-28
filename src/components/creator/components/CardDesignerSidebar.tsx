
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
  // Debug logging
  console.log('CardDesignerSidebar rendering with activeSection:', activeSection);

  const renderActiveSection = () => {
    console.log('Rendering section:', activeSection);
    
    switch (activeSection) {
      case 'content':
        return (
          <ContentSection
            cardData={cardData}
            uploadProgress={uploadProgress}
            updateCardData={updateCardData}
            uploadImage={uploadImage}
          />
        );
      case 'design':
        return (
          <DesignSection
            cardData={cardData}
            updateDesignConfig={updateDesignConfig}
          />
        );
      case 'effects':
        return (
          <EffectsSection
            cardData={cardData}
            updateDesignConfig={updateDesignConfig}
          />
        );
      case 'canvas':
        console.log('Rendering CanvasCustomizer');
        return <CanvasCustomizer />;
      default:
        console.log('No matching section for:', activeSection);
        return null;
    }
  };

  return (
    <div className="w-80 flex flex-col space-y-4">
      <CardDesignerTabs
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />

      <Card className="bg-slate-800 border-slate-700 shadow-lg flex-1">
        <CardContent className="p-6 h-full overflow-y-auto">
          {renderActiveSection()}
        </CardContent>
      </Card>
    </div>
  );
};
