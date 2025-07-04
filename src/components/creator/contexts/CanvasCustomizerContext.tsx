
import React, { createContext, useContext, useState, useCallback } from 'react';
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
  backgroundOpacity: 0.15,
};

export const CanvasCustomizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canvasState, setCanvasState] = useState<CanvasCustomizerState>(defaultCanvasState);

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
        backgroundOpacity: theme.backgroundOpacity || 0.15,
      };
      console.log('Theme selected, updating state to:', newState);
      setCanvasState(newState);
    }
  }, []);

  const getCurrentTheme = useCallback((): CanvasTheme | null => {
    return canvasThemes.find(t => t.id === canvasState.selectedTheme) || null;
  }, [canvasState.selectedTheme]);

  const getCanvasStyles = useCallback((): React.CSSProperties => {
    const theme = getCurrentTheme();
    const baseStyles: React.CSSProperties = {
      backgroundColor: canvasState.customBackgroundColor,
      transition: 'all 0.5s ease-out',
    };

    // Handle background image (like CRD logo)
    if (theme?.backgroundImage) {
      return {
        ...baseStyles,
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: `${canvasState.backgroundSize || 120}px ${canvasState.backgroundSize || 120}px`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
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
    throw new Error('useCanvasCustomizer must be used within a CanvasCustomizerProvider');
  }
  return context;
};
