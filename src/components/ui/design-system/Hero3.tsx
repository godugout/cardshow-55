
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Hero3Props {
  caption?: string;
  heading?: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
  showFeaturedCards?: boolean;
  featuredCards?: any[];
  onCardClick?: (card: any) => void;
  shouldStartAnimation?: boolean;
}

export const Hero3: React.FC<Hero3Props> = ({ 
  caption, 
  heading, 
  bodyText, 
  ctaText, 
  ctaLink, 
  showFeaturedCards = false, 
  featuredCards = [], 
  onCardClick = () => {},
  shouldStartAnimation = false
}) => {
  const [animationState, setAnimationState] = useState<'idle' | 'running' | 'decelerating' | 'accelerating'>('idle');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const animationFrameRef = useRef<number>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const manualTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate single set width for position normalization
  const singleSetWidth = featuredCards.length * (384 + 24); // 384px card + 24px gap

  // Manual navigation functions
  const scrollLeft = () => {
    if (isManualMode) return;
    setIsManualMode(true);
    setAnimationState('idle');
    setCurrentPosition(prev => {
      let newPos = prev + (408); // One card width + gap
      if (newPos > 0) {
        newPos -= singleSetWidth;
      }
      return newPos;
    });
    clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = setTimeout(() => {
      setIsManualMode(false);
    }, 3000);
  };

  const scrollRight = () => {
    if (isManualMode) return;
    setIsManualMode(true);
    setAnimationState('idle');
    setCurrentPosition(prev => {
      let newPos = prev - (408); // One card width + gap
      if (newPos <= -singleSetWidth) {
        newPos += singleSetWidth;
      }
      return newPos;
    });
    clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = setTimeout(() => {
      setIsManualMode(false);
    }, 3000);
  };

  // Reduced motion support
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleControlHover = (show: boolean) => {
    setShowControls(show);
  };

  useEffect(() => {
    if (shouldStartAnimation && animationState === 'idle' && !isManualMode && !prefersReducedMotion) {
      setAnimationState('accelerating');
    } else if (!shouldStartAnimation && animationState === 'running') {
      setAnimationState('decelerating');
    }
  }, [shouldStartAnimation, animationState, isManualMode, prefersReducedMotion]);

  useEffect(() => {
    const animate = () => {
      if (animationState === 'accelerating') {
        setAnimationSpeed(prev => {
          const newSpeed = Math.min(prev + 0.05, 1); // Gradually speed up
          if (newSpeed >= 1) {
            setAnimationState('running');
            return 1;
          }
          return newSpeed;
        });
        setCurrentPosition(prev => {
          let newPos = prev - animationSpeed;
          // Normalize position for seamless infinite scroll
          if (newPos <= -singleSetWidth) {
            newPos += singleSetWidth;
          }
          return newPos;
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      } else if (animationState === 'running') {
        setCurrentPosition(prev => {
          let newPos = prev - animationSpeed;
          // Normalize position for seamless infinite scroll
          if (newPos <= -singleSetWidth) {
            newPos += singleSetWidth;
          }
          return newPos;
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      } else if (animationState === 'decelerating') {
        setAnimationSpeed(prev => {
          const newSpeed = prev * 0.95; // Gradually slow down
          if (newSpeed < 0.01) {
            setAnimationState('idle');
            return 0;
          }
          return newSpeed;
        });
        setCurrentPosition(prev => {
          let newPos = prev - animationSpeed;
          // Normalize position for seamless infinite scroll
          if (newPos <= -singleSetWidth) {
            newPos += singleSetWidth;
          }
          return newPos;
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationState !== 'idle') {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationState, animationSpeed, singleSetWidth]);

  if (!showFeaturedCards || featuredCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden relative z-10">
      {/* Horizontal scrolling carousel with larger cards */}
      <div 
        ref={carouselRef}
        className="flex gap-6"
        style={{ 
          transform: `translate3d(${currentPosition}px, 0, 0)`,
          willChange: animationState !== 'idle' ? 'transform' : 'auto'
        }}
      >
        {/* Duplicate the cards array to create seamless loop */}
        {[...featuredCards, ...featuredCards].map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-64 md:w-80 lg:w-96 cursor-pointer group"
            onClick={() => onCardClick(card)}
          >
            <div className="relative bg-crd-dark rounded-xl overflow-hidden shadow-lg border border-crd-mediumGray/20 transition-transform duration-300 group-hover:scale-105">
              {/* Card Image */}
              <div className="aspect-[3/4] relative overflow-hidden">
                {card.image_url || card.thumbnail_url ? (
                  <img 
                    src={card.image_url || card.thumbnail_url} 
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkGray flex items-center justify-center">
                    <div className="text-4xl opacity-50">🎨</div>
                  </div>
                )}
                
                {/* Hover Details Overlay - Only shows on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex flex-col justify-end">
                  <div className="p-4 text-white">
                    <h3 className="font-semibold text-lg mb-2 truncate">{card.title}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-crd-lightGray">Creator: {card.creator_name || 'Unknown'}</p>
                      {card.curator && (
                        <p className="text-crd-lightGray">Curated by: {card.curator}</p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        {card.rarity && (
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            card.rarity === 'legendary' ? 'bg-crd-orange text-black' :
                            card.rarity === 'rare' ? 'bg-crd-purple text-white' :
                            card.rarity === 'uncommon' ? 'bg-crd-blue text-white' :
                            'bg-crd-mediumGray text-white'
                          }`}>
                            {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                          </span>
                        )}
                        {card.price && (
                          <p className="text-crd-green font-bold">${card.price}</p>
                        )}
                      </div>
                      {card.view_count && (
                        <p className="text-crd-lightGray">{card.view_count} views</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hover Area for Controls */}
      <div 
        className="absolute inset-x-0 bottom-0 h-20 -mb-20 pointer-events-auto"
        onMouseEnter={() => handleControlHover(true)}
        onMouseLeave={() => handleControlHover(false)}
      >
        {/* Carousel Controls */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-sm border border-crd-mediumGray/30 rounded-full px-4 py-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/30 transition-all duration-200 active:scale-95"
              disabled={isManualMode}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/30 transition-all duration-200 active:scale-95"
              disabled={isManualMode}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
