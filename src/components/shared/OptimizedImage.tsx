import React, { useState, useEffect } from 'react';
import { ImageCacheService } from '@/services/imageCacheService';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'thumbnail' | 'medium' | 'full';
  showSkeleton?: boolean;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  size = 'medium',
  showSkeleton = true,
  fallbackSrc
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(false);

    const loadImage = async () => {
      try {
        const cachedUrl = await ImageCacheService.getCachedImageUrl(src, size);
        
        if (isMounted) {
          setImageUrl(cachedUrl);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Failed to load optimized image:', err);
        
        if (isMounted) {
          setError(true);
          setLoading(false);
          
          // Try fallback if provided
          if (fallbackSrc) {
            setImageUrl(fallbackSrc);
          } else {
            setImageUrl(src); // Use original as last resort
          }
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src, size, fallbackSrc]);

  // Handle image load error
  const handleImageError = () => {
    if (fallbackSrc && imageUrl !== fallbackSrc) {
      setImageUrl(fallbackSrc);
    } else {
      setError(true);
    }
  };

  // Show skeleton while loading
  if (loading && showSkeleton) {
    return <Skeleton className={`bg-crd-mediumGray/20 ${className}`} />;
  }

  // Show error state
  if (error && !imageUrl) {
    return (
      <div className={`bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded flex items-center justify-center ${className}`}>
        <div className="text-center text-crd-lightGray text-sm">
          <div className="w-8 h-8 mx-auto mb-2 opacity-50">
            📷
          </div>
          Image unavailable
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl || src}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};