
class ImageCacheService {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  async preloadImage(url: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // Create new loading promise
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.cache.set(url, img);
        this.loadingPromises.delete(url);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(url);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });

    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  getCachedImage(url: string): HTMLImageElement | null {
    return this.cache.get(url) || null;
  }

  preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(urls.map(url => this.preloadImage(url)));
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const imageCacheService = new ImageCacheService();
