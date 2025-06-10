
import { useState, useEffect } from 'react';
import { imageCacheManager } from '../ImageCacheManager';

interface UseImageLoaderProps {
  imageUrl: string;
  fallbackUrl?: string;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export const useImageLoader = ({
  imageUrl,
  fallbackUrl,
  onLoadStart,
  onLoadComplete,
  onLoadError
}: UseImageLoaderProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadImageTexture = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        onLoadStart?.();
        
        console.log('🔄 Loading 360° image:', imageUrl);
        
        // Load image through cache manager
        const loadedImage = await imageCacheManager.loadImage(imageUrl, fallbackUrl);
        
        if (!isMounted) return;
        
        console.log('✅ Image loaded successfully');
        setImage(loadedImage);
        setIsLoading(false);
        setLoadError(null);
        onLoadComplete?.();
        
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Image loading failed:', error);
        setLoadError(error as Error);
        setIsLoading(false);
        onLoadError?.(error as Error);
      }
    };

    loadImageTexture();
    
    return () => {
      isMounted = false;
    };
  }, [imageUrl, fallbackUrl, onLoadStart, onLoadComplete, onLoadError]);

  return { image, isLoading, loadError };
};
