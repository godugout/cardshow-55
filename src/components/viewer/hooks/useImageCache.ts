
import { useEffect, useState } from 'react';
import { imageCacheService } from '../services/ImageCacheService';

export const useImageCache = (imageUrl: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cachedImage, setCachedImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoaded(false);
      setCachedImage(null);
      setError(null);
      return;
    }

    // Check if image is already cached
    const cached = imageCacheService.getCachedImage(imageUrl);
    if (cached) {
      setCachedImage(cached);
      setIsLoaded(true);
      setError(null);
      return;
    }

    // Preload the image
    setIsLoaded(false);
    setError(null);
    
    imageCacheService.preloadImage(imageUrl)
      .then(img => {
        setCachedImage(img);
        setIsLoaded(true);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setIsLoaded(false);
        setCachedImage(null);
      });
  }, [imageUrl]);

  return { isLoaded, cachedImage, error };
};

// Hook for preloading multiple images
export const useMultiImageCache = (imageUrls: string[]) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setAllLoaded(true);
      return;
    }

    setLoadedCount(0);
    setAllLoaded(false);

    imageCacheService.preloadImages(imageUrls)
      .then(() => {
        setLoadedCount(imageUrls.length);
        setAllLoaded(true);
      })
      .catch(err => {
        console.warn('Some images failed to preload:', err);
      });
  }, [imageUrls]);

  return { loadedCount, allLoaded, totalCount: imageUrls.length };
};
