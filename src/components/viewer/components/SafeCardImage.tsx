
import React, { useEffect } from 'react';
import { useCardRenderingSafety } from '../hooks/useCardRenderingSafety';
import { useCardRenderingDebugger } from '../hooks/useCardRenderingDebugger';
import type { CardData } from '@/types/card';

interface SafeCardImageProps {
  card: CardData;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const SafeCardImage: React.FC<SafeCardImageProps> = ({
  card,
  className = "w-full h-full object-cover object-center",
  style,
  priority = true,
  onLoad,
  onError
}) => {
  const { 
    safetyState, 
    getSafeImageUrl, 
    handleImageLoad, 
    handleImageError,
    isImageSafe 
  } = useCardRenderingSafety(card);

  const { trackImageLoad } = useCardRenderingDebugger(
    card, 
    {}, // No effects for image component
    true
  );

  const imageUrl = getSafeImageUrl(card.image_url);
  const loadStartTime = React.useRef<number>(0);

  // Track image loading start
  useEffect(() => {
    if (card.image_url && !card.image_url.startsWith('blob:')) {
      loadStartTime.current = performance.now();
    }
  }, [card.image_url]);

  const handleLoad = () => {
    const endTime = performance.now();
    if (loadStartTime.current) {
      trackImageLoad(loadStartTime.current, endTime);
    }
    handleImageLoad();
    onLoad?.();
  };

  const handleLoadError = () => {
    handleImageError();
    onError?.();
  };

  // Show loading state
  if (safetyState.imageLoading && !safetyState.imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  // Show placeholder for missing or failed images
  if (!card.image_url || safetyState.imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium">Your Image Here</p>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl}
      alt={card.title || 'Card image'}
      className={className}
      style={{
        ...style,
        filter: isImageSafe 
          ? 'brightness(1.02) contrast(1.01)' 
          : 'none',
        transition: 'filter 0.3s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'none'
      }}
      onLoad={handleLoad}
      onError={handleLoadError}
      draggable={false}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};
