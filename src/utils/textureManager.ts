import * as THREE from 'three';

interface TextureConfig {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  enableCompression: boolean;
  maxSize: number;
  generateMipmaps: boolean;
  anisotropy: number;
}

interface TextureMetrics {
  memoryUsage: number;
  activeTextures: number;
  compressionRatio: number;
}

class TextureManager {
  private textureCache = new Map<string, THREE.Texture>();
  private loadingPromises = new Map<string, Promise<THREE.Texture>>();
  private textureLoader = new THREE.TextureLoader();
  private compressedTextureLoader: any = null;
  private metrics: TextureMetrics = {
    memoryUsage: 0,
    activeTextures: 0,
    compressionRatio: 1
  };

  constructor() {
    // Try to load compressed texture loader if available
    try {
      // This would be a compressed texture loader if available
      // For now, we'll use the standard loader
      this.compressedTextureLoader = this.textureLoader;
    } catch (error) {
      console.warn('Compressed texture loader not available');
    }
  }

  public async loadTexture(
    url: string, 
    config: TextureConfig = {
      quality: 'medium',
      enableCompression: false,
      maxSize: 1024,
      generateMipmaps: true,
      anisotropy: 4
    }
  ): Promise<THREE.Texture> {
    // Check cache first
    const cacheKey = this.getCacheKey(url, config);
    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    // Start loading
    const loadingPromise = this.loadTextureInternal(url, config);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const texture = await loadingPromise;
      this.textureCache.set(cacheKey, texture);
      this.updateMetrics();
      return texture;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private async loadTextureInternal(url: string, config: TextureConfig): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      // Create an image to get dimensions first
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Calculate optimal size based on config and original dimensions
        const optimalSize = this.calculateOptimalSize(img.width, img.height, config);
        
        // Create canvas for resizing if needed
        let finalImage: HTMLImageElement | HTMLCanvasElement = img;
        
        if (optimalSize.width !== img.width || optimalSize.height !== img.height) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = optimalSize.width;
          canvas.height = optimalSize.height;
          
          // Use high-quality scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, optimalSize.width, optimalSize.height);
          
          finalImage = canvas;
        }

        // Create Three.js texture
        const texture = new THREE.Texture(finalImage);
        this.configureTexture(texture, config);
        texture.needsUpdate = true;

        resolve(texture);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load texture: ${url}`));
      };

      img.src = url;
    });
  }

  private calculateOptimalSize(originalWidth: number, originalHeight: number, config: TextureConfig): { width: number; height: number } {
    const qualityMultipliers = {
      low: 0.5,
      medium: 0.75,
      high: 1.0,
      ultra: 1.5
    };

    const multiplier = qualityMultipliers[config.quality];
    const targetWidth = Math.min(originalWidth * multiplier, config.maxSize);
    const targetHeight = Math.min(originalHeight * multiplier, config.maxSize);

    // Ensure power of 2 for better GPU compatibility
    return {
      width: this.nearestPowerOfTwo(targetWidth),
      height: this.nearestPowerOfTwo(targetHeight)
    };
  }

  private nearestPowerOfTwo(value: number): number {
    return Math.pow(2, Math.round(Math.log2(value)));
  }

  private configureTexture(texture: THREE.Texture, config: TextureConfig): void {
    // Set filtering based on quality
    if (config.quality === 'low') {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    } else {
      texture.minFilter = config.generateMipmaps ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }

    // Set anisotropic filtering
    texture.anisotropy = config.anisotropy;

    // Enable mipmaps if requested
    texture.generateMipmaps = config.generateMipmaps;

    // Set wrapping - Fix: Use correct Three.js constant names
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  private getCacheKey(url: string, config: TextureConfig): string {
    return `${url}_${config.quality}_${config.maxSize}_${config.anisotropy}`;
  }

  private updateMetrics(): void {
    let memoryUsage = 0;
    let activeTextures = 0;

    this.textureCache.forEach((texture) => {
      if (texture.image) {
        const width = texture.image.width || 512;
        const height = texture.image.height || 512;
        // Estimate 4 bytes per pixel (RGBA)
        memoryUsage += width * height * 4;
        activeTextures++;
      }
    });

    this.metrics = {
      memoryUsage: memoryUsage / (1024 * 1024), // Convert to MB
      activeTextures,
      compressionRatio: 1 // Would be calculated if using compressed textures
    };
  }

  public getMetrics(): TextureMetrics {
    return { ...this.metrics };
  }

  public clearCache(): void {
    this.textureCache.forEach((texture) => {
      texture.dispose();
    });
    this.textureCache.clear();
    this.loadingPromises.clear();
    this.updateMetrics();
  }

  public clearUnusedTextures(): void {
    const texturesToRemove: string[] = [];
    
    this.textureCache.forEach((texture, key) => {
      // Check if texture is still referenced (this is a simplified check)
      if (texture.userData.lastUsed && Date.now() - texture.userData.lastUsed > 300000) { // 5 minutes
        texture.dispose();
        texturesToRemove.push(key);
      }
    });

    texturesToRemove.forEach(key => {
      this.textureCache.delete(key);
    });

    this.updateMetrics();
  }

  public markTextureUsed(texture: THREE.Texture): void {
    texture.userData.lastUsed = Date.now();
  }

  public dispose(): void {
    this.clearCache();
  }
}

export { TextureManager, type TextureConfig, type TextureMetrics };
