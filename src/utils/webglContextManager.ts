interface WebGLContextConfig {
  antialias?: boolean;
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
}

interface WebGLInfo {
  version: number;
  renderer: string;
  vendor: string;
  maxTextureSize: number;
  maxTextureUnits: number;
  extensions: string[];
}

class WebGLContextManager {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private isContextLost = false;
  private onContextLost?: () => void;
  private onContextRestored?: (gl: WebGLRenderingContext | WebGL2RenderingContext) => void;
  private restorationAttempts = 0;
  private maxRestorationAttempts = 3;

  constructor(
    canvas: HTMLCanvasElement,
    config: WebGLContextConfig = {},
    onContextLost?: () => void,
    onContextRestored?: (gl: WebGLRenderingContext | WebGL2RenderingContext) => void
  ) {
    this.canvas = canvas;
    this.onContextLost = onContextLost;
    this.onContextRestored = onContextRestored;
    this.setupContext(config);
    this.setupEventListeners();
  }

  private setupContext(config: WebGLContextConfig): boolean {
    if (!this.canvas) return false;

    const contextOptions: WebGLContextAttributes = {
      antialias: config.antialias ?? true,
      alpha: config.alpha ?? true,
      depth: config.depth ?? true,
      stencil: config.stencil ?? false,
      preserveDrawingBuffer: config.preserveDrawingBuffer ?? false,
      powerPreference: config.powerPreference ?? 'high-performance',
      failIfMajorPerformanceCaveat: false
    };

    // Try WebGL2 first, fallback to WebGL1 - Fix typing issue
    const webgl2Context = this.canvas.getContext('webgl2', contextOptions) as WebGL2RenderingContext | null;
    const webglContext = this.canvas.getContext('webgl', contextOptions) as WebGLRenderingContext | null;
    const experimentalContext = this.canvas.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext | null;
    
    this.gl = webgl2Context || webglContext || experimentalContext;

    if (!this.gl) {
      console.error('WebGL not supported');
      return false;
    }

    this.isContextLost = false;
    console.log('WebGL context created:', this.getWebGLInfo());
    return true;
  }

  private setupEventListeners(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('webglcontextlost', (event) => {
      console.warn('WebGL context lost');
      event.preventDefault();
      this.isContextLost = true;
      this.onContextLost?.();
    });

    this.canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      this.isContextLost = false;
      this.restorationAttempts = 0;
      
      if (this.gl && this.onContextRestored) {
        this.onContextRestored(this.gl);
      }
    });
  }

  public getContext(): WebGLRenderingContext | WebGL2RenderingContext | null {
    return this.gl;
  }

  public isWebGL2(): boolean {
    return this.gl instanceof WebGL2RenderingContext;
  }

  public getWebGLInfo(): WebGLInfo | null {
    if (!this.gl) return null;

    const debugInfo = this.gl.getExtension('WEBGL_debug_renderer_info');
    
    return {
      version: this.isWebGL2() ? 2 : 1,
      renderer: debugInfo ? this.gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
      vendor: debugInfo ? this.gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
      maxTextureSize: this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE),
      maxTextureUnits: this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS),
      extensions: this.gl.getSupportedExtensions() || []
    };
  }

  public checkForErrors(): string[] {
    if (!this.gl) return ['No WebGL context'];

    const errors: string[] = [];
    let error = this.gl.getError();
    
    while (error !== this.gl.NO_ERROR) {
      switch (error) {
        case this.gl.INVALID_ENUM:
          errors.push('INVALID_ENUM');
          break;
        case this.gl.INVALID_VALUE:
          errors.push('INVALID_VALUE');
          break;
        case this.gl.INVALID_OPERATION:
          errors.push('INVALID_OPERATION');
          break;
        case this.gl.OUT_OF_MEMORY:
          errors.push('OUT_OF_MEMORY');
          break;
        case this.gl.CONTEXT_LOST_WEBGL:
          errors.push('CONTEXT_LOST_WEBGL');
          this.isContextLost = true;
          break;
        default:
          errors.push(`Unknown error: ${error}`);
      }
      error = this.gl.getError();
    }

    return errors;
  }

  public isContextValid(): boolean {
    return !this.isContextLost && this.gl !== null;
  }

  public attemptContextRestoration(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.restorationAttempts >= this.maxRestorationAttempts) {
        console.error('Max context restoration attempts reached');
        resolve(false);
        return;
      }

      this.restorationAttempts++;
      console.log(`Attempting context restoration (attempt ${this.restorationAttempts})`);

      // Force context restoration
      if (this.canvas) {
        const loseContext = this.gl?.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.restoreContext();
        }
      }

      // Wait for restoration
      setTimeout(() => {
        resolve(this.isContextValid());
      }, 1000);
    });
  }

  public getMemoryInfo(): { textureMemory: number; bufferMemory: number } | null {
    if (!this.gl) return null;

    const memoryInfo = this.gl.getExtension('WEBGL_debug_renderer_info');
    if (!memoryInfo) return null;

    // These are estimates since WebGL doesn't expose actual memory usage
    return {
      textureMemory: 0, // Would need to track manually
      bufferMemory: 0   // Would need to track manually
    };
  }

  public dispose(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('webglcontextlost', () => {});
      this.canvas.removeEventListener('webglcontextrestored', () => {});
    }
    
    this.canvas = null;
    this.gl = null;
    this.onContextLost = undefined;
    this.onContextRestored = undefined;
  }
}

export { WebGLContextManager, type WebGLContextConfig, type WebGLInfo };
