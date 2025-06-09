
import { Texture } from 'three';

interface CacheEntry {
  texture: Texture;
  lastUsed: number;
  size: number;
}

class HDRICache {
  private cache = new Map<string, CacheEntry>();
  private maxCacheSize = 100 * 1024 * 1024; // 100MB max cache
  private maxMobileCacheSize = 50 * 1024 * 1024; // 50MB for mobile
  private currentCacheSize = 0;

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
  }

  private getMaxCacheSize(): number {
    return this.isMobile() ? this.maxMobileCacheSize : this.maxCacheSize;
  }

  private estimateTextureSize(texture: Texture): number {
    if (!texture.image) return 0;
    const { width = 1024, height = 512 } = texture.image;
    // Estimate HDRI texture size (32-bit float RGBA)
    return width * height * 4 * 4;
  }

  private evictLeastRecentlyUsed(): void {
    if (this.cache.size === 0) return;

    let oldestTime = Date.now();
    let oldestKey = '';

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastUsed < oldestTime) {
        oldestTime = entry.lastUsed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey);
      if (entry) {
        entry.texture.dispose();
        this.currentCacheSize -= entry.size;
        this.cache.delete(oldestKey);
      }
    }
  }

  set(url: string, texture: Texture): void {
    const size = this.estimateTextureSize(texture);
    const maxSize = this.getMaxCacheSize();

    // Don't cache if texture is too large
    if (size > maxSize * 0.5) return;

    // Evict entries until we have space
    while (this.currentCacheSize + size > maxSize && this.cache.size > 0) {
      this.evictLeastRecentlyUsed();
    }

    // Dispose existing texture if key exists
    const existing = this.cache.get(url);
    if (existing) {
      existing.texture.dispose();
      this.currentCacheSize -= existing.size;
    }

    this.cache.set(url, {
      texture,
      lastUsed: Date.now(),
      size
    });
    this.currentCacheSize += size;
  }

  get(url: string): Texture | null {
    const entry = this.cache.get(url);
    if (entry) {
      entry.lastUsed = Date.now();
      return entry.texture;
    }
    return null;
  }

  has(url: string): boolean {
    return this.cache.has(url);
  }

  clear(): void {
    for (const entry of this.cache.values()) {
      entry.texture.dispose();
    }
    this.cache.clear();
    this.currentCacheSize = 0;
  }

  getCacheStats() {
    return {
      entryCount: this.cache.size,
      totalSize: this.currentCacheSize,
      maxSize: this.getMaxCacheSize(),
      utilization: this.currentCacheSize / this.getMaxCacheSize()
    };
  }
}

export const hdriCache = new HDRICache();
