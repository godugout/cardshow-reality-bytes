
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
    canvasStyles,
    gridStyles,
    backgroundImage: currentTheme?.backgroundImage
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
    zIndex: 10, // Increased z-index to be above background layers
  };

  // Background pattern style for CRD logo - with higher opacity and proper z-index
  const backgroundPatternStyle: React.CSSProperties = currentTheme?.backgroundImage ? {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${currentTheme.backgroundImage})`,
    backgroundSize: `${canvasState.backgroundSize}px ${canvasState.backgroundSize}px`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    opacity: Math.max(canvasState.backgroundOpacity, 0.25), // Ensure minimum visibility
    zIndex: 3, // Higher z-index to be visible
    filter: 'brightness(1.1) contrast(1.2)', // Enhanced visibility
  } : {};

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg h-full">
      <CardHeader className="pb-4 border-b border-slate-600">
        <CardTitle className="flex items-center gap-2 text-slate-100 text-lg">
          <Eye className="w-5 h-5 text-emerald-500" />
          Live Preview
          {currentTheme && (
            <span className="text-sm font-normal text-slate-400 ml-auto">
              Theme: {currentTheme.name}
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
          
          {/* Background Pattern Layer (CRD Logo) - z-index 3 */}
          {currentTheme?.backgroundImage && (
            <div 
              style={backgroundPatternStyle}
              className="absolute inset-0"
            />
          )}
          
          {/* Pattern Overlay Layer (for special patterns) - z-index 5 */}
          {currentTheme?.patternOverlay && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: currentTheme.patternOverlay,
                backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
                opacity: 0.3,
                zIndex: 5,
              }}
            />
          )}
          
          {/* Grid Overlay Layer - z-index 10 */}
          {canvasState.showGrid && (
            <div style={gridOverlayStyle} />
          )}
          
          {/* Theme-specific decorative elements - z-index 12 */}
          {currentTheme?.id === 'crd-branded' && (
            <div className="absolute top-4 right-4" style={{ zIndex: 12 }}>
              <div className="text-xs text-white/70 font-bold bg-gradient-to-r from-orange-500/30 to-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                CRD Studio
              </div>
            </div>
          )}
          
          {currentTheme?.id === 'blueprint-blue' && (
            <>
              <div className="absolute top-4 left-4 text-blue-300/60 text-xs font-mono" style={{ zIndex: 12 }}>
                BLUEPRINT v2.1
              </div>
              <div className="absolute bottom-4 right-4 text-blue-300/40 text-xs" style={{ zIndex: 12 }}>
                SCALE 1:1
              </div>
            </>
          )}
          
          {currentTheme?.id === 'architect-green' && (
            <div className="absolute bottom-4 left-4 text-yellow-400/60 text-xs font-mono" style={{ zIndex: 12 }}>
              DRAFTING TABLE
            </div>
          )}
        </div>
        
        {/* Card Preview - Positioned above everything else - z-index 20 */}
        <div className="relative p-8 flex items-start justify-center w-full h-full" style={{ zIndex: 20 }}>
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
