
import * as THREE from 'three';

export class TextureManager {
  private static instance: TextureManager;
  private loader = new THREE.TextureLoader();
  private cache = new Map<string, THREE.Texture>();

  static getInstance(): TextureManager {
    if (!TextureManager.instance) {
      TextureManager.instance = new TextureManager();
    }
    return TextureManager.instance;
  }

  async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          // Configure texture for card rendering
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          texture.flipY = false;

          this.cache.set(url, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error('Failed to load texture:', url, error);
          reject(error);
        }
      );
    });
  }

  createFallbackTexture(color: number = 0x666666): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, 512, 512);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    
    return texture;
  }

  dispose(): void {
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
  }
}

export const textureManager = TextureManager.getInstance();
