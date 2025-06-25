
import React, { useState, useEffect, useRef } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (!priority) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }
  }, [priority]);

  useEffect(() => {
    if (isInView) {
      generateOptimizedSrc();
    }
  }, [isInView, src, width, height, quality]);

  const generateOptimizedSrc = () => {
    // Check for WebP support
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();

    // Check for AVIF support
    const supportsAVIF = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    })();

    let optimizedUrl = src;

    // Add optimization parameters if it's a URL that supports them
    if (src.includes('lovable-uploads') || src.includes('supabase')) {
      const url = new URL(src, window.location.origin);
      
      if (width) url.searchParams.set('width', width.toString());
      if (height) url.searchParams.set('height', height.toString());
      url.searchParams.set('quality', quality.toString());
      
      // Prefer AVIF, then WebP, then original format
      if (supportsAVIF) {
        url.searchParams.set('format', 'avif');
      } else if (supportsWebP) {
        url.searchParams.set('format', 'webp');
      }
      
      optimizedUrl = url.toString();
    }

    setOptimizedSrc(optimizedUrl);
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    // Fallback to original src without optimization
    if (optimizedSrc !== src) {
      setOptimizedSrc(src);
      setError(false);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Blur placeholder */}
      {!isLoaded && placeholder === 'blur' && (blurDataURL || optimizedSrc) && (
        <img
          src={blurDataURL || optimizedSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 opacity-60"
          aria-hidden="true"
        />
      )}

      {/* Main optimized image */}
      {isInView && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${error ? 'filter grayscale' : ''}
          `}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Loading state */}
      {!isLoaded && !error && isInView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 rounded animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 bg-gray-300 rounded mb-2 mx-auto" />
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};
