
// Local image cache manager for 360° environments
class LocalImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  private preloadedImages = new Set<string>();

  // High-quality placeholder images that actually exist
  private reliableImages = {
    'forest-clearing': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop&q=80',
    'mountain-vista': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop&q=80',
    'ocean-sunset': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2048&h=1024&fit=crop&q=80',
    'city-rooftop': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=2048&h=1024&fit=crop&q=80',
    'neon-city': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2048&h=1024&fit=crop&q=80',
    'modern-studio': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=2048&h=1024&fit=crop&q=80',
    'warehouse-loft': 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=2048&h=1024&fit=crop&q=80',
    'sports-arena': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=2048&h=1024&fit=crop&q=80',
    'concert-hall': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048&h=1024&fit=crop&q=80',
    'cosmic-void': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80'
  };

  async loadImage(imageId: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.cache.has(imageId)) {
      console.log('✅ Using cached image:', imageId);
      return this.cache.get(imageId)!;
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(imageId)) {
      console.log('⏳ Waiting for existing load:', imageId);
      return this.loadingPromises.get(imageId)!;
    }

    // Get reliable URL for this image
    const imageUrl = this.reliableImages[imageId as keyof typeof this.reliableImages] || 
                     this.reliableImages['modern-studio'];

    console.log('🔄 Loading new image:', imageId, imageUrl);

    // Create new loading promise
    const loadingPromise = this.createLoadingPromise(imageUrl, imageId);
    this.loadingPromises.set(imageId, loadingPromise);

    try {
      const image = await loadingPromise;
      this.cache.set(imageId, image);
      this.loadingPromises.delete(imageId);
      console.log('✅ Image cached successfully:', imageId);
      return image;
    } catch (error) {
      this.loadingPromises.delete(imageId);
      console.error('❌ Failed to load image:', imageId, error);
      
      // Return fallback image
      return this.createFallbackImage();
    }
  }

  private createLoadingPromise(url: string, imageId: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        console.warn('⏰ Image load timeout:', imageId);
        reject(new Error(`Image load timeout: ${imageId}`));
      }, 10000); // 10 second timeout
      
      img.onload = () => {
        clearTimeout(timeout);
        console.log('✅ Image loaded successfully:', imageId);
        resolve(img);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.error('❌ Image load error:', imageId);
        reject(new Error(`Failed to load image: ${imageId}`));
      };
      
      img.src = url;
    });
  }

  private createFallbackImage(): HTMLImageElement {
    // Create a procedural gradient image
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Convert to image
    const img = new Image();
    img.src = canvas.toDataURL('image/jpeg', 0.8);
    return img;
  }

  // Preload common images on app start
  async preloadCommonImages() {
    const commonImages = ['modern-studio', 'forest-clearing', 'ocean-sunset', 'cosmic-void'];
    
    console.log('🚀 Preloading common 360° images...');
    
    const preloadPromises = commonImages.map(async (imageId) => {
      try {
        await this.loadImage(imageId);
        this.preloadedImages.add(imageId);
      } catch (error) {
        console.warn('⚠️ Preload failed for:', imageId);
      }
    });
    
    await Promise.allSettled(preloadPromises);
    console.log('✅ Preloading complete. Cached:', this.preloadedImages.size, 'images');
  }

  getReliableUrl(imageId: string): string {
    return this.reliableImages[imageId as keyof typeof this.reliableImages] || 
           this.reliableImages['modern-studio'];
  }

  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
    this.preloadedImages.clear();
  }

  getCacheInfo() {
    return {
      cached: this.cache.size,
      loading: this.loadingPromises.size,
      preloaded: this.preloadedImages.size
    };
  }
}

export const localImageCache = new LocalImageCache();

// Auto-preload on module load
localImageCache.preloadCommonImages().catch(console.warn);
