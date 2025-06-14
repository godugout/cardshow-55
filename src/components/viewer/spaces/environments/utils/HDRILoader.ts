
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
    
    console.log('🌍 HDRI Loading Request:', {
      primaryUrl: url,
      fallbackUrl,
      cached: this.cache.has(url)
    });
    
    // Check cache first
    if (this.cache.has(url)) {
      const cachedTexture = this.cache.get(url)!;
      console.log('✅ Using cached HDRI texture');
      onLoad?.(cachedTexture);
      return cachedTexture;
    }

    return new Promise((resolve, reject) => {
      const loadTexture = (textureUrl: string, isFallback = false) => {
        // Determine if this is an HDRI file or regular texture
        const isHDRIFile = textureUrl.includes('.hdr') || textureUrl.includes('.exr');
        const loader = isHDRIFile ? this.rgbeLoader : this.textureLoader;
        
        console.log(`🔄 Loading ${isHDRIFile ? 'HDRI' : 'fallback'} texture:`, {
          url: textureUrl,
          type: isHDRIFile ? 'HDR/EXR' : 'JPG/PNG',
          isFallback
        });
        
        loader.load(
          textureUrl,
          (texture) => {
            console.log(`✅ ${isFallback ? 'Fallback' : 'HDRI'} texture loaded successfully:`, {
              url: textureUrl,
              dimensions: `${texture.image?.width || 'unknown'}x${texture.image?.height || 'unknown'}`,
              format: texture.format,
              type: texture.type
            });
            
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
              console.log(`📊 Loading progress: ${percent.toFixed(1)}%`);
              onProgress?.(percent);
            }
          },
          (error) => {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`❌ ${isFallback ? 'Fallback' : 'HDRI'} loading failed:`, {
              url: textureUrl,
              error: errorMessage,
              isFallback
            });
            
            if (!isFallback && fallbackUrl) {
              console.log('🔄 Attempting fallback URL...');
              loadTexture(fallbackUrl, true);
            } else {
              console.error('💥 All loading attempts failed, creating procedural fallback');
              const proceduralTexture = this.createProceduralFallback();
              this.cache.set(url, proceduralTexture);
              onLoad?.(proceduralTexture);
              resolve(proceduralTexture);
            }
          }
        );
      };

      loadTexture(url);
    });
  }

  private static configureHDRITexture(texture: THREE.Texture): void {
    console.log('⚙️ Configuring texture for 360° HDRI mapping');
    
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
    
    console.log('✨ HDRI texture configuration complete');
  }

  private static createProceduralFallback(): THREE.Texture {
    console.log('🎨 Creating procedural 360° fallback environment');
    
    // Create a procedural 360° gradient texture
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Create equirectangular gradient (sky to ground)
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.4, '#98FB98'); // Light green
    gradient.addColorStop(0.7, '#90EE90'); // Pale green
    gradient.addColorStop(1, '#228B22'); // Forest green
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add some procedural clouds/variation
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 400; // Upper portion only
      const radius = 20 + Math.random() * 60;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    this.configureHDRITexture(texture);
    
    console.log('🎨 Procedural fallback environment created');
    return texture;
  }

  static clearCache(): void {
    console.log(`🧹 Clearing HDRI cache (${this.cache.size} items)`);
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
  }

  static getCacheSize(): number {
    return this.cache.size;
  }

  static getCacheInfo(): Array<{url: string, dimensions: string}> {
    const info: Array<{url: string, dimensions: string}> = [];
    this.cache.forEach((texture, url) => {
      info.push({
        url,
        dimensions: texture.image ? `${texture.image.width}x${texture.image.height}` : 'unknown'
      });
    });
    return info;
  }
}
