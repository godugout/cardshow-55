import { localForage } from '@/lib/localforage';

interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  expiresAt: number;
  size: 'thumbnail' | 'medium' | 'full';
}

interface ImageCacheConfig {
  maxAge: number; // milliseconds
  maxSizeBytes: number; // bytes
  maxImages: number;
}

export class ImageCacheService {
  private static readonly CACHE_KEY_PREFIX = 'img_cache_';
  private static readonly METADATA_KEY = 'img_cache_metadata';
  
  private static readonly CONFIG: ImageCacheConfig = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    maxImages: 200
  };

  private static imageCache = new Map<string, string>(); // url -> object URL
  private static loadingPromises = new Map<string, Promise<string>>();
  private static referenceCount = new Map<string, number>(); // Track blob URL usage
  private static permanentCache = new Map<string, string>(); // For 3D contexts

  /**
   * Get cached image URL or fetch and cache if not available
   */
  static async getCachedImageUrl(imageUrl: string, size: 'thumbnail' | 'medium' | 'full' = 'medium', context: 'ui' | '3d' = 'ui'): Promise<string> {
    if (!imageUrl) return imageUrl;

    const cacheKey = this.getCacheKey(imageUrl, size);
    
    // For 3D contexts, return original URL to avoid blob URL issues
    if (context === '3d') {
      // Check permanent cache first
      if (this.permanentCache.has(cacheKey)) {
        return this.permanentCache.get(cacheKey)!;
      }
      // Return original URL for 3D to avoid blob URL race conditions
      return imageUrl;
    }
    
    // Check memory cache first for UI contexts
    if (this.imageCache.has(cacheKey)) {
      this.incrementReference(cacheKey);
      return this.imageCache.get(cacheKey)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    // Start loading process
    const loadingPromise = this.loadImage(imageUrl, size);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const objectUrl = await loadingPromise;
      this.imageCache.set(cacheKey, objectUrl);
      this.setReference(cacheKey, 1);
      return objectUrl;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * Load image from cache or network
   */
  private static async loadImage(imageUrl: string, size: 'thumbnail' | 'medium' | 'full'): Promise<string> {
    const cacheKey = this.getCacheKey(imageUrl, size);
    
    try {
      // Check IndexedDB cache
      const cached = await localForage.getItem<CachedImage>(cacheKey);
      
      if (cached && this.isCacheValid(cached)) {
        console.log(`📸 Using cached image: ${imageUrl}`);
        const objectUrl = URL.createObjectURL(cached.blob);
        return objectUrl;
      }

      // Fetch from network
      console.log(`🌐 Fetching image from network: ${imageUrl}`);
      const optimizedUrl = this.getOptimizedImageUrl(imageUrl, size);
      const response = await fetch(optimizedUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Cache the image
      await this.cacheImage(imageUrl, blob, size);

      return objectUrl;
    } catch (error) {
      console.warn(`❌ Failed to load image ${imageUrl}:`, error);
      // Return original URL as fallback
      return imageUrl;
    }
  }

  /**
   * Cache image in IndexedDB
   */
  private static async cacheImage(imageUrl: string, blob: Blob, size: 'thumbnail' | 'medium' | 'full'): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(imageUrl, size);
      const now = Date.now();
      
      const cachedImage: CachedImage = {
        url: imageUrl,
        blob,
        timestamp: now,
        expiresAt: now + this.CONFIG.maxAge,
        size
      };

      await localForage.setItem(cacheKey, cachedImage);
      await this.updateMetadata();
      
      // Cleanup old images if needed
      await this.cleanupIfNeeded();
    } catch (error) {
      console.warn('Failed to cache image:', error);
    }
  }

  /**
   * Get optimized image URL based on size
   */
  private static getOptimizedImageUrl(originalUrl: string, size: 'thumbnail' | 'medium' | 'full'): string {
    // If it's already a blob URL or data URL, return as-is
    if (originalUrl.startsWith('blob:') || originalUrl.startsWith('data:')) {
      return originalUrl;
    }

    // For external URLs, we could add optimization parameters
    // For now, return original URL but could add size-specific optimization later
    return originalUrl;
  }

  /**
   * Check if cached image is still valid
   */
  private static isCacheValid(cached: CachedImage): boolean {
    return Date.now() < cached.expiresAt;
  }

  /**
   * Generate cache key
   */
  private static getCacheKey(imageUrl: string, size: string): string {
    const hash = this.simpleHash(imageUrl + size);
    return `${this.CACHE_KEY_PREFIX}${hash}`;
  }

  /**
   * Simple hash function for URLs
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Update cache metadata
   */
  private static async updateMetadata(): Promise<void> {
    try {
      const keys = await localForage.keys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      const metadata = {
        imageCount: cacheKeys.length,
        lastUpdated: Date.now()
      };
      
      await localForage.setItem(this.METADATA_KEY, metadata);
    } catch (error) {
      console.warn('Failed to update cache metadata:', error);
    }
  }

  /**
   * Cleanup old or excess images
   */
  private static async cleanupIfNeeded(): Promise<void> {
    try {
      const keys = await localForage.keys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      if (cacheKeys.length <= this.CONFIG.maxImages) return;

      // Get all cached images with timestamps
      const cachedImages = await Promise.all(
        cacheKeys.map(async (key) => {
          const cached = await localForage.getItem<CachedImage>(key);
          return { key, cached };
        })
      );

      // Sort by timestamp (oldest first)
      cachedImages.sort((a, b) => {
        if (!a.cached || !b.cached) return 0;
        return a.cached.timestamp - b.cached.timestamp;
      });

      // Remove oldest images
      const toRemove = cachedImages.slice(0, cacheKeys.length - this.CONFIG.maxImages);
      
      for (const { key } of toRemove) {
        await localForage.removeItem(key);
        console.log(`🗑️ Removed old cached image: ${key}`);
      }
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }
  }

  /**
   * Clear all cached images
   */
  static async clearCache(): Promise<void> {
    try {
      const keys = await localForage.keys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      for (const key of cacheKeys) {
        await localForage.removeItem(key);
      }
      
      await localForage.removeItem(this.METADATA_KEY);
      
      // Clear memory cache and revoke object URLs
      for (const objectUrl of this.imageCache.values()) {
        URL.revokeObjectURL(objectUrl);
      }
      this.imageCache.clear();
      
      console.log('🗑️ Cleared all cached images');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    imageCount: number;
    totalSizeBytes: number;
    lastUpdated: number;
  }> {
    try {
      const keys = await localForage.keys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      let totalSizeBytes = 0;
      for (const key of cacheKeys) {
        const cached = await localForage.getItem<CachedImage>(key);
        if (cached) {
          totalSizeBytes += cached.blob.size;
        }
      }
      
      const metadata = await localForage.getItem<any>(this.METADATA_KEY);
      
      return {
        imageCount: cacheKeys.length,
        totalSizeBytes,
        lastUpdated: metadata?.lastUpdated || 0
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return {
        imageCount: 0,
        totalSizeBytes: 0,
        lastUpdated: 0
      };
    }
  }

  /**
   * Preload image into cache
   */
  static async preloadImage(imageUrl: string, size: 'thumbnail' | 'medium' | 'full' = 'medium'): Promise<void> {
    try {
      await this.getCachedImageUrl(imageUrl, size);
    } catch (error) {
      console.warn(`Failed to preload image ${imageUrl}:`, error);
    }
  }

  /**
   * Reference counting methods for blob URL management
   */
  private static incrementReference(key: string): void {
    const current = this.referenceCount.get(key) || 0;
    this.referenceCount.set(key, current + 1);
  }

  private static setReference(key: string, count: number): void {
    this.referenceCount.set(key, count);
  }

  private static decrementReference(key: string): number {
    const current = this.referenceCount.get(key) || 0;
    const newCount = Math.max(0, current - 1);
    this.referenceCount.set(key, newCount);
    return newCount;
  }

  /**
   * Get stable URL for 3D contexts
   */
  static async getStable3DUrl(imageUrl: string, size: 'thumbnail' | 'medium' | 'full' = 'medium'): Promise<string> {
    const cacheKey = this.getCacheKey(imageUrl, size);
    
    if (this.permanentCache.has(cacheKey)) {
      return this.permanentCache.get(cacheKey)!;
    }

    // For 3D contexts, prefer original URLs to avoid blob URL race conditions
    this.permanentCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  /**
   * Cleanup memory cache on page unload
   */
  static cleanup(): void {
    for (const objectUrl of this.imageCache.values()) {
      URL.revokeObjectURL(objectUrl);
    }
    this.imageCache.clear();
    this.permanentCache.clear();
    this.referenceCount.clear();
    this.loadingPromises.clear();
  }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ImageCacheService.cleanup();
  });
}