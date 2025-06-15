
import React, { useEffect, useState, useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface UnifiedCardRendererProps {
  card: CardData;
  rotation: { x: number; y: number };
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
}

// Pre-load and cache card image
const useImagePreloader = (imageUrl: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cachedImage, setCachedImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setCachedImage(img);
      setIsLoaded(true);
    };
    img.src = imageUrl;

    return () => {
      img.onload = null;
    };
  }, [imageUrl]);

  return { isLoaded, cachedImage };
};

export const UnifiedCardRenderer: React.FC<UnifiedCardRendererProps> = ({
  card,
  rotation,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
}) => {
  // Pre-load the card image
  const { isLoaded: imageLoaded, cachedImage } = useImagePreloader(card.image_url || '');

  // Calculate which side should be visible based on Y rotation
  const normalizedY = ((rotation.y % 360) + 360) % 360;
  const isBackVisible = normalizedY > 90 && normalizedY < 270;

  // Memoize the card content to avoid re-renders
  const cardContent = useMemo(() => ({
    front: (
      <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
        {/* Card Image - Pre-loaded */}
        {imageLoaded && cachedImage && (
          <img 
            src={cachedImage.src}
            alt={card.title}
            className="w-full h-full object-cover rounded-xl"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        )}
        
        {/* Card Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col z-30 pointer-events-none">
          <div className="mt-auto">
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-lg p-3 text-white">
              <h3 className="text-xl font-bold mb-1">{card.title}</h3>
              {card.description && (
                <p className="text-sm mb-1">{card.description}</p>
              )}
              {card.rarity && (
                <p className="text-xs uppercase tracking-wide opacity-75">{card.rarity}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    back: (
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          border: '2px solid rgba(0, 255, 200, 0.3)',
          boxShadow: '0 0 30px rgba(0, 255, 200, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* CRD Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <img 
              src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
              alt="CRD Logo" 
              className="w-24 h-auto mx-auto mb-4 opacity-80"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 200, 0.3))',
              }}
            />
            <div className="text-white/60 text-sm font-light tracking-widest">
              COLLECTIBLE RARE DIGITALS
            </div>
          </div>
        </div>
      </div>
    )
  }), [card, imageLoaded, cachedImage]);

  return (
    <div 
      className="relative w-full h-full rounded-xl overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        ...frameStyles,
      }}
    >
      {/* Effects Layer - Applied to both sides */}
      {showEffects && (
        <div className="absolute inset-0 z-10 pointer-events-none rounded-xl overflow-hidden">
          {SurfaceTexture}
          
          {/* Interactive Lighting */}
          {isHovering && interactiveLighting && (
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(
                  ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 255, 255, 0.08) 0%,
                  rgba(255, 255, 255, 0.04) 40%,
                  transparent 70%
                )`,
                mixBlendMode: 'soft-light',
                opacity: 0.6,
                transition: 'opacity 0.1s ease',
              }}
            />
          )}
        </div>
      )}

      {/* Front Side */}
      {cardContent.front}
      
      {/* Back Side */}
      {cardContent.back}
    </div>
  );
};
