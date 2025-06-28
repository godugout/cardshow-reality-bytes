
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CanvasCustomizerState, CanvasTheme } from '../types/canvasTypes';
import { canvasThemes } from '../data/canvasThemes';

interface CanvasCustomizerContextValue {
  canvasState: CanvasCustomizerState;
  updateCanvasState: (updates: Partial<CanvasCustomizerState>) => void;
  selectTheme: (themeId: string) => void;
  getCurrentTheme: () => CanvasTheme | null;
  getCanvasStyles: () => React.CSSProperties;
  getGridStyles: () => React.CSSProperties;
  availableThemes: CanvasTheme[];
}

const CanvasCustomizerContext = createContext<CanvasCustomizerContextValue | null>(null);

const defaultCanvasState: CanvasCustomizerState = {
  selectedTheme: 'crd-branded',
  customBackgroundColor: '#0f172a',
  showGrid: true,
  gridSize: 20,
  gridOpacity: 0.3,
  gridColor: '#334155',
  backgroundSize: 120,
  backgroundOpacity: 0.25, // Increased default opacity for better visibility
};

export const CanvasCustomizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canvasState, setCanvasState] = useState<CanvasCustomizerState>(defaultCanvasState);

  // Debug logging
  useEffect(() => {
    console.log('CanvasCustomizerProvider initialized with state:', canvasState);
  }, []);

  const updateCanvasState = useCallback((updates: Partial<CanvasCustomizerState>) => {
    console.log('Canvas state updating:', updates);
    setCanvasState(prev => {
      const newState = { ...prev, ...updates };
      console.log('New canvas state:', newState);
      return newState;
    });
  }, []);

  const selectTheme = useCallback((themeId: string) => {
    console.log('Selecting theme:', themeId);
    const theme = canvasThemes.find(t => t.id === themeId);
    if (theme) {
      const newState = {
        selectedTheme: themeId,
        customBackgroundColor: theme.backgroundColor,
        showGrid: theme.showGrid,
        gridSize: theme.gridSize,
        gridOpacity: theme.gridOpacity,
        gridColor: theme.gridColor,
        backgroundSize: theme.backgroundSize || 120,
        backgroundOpacity: Math.max(theme.backgroundOpacity || 0.25, 0.25), // Ensure minimum visibility
      };
      console.log('Theme selected, updating state to:', newState);
      setCanvasState(newState);
    }
  }, []);

  const getCurrentTheme = useCallback((): CanvasTheme | null => {
    const theme = canvasThemes.find(t => t.id === canvasState.selectedTheme);
    console.log('Getting current theme:', theme?.name || 'None found');
    return theme || null;
  }, [canvasState.selectedTheme]);

  const getCanvasStyles = useCallback((): React.CSSProperties => {
    const theme = getCurrentTheme();
    const baseStyles: React.CSSProperties = {
      backgroundColor: canvasState.customBackgroundColor,
      transition: 'all 0.5s ease-out',
    };

    console.log('Getting canvas styles for theme:', theme?.name, 'with backgroundImage:', theme?.backgroundImage);

    // Handle background image (like CRD logo)
    if (theme?.backgroundImage) {
      return {
        ...baseStyles,
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: `${canvasState.backgroundSize || 120}px ${canvasState.backgroundSize || 120}px`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        backgroundBlendMode: 'multiply',
      };
    }

    // Handle pattern overlay
    if (theme?.patternOverlay) {
      return {
        ...baseStyles,
        backgroundImage: theme.patternOverlay,
        backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
      };
    }

    return baseStyles;
  }, [canvasState, getCurrentTheme]);

  const getGridStyles = useCallback((): React.CSSProperties => {
    if (!canvasState.showGrid) return {};

    return {
      backgroundImage: `
        linear-gradient(${canvasState.gridColor} 1px, transparent 1px),
        linear-gradient(90deg, ${canvasState.gridColor} 1px, transparent 1px)
      `,
      backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
      opacity: canvasState.gridOpacity,
    };
  }, [canvasState]);

  const value: CanvasCustomizerContextValue = {
    canvasState,
    updateCanvasState,
    selectTheme,
    getCurrentTheme,
    getCanvasStyles,
    getGridStyles,
    availableThemes: canvasThemes,
  };

  return (
    <CanvasCustomizerContext.Provider value={value}>
      {children}
    </CanvasCustomizerContext.Provider>
  );
};

export const useCanvasCustomizer = (): CanvasCustomizerContextValue => {
  const context = useContext(CanvasCustomizerContext);
  if (!context) {
    console.error('useCanvasCustomizer must be used within a CanvasCustomizerProvider');
    throw new Error('useCanvasCustomizer must be used within a CanvasCustomizerProvider');
  }
  return context;
};
