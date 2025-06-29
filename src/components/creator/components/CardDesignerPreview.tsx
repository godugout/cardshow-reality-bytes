
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
    hasCardImage: !!cardData.imageUrl,
    imageUrl: cardData.imageUrl
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
    zIndex: 2,
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
    zIndex: 1,
    filter: 'brightness(0.8) contrast(1.1)',
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
          {/* Background Pattern Layer (CRD Logo, etc.) - z-index 1 */}
          {currentTheme?.backgroundImage && (
            <div style={backgroundPatternStyle} />
          )}
          
          {/* Pattern Overlay Layer (for special patterns) - z-index 3 */}
          {currentTheme?.patternOverlay && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: currentTheme.patternOverlay,
                backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
                opacity: 0.3,
                zIndex: 3,
              }}
            />
          )}
          
          {/* Grid Overlay Layer - z-index 2 */}
          {canvasState.showGrid && (
            <div style={gridOverlayStyle} />
          )}
          
          {/* Theme-specific decorative elements - z-index 4 */}
          {currentTheme?.id === 'crd-branded' && (
            <div className="absolute top-4 right-4" style={{ zIndex: 4 }}>
              <div className="bg-black/20 p-2 rounded backdrop-blur-sm">
                <img 
                  src="/lovable-uploads/ee2692c5-a584-445e-8845-81fc3e9c57f1.png" 
                  alt="CRD Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    console.error('CRD Logo failed to load:', e);
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
              <div className="absolute top-4 left-4 text-blue-300/60 text-xs font-mono" style={{ zIndex: 4 }}>
                BLUEPRINT v2.1
              </div>
              <div className="absolute bottom-4 right-4 text-blue-300/40 text-xs" style={{ zIndex: 4 }}>
                SCALE 1:1
              </div>
            </>
          )}
          
          {currentTheme?.id === 'architect-green' && (
            <div className="absolute bottom-4 left-4 text-yellow-400/60 text-xs font-mono" style={{ zIndex: 4 }}>
              DRAFTING TABLE
            </div>
          )}
        </div>
        
        {/* Card Preview Container - HIGHEST z-index with enhanced visibility */}
        <div className="relative flex items-center justify-center w-full h-full p-8" style={{ zIndex: 100 }}>
          {/* Enhanced card container with better visual prominence */}
          <div 
            className="relative transition-all duration-300 hover:scale-105 shadow-2xl"
            style={{
              width: '280px',  // Slightly larger for better visibility
              height: '392px', // Maintaining aspect ratio
              aspectRatio: '2.5 / 3.5',
              zIndex: 101,
              // Enhanced drop shadow for better card separation
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))',
            }}
          >
            {/* Card spotlight background for better contrast */}
            <div 
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)',
                zIndex: -1,
                transform: 'scale(1.4)',
                opacity: 0.8,
              }}
            />
            
            {/* Secondary glow for themed environments */}
            {currentTheme && (
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `radial-gradient(ellipse at center, ${currentTheme.primaryColor || '#10B981'}20 0%, transparent 70%)`,
                  zIndex: -2,
                  transform: 'scale(1.6)',
                  opacity: 0.6,
                }}
              />
            )}
            
            <CardPreview cardData={cardData} />
          </div>
        </div>

        {/* Enhanced theme transition overlay for smooth changes */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{ 
            zIndex: 5,
            background: currentTheme?.id === 'dark-void' 
              ? 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(75,0,130,0.05) 100%)'
              : currentTheme?.id === 'blueprint-blue'
              ? 'linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, transparent 100%)'
          }} 
        />
        
        {/* Theme indicator in bottom corner */}
        {currentTheme && (
          <div className="absolute bottom-2 left-2 text-xs text-white/40 font-mono" style={{ zIndex: 6 }}>
            {currentTheme.name}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
