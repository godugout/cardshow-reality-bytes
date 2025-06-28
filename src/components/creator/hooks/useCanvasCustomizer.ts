
import { useState, useCallback } from 'react';
import type { CanvasCustomizerState, CanvasTheme } from '../types/canvasTypes';
import { canvasThemes } from '../data/canvasThemes';

const defaultCanvasState: CanvasCustomizerState = {
  selectedTheme: 'drafting-classic',
  customBackgroundColor: '#1a2332',
  showGrid: true,
  gridSize: 20,
  gridOpacity: 0.3,
  gridColor: '#3a5a7a',
};

export const useCanvasCustomizer = () => {
  const [canvasState, setCanvasState] = useState<CanvasCustomizerState>(defaultCanvasState);

  const updateCanvasState = useCallback((updates: Partial<CanvasCustomizerState>) => {
    setCanvasState(prev => ({ ...prev, ...updates }));
  }, []);

  const selectTheme = useCallback((themeId: string) => {
    const theme = canvasThemes.find(t => t.id === themeId);
    if (theme) {
      setCanvasState({
        selectedTheme: themeId,
        customBackgroundColor: theme.backgroundColor,
        showGrid: theme.showGrid,
        gridSize: theme.gridSize,
        gridOpacity: theme.gridOpacity,
        gridColor: theme.gridColor,
      });
    }
  }, []);

  const getCurrentTheme = useCallback((): CanvasTheme | null => {
    return canvasThemes.find(t => t.id === canvasState.selectedTheme) || null;
  }, [canvasState.selectedTheme]);

  const getCanvasStyles = useCallback(() => {
    const theme = getCurrentTheme();
    const baseStyles = {
      backgroundColor: canvasState.customBackgroundColor,
    };

    if (theme?.patternOverlay) {
      return {
        ...baseStyles,
        backgroundImage: theme.patternOverlay,
        backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
      };
    }

    return baseStyles;
  }, [canvasState, getCurrentTheme]);

  const getGridStyles = useCallback(() => {
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

  return {
    canvasState,
    updateCanvasState,
    selectTheme,
    getCurrentTheme,
    getCanvasStyles,
    getGridStyles,
    availableThemes: canvasThemes,
  };
};
