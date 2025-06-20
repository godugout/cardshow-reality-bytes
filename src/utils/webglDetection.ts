
export const detectWebGLSupport = (): { supported: boolean; version: number } => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return { supported: false, version: 0 };
    }

    const version = gl.getParameter(gl.VERSION);
    const renderer = gl.getParameter(gl.RENDERER);
    
    // Check for minimum requirements
    const hasFloatTextures = gl.getExtension('OES_texture_float');
    const hasStandardDerivatives = gl.getExtension('OES_standard_derivatives');
    
    return {
      supported: !!(hasFloatTextures && hasStandardDerivatives),
      version: version.includes('WebGL 2.0') ? 2 : 1
    };
  } catch (error) {
    return { supported: false, version: 0 };
  }
};

export const getDevicePerformanceTier = (): 'low' | 'medium' | 'high' => {
  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) return 'low';
  
  // Check memory (if available)
  const memory = (navigator as any).deviceMemory;
  if (memory) {
    if (memory >= 8) return 'high';
    if (memory >= 4) return 'medium';
    return 'low';
  }
  
  // Fallback to medium
  return 'medium';
};
