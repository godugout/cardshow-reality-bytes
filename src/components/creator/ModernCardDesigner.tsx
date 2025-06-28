
import { useState, useEffect } from 'react';
import { useCardCreation } from '@/hooks/useCardCreation';
import { CardDesignerHeader } from './components/CardDesignerHeader';
import { CardDesignerSidebar } from './components/CardDesignerSidebar';
import { CardDesignerPreview } from './components/CardDesignerPreview';

type ActiveSection = 'content' | 'design' | 'effects' | 'canvas';

export const ModernCardDesigner = () => {
  const {
    cardData,
    isLoading,
    uploadProgress,
    updateCardData,
    updateDesignConfig,
    saveCard,
    uploadImage
  } = useCardCreation();

  const [activeSection, setActiveSection] = useState<ActiveSection>('content');

  // Debug logging
  useEffect(() => {
    console.log('ModernCardDesigner activeSection changed to:', activeSection);
  }, [activeSection]);

  const handleSectionChange = (section: ActiveSection) => {
    console.log('Changing section from', activeSection, 'to', section);
    setActiveSection(section);
  };

  const handleSave = () => saveCard(false);
  const handlePublish = () => saveCard(true);

  return (
    <div className="min-h-screen bg-slate-900">
      <CardDesignerHeader
        cardData={cardData}
        isLoading={isLoading}
        onSave={handleSave}
        onPublish={handlePublish}
      />

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6 h-[calc(100vh-12rem)]">
          <CardDesignerSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            cardData={cardData}
            uploadProgress={uploadProgress}
            updateCardData={updateCardData}
            updateDesignConfig={updateDesignConfig}
            uploadImage={uploadImage}
          />

          <div className="flex-1">
            <CardDesignerPreview cardData={cardData} />
          </div>
        </div>
      </div>
    </div>
  );
};
