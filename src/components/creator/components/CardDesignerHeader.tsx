
import { ContextualButton } from '@/components/ui/contextual-button';
import { ContextualBadge } from '@/components/ui/contextual-badge';
import { Save, Rocket } from 'lucide-react';
import { CardCreationData } from '@/hooks/useCardCreation';

interface CardDesignerHeaderProps {
  cardData: CardCreationData;
  isLoading: boolean;
  onSave: () => void;
  onPublish: () => void;
}

export const CardDesignerHeader = ({ 
  cardData, 
  isLoading, 
  onSave, 
  onPublish 
}: CardDesignerHeaderProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Card Designer</h1>
            <ContextualBadge 
              context="cards" 
              variant="secondary" 
              className="text-cards border-cards/20 bg-cards/10"
            >
              {cardData.creationMode === 'basic' ? 'Basic Mode' : 'Studio Mode'}
            </ContextualBadge>
          </div>
          
          <div className="flex items-center gap-3">
            <ContextualButton
              context="cards"
              variant="outline"
              onClick={onSave}
              disabled={isLoading || !cardData.title.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </ContextualButton>
            <ContextualButton
              context="cards"
              onClick={onPublish}
              disabled={isLoading || !cardData.title.trim()}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Publish
            </ContextualButton>
          </div>
        </div>
      </div>
    </div>
  );
};
