
import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  blurDataURL?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc = '/api/placeholder/300/400',
  blurDataURL
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (!error && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setError(true);
    } else {
      setError(true);
      onError?.();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${error ? 'filter grayscale' : ''}
        `}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Loading indicator */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-crd-mediumGray animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 bg-crd-lightGray rounded animate-pulse" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-crd-mediumGray flex items-center justify-center">
          <div className="text-center text-crd-lightGray">
            <div className="w-8 h-8 bg-crd-lightGray rounded mb-2 mx-auto opacity-50" />
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};
