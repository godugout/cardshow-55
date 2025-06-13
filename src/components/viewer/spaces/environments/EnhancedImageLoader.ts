
import * as THREE from 'three';

interface ImageQualityOptions {
  baseSize: { width: number; height: number };
  highQualitySize: { width: number; height: number };
  compressionQuality: number;
}

interface GradientColors {
  primary: string;
  secondary: string;
  tertiary?: string;
}

export class EnhancedImageLoader {
  private loader = new THREE.TextureLoader();
  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d')!;

  async loadOptimizedTexture(
    imageUrl: string,
    options: ImageQualityOptions = {
      baseSize: { width: 1024, height: 512 },
      highQualitySize: { width: 2048, height: 1024 },
      compressionQuality: 0.8
    }
  ): Promise<THREE.Texture> {
    try {
      // Load the original image
      const image = await this.loadImage(imageUrl);
      
      // Create optimized texture with proper scaling
      const optimizedTexture = this.createOptimizedTexture(image, options);
      
      return optimizedTexture;
    } catch (error) {
      console.warn('Failed to load image, using fallback:', error);
      return this.createGradientFallback(this.extractColorsFromUrl(imageUrl));
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private createOptimizedTexture(image: HTMLImageElement, options: ImageQualityOptions): THREE.Texture {
    const { baseSize } = options;
    
    // Set canvas size to optimized dimensions
    this.canvas.width = baseSize.width;
    this.canvas.height = baseSize.height;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, baseSize.width, baseSize.height);
    
    // Calculate scaling to maintain aspect ratio and fill canvas
    const imageAspect = image.width / image.height;
    const canvasAspect = baseSize.width / baseSize.height;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    
    if (imageAspect > canvasAspect) {
      // Image is wider than canvas - fit height and crop width
      drawHeight = baseSize.height;
      drawWidth = drawHeight * imageAspect;
      offsetX = (baseSize.width - drawWidth) / 2;
    } else {
      // Image is taller than canvas - fit width and crop height
      drawWidth = baseSize.width;
      drawHeight = drawWidth / imageAspect;
      offsetY = (baseSize.height - drawHeight) / 2;
    }
    
    // Draw image with proper scaling and centering
    this.ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    
    // If there are gaps, fill with gradient
    if (offsetX > 0 || offsetY > 0) {
      this.fillGapsWithGradient(image, offsetX, offsetY, drawWidth, drawHeight, baseSize);
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(this.canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    
    return texture;
  }

  private fillGapsWithGradient(
    image: HTMLImageElement,
    offsetX: number,
    offsetY: number,
    drawWidth: number,
    drawHeight: number,
    canvasSize: { width: number; height: number }
  ) {
    const colors = this.extractDominantColors(image);
    
    // Create gradient for gaps
    const gradient = this.ctx.createLinearGradient(0, 0, canvasSize.width, canvasSize.height);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    if (colors.tertiary) {
      gradient.addColorStop(1, colors.tertiary);
    } else {
      gradient.addColorStop(1, colors.primary);
    }
    
    // Fill the entire canvas with gradient first
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Then draw the image on top
    this.ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }

  private extractDominantColors(image: HTMLImageElement): GradientColors {
    // Create a small canvas to sample colors
    const sampleCanvas = document.createElement('canvas');
    const sampleCtx = sampleCanvas.getContext('2d')!;
    sampleCanvas.width = 50;
    sampleCanvas.height = 25;
    
    sampleCtx.drawImage(image, 0, 0, 50, 25);
    const imageData = sampleCtx.getImageData(0, 0, 50, 25);
    
    // Simple color extraction - get colors from edges and center
    const topColor = this.getAverageColor(imageData, 0, 0, 50, 5);
    const bottomColor = this.getAverageColor(imageData, 0, 20, 50, 5);
    const centerColor = this.getAverageColor(imageData, 15, 10, 20, 5);
    
    return {
      primary: `rgb(${topColor.r}, ${topColor.g}, ${topColor.b})`,
      secondary: `rgb(${centerColor.r}, ${centerColor.g}, ${centerColor.b})`,
      tertiary: `rgb(${bottomColor.r}, ${bottomColor.g}, ${bottomColor.b})`
    };
  }

  private getAverageColor(imageData: ImageData, x: number, y: number, width: number, height: number) {
    let r = 0, g = 0, b = 0, count = 0;
    
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        const index = (i * imageData.width + j) * 4;
        r += imageData.data[index];
        g += imageData.data[index + 1];
        b += imageData.data[index + 2];
        count++;
      }
    }
    
    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count)
    };
  }

  private createGradientFallback(colors: GradientColors): THREE.Texture {
    this.canvas.width = 1024;
    this.canvas.height = 512;
    
    const gradient = this.ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.tertiary || colors.primary);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, 1024, 512);
    
    const texture = new THREE.CanvasTexture(this.canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    
    return texture;
  }

  private extractColorsFromUrl(url: string): GradientColors {
    // Fallback colors based on common environment types
    if (url.includes('forest')) {
      return { primary: '#2d5016', secondary: '#4a7c59', tertiary: '#1a3409' };
    } else if (url.includes('ocean')) {
      return { primary: '#0077be', secondary: '#87ceeb', tertiary: '#1e3a8a' };
    } else if (url.includes('neon')) {
      return { primary: '#ff1493', secondary: '#00ffff', tertiary: '#9400d3' };
    } else if (url.includes('cosmic')) {
      return { primary: '#1a1a2e', secondary: '#16213e', tertiary: '#0f3460' };
    } else if (url.includes('arena')) {
      return { primary: '#4a4a4a', secondary: '#2a2a2a', tertiary: '#1a1a1a' };
    }
    
    // Default gradient
    return { primary: '#2a2a3a', secondary: '#1a1a2e', tertiary: '#16213e' };
  }
}

export const enhancedImageLoader = new EnhancedImageLoader();
