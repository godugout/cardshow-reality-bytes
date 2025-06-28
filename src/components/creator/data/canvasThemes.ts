import type { CanvasTheme } from '../types/canvasTypes';

export const canvasThemes: CanvasTheme[] = [
  {
    id: 'crd-branded',
    name: 'CRD Branded',
    description: 'Professional CRD logo watermark pattern',
    backgroundColor: '#0f172a',
    gridColor: '#334155',
    gridSize: 20,
    gridOpacity: 0.3,
    showGrid: true,
    backgroundImage: '/lovable-uploads/ee2692c5-a584-445e-8845-81fc3e9c57f1.png',
    backgroundSize: 120,
    backgroundOpacity: 0.15,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: '#1e293b'
  },
  {
    id: 'drafting-classic',
    name: 'Drafting Table Classic',
    description: 'Traditional blueprint drafting aesthetic',
    backgroundColor: '#1a2332',
    gridColor: '#3a5a7a',
    gridSize: 20,
    gridOpacity: 0.3,
    showGrid: true,
    patternOverlay: 'linear-gradient(45deg, rgba(58, 90, 122, 0.1) 25%, transparent 25%, transparent 75%, rgba(58, 90, 122, 0.1) 75%)',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: '#2a3a4a'
  },
  {
    id: 'architect-green',
    name: 'Architect Green',
    description: 'Classic green drafting table with yellow grid',
    backgroundColor: '#1a3a1a',
    gridColor: '#ffeb3b',
    gridSize: 24,
    gridOpacity: 0.4,
    showGrid: true,
    patternOverlay: 'radial-gradient(circle at 50% 50%, rgba(255, 235, 59, 0.05) 0%, transparent 70%)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: '#2a4a2a'
  },
  {
    id: 'blueprint-blue',
    name: 'Blueprint Blue',
    description: 'Professional blueprint background',
    backgroundColor: '#0f1b2d',
    gridColor: '#4a90e2',
    gridSize: 16,
    gridOpacity: 0.5,
    showGrid: true,
    patternOverlay: 'linear-gradient(90deg, rgba(74, 144, 226, 0.1) 50%, transparent 50%)',
    shadowColor: 'rgba(74, 144, 226, 0.1)',
    borderColor: '#1f2b3d'
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Clean dark workspace',
    backgroundColor: '#1e1e1e',
    gridColor: '#404040',
    gridSize: 32,
    gridOpacity: 0.25,
    showGrid: true,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: '#2e2e2e'
  },
  {
    id: 'warm-studio',
    name: 'Warm Studio',
    description: 'Cozy design studio feel',
    backgroundColor: '#2d2520',
    gridColor: '#8b6914',
    gridSize: 28,
    gridOpacity: 0.3,
    showGrid: true,
    patternOverlay: 'radial-gradient(ellipse at center, rgba(139, 105, 20, 0.1) 0%, transparent 50%)',
    shadowColor: 'rgba(139, 105, 20, 0.2)',
    borderColor: '#3d3520'
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Clean light workspace',
    backgroundColor: '#f8f9fa',
    gridColor: '#dee2e6',
    gridSize: 20,
    gridOpacity: 0.6,
    showGrid: true,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    borderColor: '#e9ecef'
  }
];
