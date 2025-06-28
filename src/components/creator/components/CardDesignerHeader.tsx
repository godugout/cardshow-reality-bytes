
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-100">Card Designer</h1>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/50 bg-emerald-500/10">
              {cardData.creationMode === 'basic' ? 'Basic Mode' : 'Studio Mode'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onSave}
              disabled={isLoading || !cardData.title.trim()}
              className="bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={onPublish}
              disabled={isLoading || !cardData.title.trim()}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
