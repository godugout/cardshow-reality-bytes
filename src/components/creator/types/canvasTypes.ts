
export interface CanvasTheme {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  backgroundImage?: string;
  gridColor: string;
  gridSize: number;
  gridOpacity: number;
  showGrid: boolean;
  patternOverlay?: string;
  shadowColor?: string;
  borderColor?: string;
}

export interface CanvasCustomizerState {
  selectedTheme: string;
  customBackgroundColor: string;
  showGrid: boolean;
  gridSize: number;
  gridOpacity: number;
  gridColor: string;
}
