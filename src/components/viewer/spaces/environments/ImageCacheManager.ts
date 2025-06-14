
class ImageCacheManager {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  async loadImage(url: string, fallbackUrl?: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // Create new loading promise
    const loadingPromise = this.createLoadingPromise(url, fallbackUrl);
    this.loadingPromises.set(url, loadingPromise);

    try {
      const image = await loadingPromise;
      this.cache.set(url, image);
      this.loadingPromises.delete(url);
      return image;
    } catch (error) {
      this.loadingPromises.delete(url);
      throw error;
    }
  }

  private createLoadingPromise(url: string, fallbackUrl?: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log('✅ Image loaded successfully:', url);
        resolve(img);
      };
      
      img.onerror = () => {
        console.warn('⚠️ Primary image failed, trying fallback:', url);
        
        if (fallbackUrl && fallbackUrl !== url) {
          // Try fallback URL
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          
          fallbackImg.onload = () => {
            console.log('✅ Fallback image loaded:', fallbackUrl);
            resolve(fallbackImg);
          };
          
          fallbackImg.onerror = () => {
            console.error('❌ Both primary and fallback images failed');
            reject(new Error(`Failed to load image: ${url} and fallback: ${fallbackUrl}`));
          };
          
          fallbackImg.src = fallbackUrl;
        } else {
          reject(new Error(`Failed to load image: ${url}`));
        }
      };
      
      img.src = url;
    });
  }

  preloadImages(urls: string[]) {
    urls.forEach(url => {
      if (!this.cache.has(url) && !this.loadingPromises.has(url)) {
        this.loadImage(url).catch(error => {
          console.warn('Preload failed for:', url, error);
        });
      }
    });
  }

  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}

export const imageCacheManager = new ImageCacheManager();
