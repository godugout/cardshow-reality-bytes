
import * as THREE from 'three';

interface OptimizedTextureConfig {
  maxSize: number;
  quality: 'low' | 'medium' | 'high';
  enableMipmaps: boolean;
  anisotropy: number;
  format: THREE.PixelFormat;
}

interface TextureLoadOptions {
  priority: 'high' | 'medium' | 'low';
  lod: 'high' | 'medium' | 'low';
}

class OptimizedTextureManager {
  private textureCache = new Map<string, THREE.Texture>();
  private loadingQueue = new Map<string, Promise<THREE.Texture>>();
  private loadingPriorities = new Map<string, number>();
  private loader = new THREE.TextureLoader();
  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d')!;
  private maxCacheSize = 50; // Maximum textures to cache
  private memoryThreshold = 100 * 1024 * 1024; // 100MB threshold

  constructor() {
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  async loadTexture(url: string, config: OptimizedTextureConfig, options: TextureLoadOptions = { priority: 'medium', lod: 'medium' }): Promise<THREE.Texture> {
    const cacheKey = this.getCacheKey(url, config, options.lod);
    
    // Return cached texture if available
    if (this.textureCache.has(cacheKey)) {
      const texture = this.textureCache.get(cacheKey)!;
      texture.userData.lastUsed = Date.now();
      return texture;
    }

    // Return existing loading promise if in progress
    if (this.loadingQueue.has(cacheKey)) {
      return this.loadingQueue.get(cacheKey)!;
    }

    // Create loading promise
    const loadingPromise = this.loadTextureInternal(url, config, options);
    this.loadingQueue.set(cacheKey, loadingPromise);

    try {
      const texture = await loadingPromise;
      this.textureCache.set(cacheKey, texture);
      texture.userData.lastUsed = Date.now();
      texture.userData.size = this.estimateTextureSize(texture);
      
      // Clean up old textures if cache is full
      this.cleanupCache();
      
      return texture;
    } finally {
      this.loadingQueue.delete(cacheKey);
    }
  }

  private async loadTextureInternal(url: string, config: OptimizedTextureConfig, options: TextureLoadOptions): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const optimizedImage = this.optimizeImage(img, config, options.lod);
          const texture = new THREE.Texture(optimizedImage);
          
          this.configureTexture(texture, config);
          texture.needsUpdate = true;
          
          resolve(texture);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
      img.src = url;
    });
  }

  private optimizeImage(img: HTMLImageElement, config: OptimizedTextureConfig, lod: 'high' | 'medium' | 'low'): HTMLCanvasElement {
    const lodMultipliers = { high: 1, medium: 0.75, low: 0.5 };
    const multiplier = lodMultipliers[lod];
    
    const targetWidth = Math.min(img.width * multiplier, config.maxSize);
    const targetHeight = Math.min(img.height * multiplier, config.maxSize);
    
    // Ensure power of 2 for better GPU compatibility
    const width = this.nearestPowerOfTwo(targetWidth);
    const height = this.nearestPowerOfTwo(targetHeight);
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Clear and draw optimized image
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(img, 0, 0, width, height);
    
    return this.canvas;
  }

  private configureTexture(texture: THREE.Texture, config: OptimizedTextureConfig): void {
    texture.format = config.format;
    texture.generateMipmaps = config.enableMipmaps;
    texture.anisotropy = config.anisotropy;
    
    if (config.enableMipmaps) {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
    } else {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
    
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  private getCacheKey(url: string, config: OptimizedTextureConfig, lod: string): string {
    return `${url}_${config.quality}_${config.maxSize}_${lod}`;
  }

  private nearestPowerOfTwo(value: number): number {
    return Math.pow(2, Math.round(Math.log2(value)));
  }

  private estimateTextureSize(texture: THREE.Texture): number {
    if (!texture.image) return 0;
    const width = texture.image.width || 512;
    const height = texture.image.height || 512;
    return width * height * 4; // 4 bytes per pixel (RGBA)
  }

  private cleanupCache(): void {
    const entries = Array.from(this.textureCache.entries());
    
    // If cache is too large, remove oldest unused textures
    if (entries.length > this.maxCacheSize) {
      entries.sort((a, b) => (a[1].userData.lastUsed || 0) - (b[1].userData.lastUsed || 0));
      
      const toRemove = entries.slice(0, entries.length - this.maxCacheSize);
      toRemove.forEach(([key, texture]) => {
        texture.dispose();
        this.textureCache.delete(key);
      });
    }

    // Check memory usage and cleanup if needed
    const totalMemory = entries.reduce((sum, [, texture]) => sum + (texture.userData.size || 0), 0);
    if (totalMemory > this.memoryThreshold) {
      console.warn(`Texture memory usage high: ${(totalMemory / 1024 / 1024).toFixed(2)}MB`);
      this.forceCleanup();
    }
  }

  private forceCleanup(): void {
    const entries = Array.from(this.textureCache.entries());
    entries.sort((a, b) => (a[1].userData.lastUsed || 0) - (b[1].userData.lastUsed || 0));
    
    const toRemove = entries.slice(0, Math.floor(entries.length * 0.3)); // Remove 30% oldest
    toRemove.forEach(([key, texture]) => {
      texture.dispose();
      this.textureCache.delete(key);
    });
  }

  public dispose(): void {
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
    this.loadingQueue.clear();
  }

  public getMetrics() {
    const totalTextures = this.textureCache.size;
    const totalMemory = Array.from(this.textureCache.values())
      .reduce((sum, texture) => sum + (texture.userData.size || 0), 0);
    
    return {
      totalTextures,
      totalMemoryMB: totalMemory / 1024 / 1024,
      loadingQueue: this.loadingQueue.size
    };
  }
}

export const optimizedTextureManager = new OptimizedTextureManager();
export { OptimizedTextureManager, type OptimizedTextureConfig, type TextureLoadOptions };
