
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export interface HDRILoadOptions {
  url: string;
  fallbackUrl?: string;
  onProgress?: (progress: number) => void;
  onLoad?: (texture: THREE.Texture) => void;
  onError?: (error: Error) => void;
}

export class HDRILoader {
  private static cache = new Map<string, THREE.Texture>();
  private static rgbeLoader = new RGBELoader();
  private static textureLoader = new THREE.TextureLoader();

  static async loadHDRI(options: HDRILoadOptions): Promise<THREE.Texture> {
    const { url, fallbackUrl, onProgress, onLoad, onError } = options;
    
    // Check cache first
    if (this.cache.has(url)) {
      const cachedTexture = this.cache.get(url)!;
      onLoad?.(cachedTexture);
      return cachedTexture;
    }

    return new Promise((resolve, reject) => {
      const loadTexture = (textureUrl: string, isFallback = false) => {
        // Determine if this is an HDRI file or regular texture
        const isHDRIFile = textureUrl.includes('.hdr') || textureUrl.includes('.exr');
        const loader = isHDRIFile ? this.rgbeLoader : this.textureLoader;
        
        console.log(`🔄 Loading ${isHDRIFile ? 'HDRI' : 'texture'}: ${textureUrl}`);
        
        loader.load(
          textureUrl,
          (texture) => {
            console.log(`✅ ${isFallback ? 'Fallback' : 'HDRI'} texture loaded:`, textureUrl);
            
            // Configure for HDRI/360° mapping
            this.configureHDRITexture(texture);
            
            // Cache the texture
            this.cache.set(url, texture);
            
            onLoad?.(texture);
            resolve(texture);
          },
          (progress) => {
            if (progress.total > 0) {
              const percent = (progress.loaded / progress.total) * 100;
              onProgress?.(percent);
            }
          },
          (error) => {
            console.error(`❌ ${isFallback ? 'Fallback' : 'HDRI'} loading failed:`, error);
            
            if (!isFallback && fallbackUrl) {
              console.log('🔄 Trying fallback URL...');
              loadTexture(fallbackUrl, true);
            } else {
              const errorMsg = new Error(`Failed to load ${isFallback ? 'fallback' : 'HDRI'} texture`);
              onError?.(errorMsg);
              reject(errorMsg);
            }
          }
        );
      };

      loadTexture(url);
    });
  }

  private static configureHDRITexture(texture: THREE.Texture): void {
    // Configure for equirectangular/360° mapping
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = false;
    
    // Enhanced filtering for quality
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    
    // Proper color space
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  static clearCache(): void {
    // Dispose of cached textures
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
    console.log('🧹 HDRI cache cleared');
  }

  static getCacheSize(): number {
    return this.cache.size;
  }
}
