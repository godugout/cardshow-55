
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface Hero3Props {
  caption?: string;
  heading?: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
  showFeaturedCards?: boolean;
  featuredCards?: any[];
  onCardClick?: (card: any) => void;
}

export const Hero3: React.FC<Hero3Props> = ({ 
  caption, 
  heading, 
  bodyText, 
  ctaText, 
  ctaLink, 
  showFeaturedCards = false, 
  featuredCards = [], 
  onCardClick = () => {} 
}) => {
  const [position, setPosition] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>();
  const lastTimestamp = useRef<number>();
  const speed = 0.5; // pixels per millisecond
  
  if (!showFeaturedCards || featuredCards.length === 0) {
    return null;
  }

  // Optimized carousel animation with RAF
  const animateCarousel = useCallback(() => {
    if (!isRunning) return;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      const delta = timestamp - lastTimestamp.current;
      
      // Use transform3d for hardware acceleration
      setPosition(prev => {
        const cardWidth = 384; // lg:w-96 = 384px
        const gap = 24; // gap-6 = 24px
        const totalWidth = (cardWidth + gap) * featuredCards.length;
        const next = prev - (speed * delta);
        
        // Reset position for seamless loop
        if (next <= -totalWidth) {
          return next + totalWidth;
        }
        return next;
      });
      
      lastTimestamp.current = timestamp;
      if (isRunning) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    
    rafId.current = requestAnimationFrame(animate);
  }, [isRunning, featuredCards.length, speed]);

  // Start/stop animation
  useEffect(() => {
    if (isRunning) {
      lastTimestamp.current = undefined;
      animateCarousel();
    } else if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isRunning, animateCarousel]);

  // Pause on hover for better UX
  const handleMouseEnter = () => setIsRunning(false);
  const handleMouseLeave = () => setIsRunning(true);

  return (
    <div 
      className="w-full overflow-hidden animation-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Horizontal scrolling carousel with smooth RAF animation */}
      <div 
        ref={containerRef}
        className="flex gap-6"
        style={{
          transform: `translate3d(${position}px, 0, 0)`,
          willChange: 'transform',
          contain: 'layout style paint'
        }}
      >
        {/* Duplicate the cards array multiple times for infinite scroll */}
        {[...featuredCards, ...featuredCards, ...featuredCards, ...featuredCards].map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-72 md:w-80 lg:w-96 cursor-pointer letter-transition hover:scale-105"
            onClick={() => onCardClick(card)}
          >
            <div className="bg-crd-dark rounded-xl overflow-hidden shadow-lg border border-crd-mediumGray/20 interactive-element-active">
              <div className="aspect-[3/4] relative">
                {card.image_url || card.thumbnail_url ? (
                  <img 
                    src={card.image_url || card.thumbnail_url} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkGray flex items-center justify-center">
                    <div className="text-4xl opacity-50">🎨</div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-crd-white font-semibold truncate">{card.title}</h3>
                <p className="text-crd-lightGray text-sm mt-1">
                  {card.rarity ? `${card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)} Card` : 'Digital Card'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
