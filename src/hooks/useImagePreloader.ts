import { useState, useEffect, useCallback } from 'react';

interface ImagePreloadResult {
  loaded: Set<string>;
  failed: Set<string>;
  preloadImage: (src: string) => Promise<void>;
  preloadImages: (sources: string[]) => Promise<void>;
}

export const useImagePreloader = (): ImagePreloadResult => {
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const [failed, setFailed] = useState<Set<string>>(new Set());

  const preloadImage = useCallback(async (src: string): Promise<void> => {
    if (loaded.has(src) || failed.has(src)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setLoaded(prev => new Set(prev).add(src));
        resolve();
      };

      img.onerror = () => {
        setFailed(prev => new Set(prev).add(src));
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }, [loaded, failed]);

  const preloadImages = useCallback(async (sources: string[]): Promise<void> => {
    const promises = sources.map(src => 
      preloadImage(src).catch(() => {
        // Silently handle individual failures
      })
    );
    
    await Promise.allSettled(promises);
  }, [preloadImage]);

  return {
    loaded,
    failed,
    preloadImage,
    preloadImages
  };
};