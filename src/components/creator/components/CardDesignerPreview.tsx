
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { CardPreview } from '../CardPreview';
import { useCanvasCustomizer } from '../contexts/CanvasCustomizerContext';
import { CardCreationData } from '@/hooks/useCardCreation';

interface CardDesignerPreviewProps {
  cardData: CardCreationData;
}

export const CardDesignerPreview = ({ cardData }: CardDesignerPreviewProps) => {
  const { getCanvasStyles, getCurrentTheme, canvasState } = useCanvasCustomizer();
  
  const currentTheme = getCurrentTheme();

  console.log('🖼️ CardDesignerPreview - Simplified view with only logo pattern:', {
    selectedTheme: canvasState.selectedTheme,
    currentTheme: currentTheme?.name,
    backgroundImage: currentTheme?.backgroundImage,
    backgroundSize: canvasState.backgroundSize,
    backgroundOpacity: canvasState.backgroundOpacity
  });

  // Enhanced background pattern style for maximum visibility
  const logoPatternStyle: React.CSSProperties = currentTheme?.backgroundImage ? {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${currentTheme.backgroundImage})`,
    backgroundSize: `${canvasState.backgroundSize}px ${canvasState.backgroundSize}px`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    opacity: canvasState.backgroundOpacity,
    // Maximum visibility settings
    filter: 'brightness(2) contrast(2) saturate(2)',
    mixBlendMode: 'normal',
    zIndex: 10,
  } : {};

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg h-full">
      <CardHeader className="pb-4 border-b border-slate-600">
        <CardTitle className="flex items-center gap-2 text-slate-100 text-lg">
          <Eye className="w-5 h-5 text-emerald-500" />
          CRD Logo Pattern Preview
          {currentTheme && (
            <span className="text-sm font-normal text-slate-400 ml-auto">
              {currentTheme.name} - Size: {canvasState.backgroundSize}px - Opacity: {Math.round((canvasState.backgroundOpacity || 0) * 100)}%
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full relative overflow-hidden">
        {/* Simple background container - only base color and logo pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: canvasState.customBackgroundColor,
          }}
        >
          {/* ONLY the CRD Logo Pattern - No other layers */}
          {currentTheme?.backgroundImage && (
            <div 
              style={logoPatternStyle}
              className="crd-logo-pattern-only"
            />
          )}
          
          {/* Simple centered message when no logo */}
          {!currentTheme?.backgroundImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <p className="text-lg font-medium">No Logo Pattern</p>
                <p className="text-sm">Select CRD theme to see logo pattern</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
