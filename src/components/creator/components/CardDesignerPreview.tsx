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
    gridStyles
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
    zIndex: 1,
  };

  // Background pattern style (for CRD logo or other patterns)
  const backgroundPatternStyle: React.CSSProperties = currentTheme?.backgroundImage ? {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${currentTheme.backgroundImage})`,
    backgroundSize: `${canvasState.backgroundSize}px ${canvasState.backgroundSize}px`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    opacity: canvasState.backgroundOpacity,
    zIndex: 0,
    filter: 'brightness(0.8) contrast(1.1)', // Subtle enhancement for better theme effect
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
          {/* Background Pattern Layer (CRD Logo, etc.) */}
          {currentTheme?.backgroundImage && (
            <div style={backgroundPatternStyle} />
          )}
          
          {/* Pattern Overlay Layer (for special patterns) */}
          {currentTheme?.patternOverlay && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: currentTheme.patternOverlay,
                backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
                opacity: 0.3,
                zIndex: 1,
              }}
            />
          )}
          
          {/* Grid Overlay Layer */}
          {canvasState.showGrid && (
            <div style={gridOverlayStyle} />
          )}
          
          {/* Theme-specific decorative elements */}
          {currentTheme?.id === 'crd-branded' && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-black/20 p-2 rounded backdrop-blur-sm">
                <img 
                  src="/lovable-uploads/ee2692c5-a584-445e-8845-81fc3e9c57f1.png" 
                  alt="CRD Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    console.error('CRD Logo failed to load:', e);
                    // Fallback to text if image fails
                    e.currentTarget.style.display = 'none';
                    const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallbackElement) {
                      fallbackElement.style.display = 'block';
                    }
                  }}
                />
                <span className="text-xs text-white/60 font-mono hidden">CRD</span>
              </div>
            </div>
          )}
          
          {currentTheme?.id === 'blueprint-blue' && (
            <>
              <div className="absolute top-4 left-4 z-10 text-blue-300/60 text-xs font-mono">
                BLUEPRINT v2.1
              </div>
              <div className="absolute bottom-4 right-4 z-10 text-blue-300/40 text-xs">
                SCALE 1:1
              </div>
            </>
          )}
          
          {currentTheme?.id === 'architect-green' && (
            <div className="absolute bottom-4 left-4 z-10 text-yellow-400/60 text-xs font-mono">
              DRAFTING TABLE
            </div>
          )}
        </div>
        
        {/* Card Preview - Positioned above the themed workspace */}
        <div className="relative z-20 p-8 flex items-start justify-center w-full h-full">
          <div className="transform scale-110 mt-8 transition-transform duration-300 hover:scale-115">
            <CardPreview cardData={cardData} />
          </div>
        </div>

        {/* Theme transition overlay for smooth changes */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-black/5 z-30" />
      </CardContent>
    </Card>
  );
};
