import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { CardPreview } from '../CardPreview';
import { useCanvasCustomizer } from '../contexts/CanvasCustomizerContext';
import { CardCreationData } from '@/hooks/useCardCreation';

interface CardDesignerPreviewProps {
  cardData: CardCreationData;
}

export const CardDesignerPreview = ({ cardData }: CardDesignerPreviewProps) => {
  const { getCanvasStyles, getGridStyles, getCurrentTheme, canvasState } = useCanvasCustomizer();
  
  const currentTheme = getCurrentTheme();
  const canvasStyles = getCanvasStyles();
  const gridStyles = getGridStyles();

  console.log('CardDesignerPreview rendering with:', {
    selectedTheme: canvasState.selectedTheme,
    currentTheme: currentTheme?.name,
    backgroundImage: currentTheme?.backgroundImage,
    backgroundSize: canvasState.backgroundSize,
    backgroundOpacity: canvasState.backgroundOpacity
  });

  // Create a comprehensive themed workspace style
  const workspaceStyle: React.CSSProperties = {
    ...canvasStyles,
    minHeight: '100%',
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    // Add theme-specific border and shadow effects
    border: currentTheme?.borderColor ? `2px solid ${currentTheme.borderColor}` : '2px solid #334155',
    boxShadow: currentTheme?.shadowColor 
      ? `0 8px 32px ${currentTheme.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
      : '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
  };

  // Enhanced grid overlay style
  const gridOverlayStyle: React.CSSProperties = {
    ...gridStyles,
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 15,
  };

  // Enhanced background pattern style for CRD logo
  const backgroundPatternStyle: React.CSSProperties = currentTheme?.backgroundImage ? {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${currentTheme.backgroundImage})`,
    backgroundSize: `${canvasState.backgroundSize}px ${canvasState.backgroundSize}px`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    opacity: canvasState.backgroundOpacity,
    zIndex: 5,
    filter: 'brightness(1.4) contrast(1.5) saturate(1.2)',
    mixBlendMode: 'normal',
  } : {};

  // Log the actual style being applied
  console.log('Background pattern style:', backgroundPatternStyle);

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg h-full">
      <CardHeader className="pb-4 border-b border-slate-600">
        <CardTitle className="flex items-center gap-2 text-slate-100 text-lg">
          <Eye className="w-5 h-5 text-emerald-500" />
          Live Preview
          {currentTheme && (
            <span className="text-sm font-normal text-slate-400 ml-auto">
              Theme: {currentTheme.name}
              {currentTheme.backgroundImage && ' (with logo)'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full relative overflow-hidden">
        {/* Themed Canvas Workspace */}
        <div 
          className="absolute inset-0 transition-all duration-500 ease-out"
          style={workspaceStyle}
        >
          {/* Base Background Layer - z-index 1 */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: canvasState.customBackgroundColor,
              zIndex: 1,
            }}
          />
          
          {/* Background Pattern Layer (CRD Logo) - z-index 5 */}
          {currentTheme?.backgroundImage && (
            <div 
              style={backgroundPatternStyle}
              className="absolute inset-0 logo-pattern"
            />
          )}
          
          {/* Pattern Overlay Layer (for special patterns) - z-index 8 */}
          {currentTheme?.patternOverlay && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: currentTheme.patternOverlay,
                backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
                opacity: 0.3,
                zIndex: 8,
              }}
            />
          )}
          
          {/* Grid Overlay Layer - z-index 15 */}
          {canvasState.showGrid && (
            <div style={gridOverlayStyle} />
          )}
          
          {/* Theme-specific decorative elements - z-index 18 */}
          {currentTheme?.id === 'blueprint-blue' && (
            <>
              <div className="absolute top-4 left-4 text-blue-300/60 text-xs font-mono" style={{ zIndex: 18 }}>
                BLUEPRINT v2.1
              </div>
              <div className="absolute bottom-4 right-4 text-blue-300/40 text-xs" style={{ zIndex: 18 }}>
                SCALE 1:1
              </div>
            </>
          )}
          
          {currentTheme?.id === 'architect-green' && (
            <div className="absolute bottom-4 left-4 text-yellow-400/60 text-xs font-mono" style={{ zIndex: 18 }}>
              DRAFTING TABLE
            </div>
          )}

          {/* CRD Logo indicator */}
          {currentTheme?.id === 'crd' && (
            <div className="absolute top-4 right-4 text-emerald-400/60 text-xs font-mono" style={{ zIndex: 18 }}>
              CRD STUDIO
            </div>
          )}
        </div>
        
        {/* Card Preview - Positioned above everything else - z-index 25 */}
        <div className="relative p-8 flex items-start justify-center w-full h-full" style={{ zIndex: 25 }}>
          <div className="transform scale-110 mt-8 transition-transform duration-300 hover:scale-115">
            <CardPreview cardData={cardData} />
          </div>
        </div>

        {/* Theme transition overlay for smooth changes - z-index 30 */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-black/5" style={{ zIndex: 30 }} />
      </CardContent>
    </Card>
  );
};
