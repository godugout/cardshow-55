
// Local image cache manager for 360° environments
class LocalImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  private preloadedImages = new Set<string>();

  // Updated with the same high-resolution images from LocalImageLibrary.ts
  private reliableImages = {
    'forest-clearing': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop&q=80',
    'mountain-vista': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop&q=80',
    'ocean-sunset': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2048&h=1024&fit=crop&q=80',
    'city-rooftop': 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2048&h=1024&fit=crop&q=80',
    'neon-city': 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=2048&h=1024&fit=crop&q=80',
    'modern-studio': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2048&h=1024&fit=crop&q=80',
    'warehouse-loft': 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=2048&h=1024&fit=crop&q=80',
    'sports-arena': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=2048&h=1024&fit=crop&q=80',
    'concert-hall': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=2048&h=1024&fit=crop&q=80',
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
      
      // Add cache-busting parameter to force fresh load
      const cacheBustUrl = `${url}&_cb=${Date.now()}`;
      
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
      
      img.src = cacheBustUrl;
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

  // Enhanced preload with cache clearing
  async preloadCommonImages() {
    const commonImages = ['modern-studio', 'forest-clearing', 'ocean-sunset', 'cosmic-void'];
    
    console.log('🚀 Preloading common 360° images with fresh cache...');
    
    // Clear existing cache to force fresh loads
    this.clearCache();
    
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

  // Enhanced cache clearing
  clearCache() {
    console.log('🧹 Clearing image cache...');
    this.cache.clear();
    this.loadingPromises.clear();
    this.preloadedImages.clear();
    
    // Also clear browser cache for these specific images
    Object.keys(this.reliableImages).forEach(imageId => {
      const url = this.reliableImages[imageId as keyof typeof this.reliableImages];
      if (url) {
        // Create a cache-busting request to invalidate browser cache
        const img = new Image();
        img.src = `${url}&_invalidate=${Date.now()}`;
      }
    });
  }

  // Force refresh of specific image
  async refreshImage(imageId: string): Promise<HTMLImageElement> {
    console.log('🔄 Force refreshing image:', imageId);
    
    // Remove from all caches
    this.cache.delete(imageId);
    this.loadingPromises.delete(imageId);
    this.preloadedImages.delete(imageId);
    
    // Load fresh
    return this.loadImage(imageId);
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

// Auto-preload on module load with fresh cache
localImageCache.preloadCommonImages().catch(console.warn);
