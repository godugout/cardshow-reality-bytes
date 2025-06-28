
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { CardPreview } from '../CardPreview';
import { useCanvasCustomizer } from '../hooks/useCanvasCustomizer';
import { CardCreationData } from '@/hooks/useCardCreation';

interface CardDesignerPreviewProps {
  cardData: CardCreationData;
}

export const CardDesignerPreview = ({ cardData }: CardDesignerPreviewProps) => {
  const { getCanvasStyles, getGridStyles } = useCanvasCustomizer();

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg h-full">
      <CardHeader className="pb-4 border-b border-slate-600">
        <CardTitle className="flex items-center gap-2 text-slate-100 text-lg">
          <Eye className="w-5 h-5 text-emerald-500" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-start justify-center p-0 h-full relative overflow-hidden">
        {/* Canvas Background with Grid */}
        <div 
          className="absolute inset-0"
          style={getCanvasStyles()}
        >
          {/* Grid Overlay */}
          <div 
            className="absolute inset-0"
            style={getGridStyles()}
          />
        </div>
        
        {/* Card Preview */}
        <div className="relative z-10 p-8 flex items-start justify-center w-full h-full">
          <div className="transform scale-110 mt-8">
            <CardPreview cardData={cardData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
