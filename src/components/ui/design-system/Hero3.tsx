
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../../components/editor/wizard/hooks/useIntersectionObserver';

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
  const [isHovered, setIsHovered] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>();
  const lastTimestamp = useRef<number>();
  const speed = 0.15; // pixels per millisecond (reduced from 0.5 for better viewing)
  
  // State to track if hero animation has completed (scroll-based)
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  
  // Intersection observer to detect when we're past the hero section
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '0px'
  });

  // Monitor scroll position to detect when hero animation should complete
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      // Complete hero animation when user scrolls about 40% down the page
      if (scrollPercent > 0.4 && !heroAnimationComplete) {
        setHeroAnimationComplete(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroAnimationComplete]);
  
  if (!showFeaturedCards || featuredCards.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-crd-lightGray text-lg mb-2">
          🎨 No cards available
        </div>
        <p className="text-crd-lightGray/70 text-sm">
          Cards will appear here once they're loaded.
        </p>
      </div>
    );
  }

  // Check if user prefers reduced motion
  const prefersReducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Smooth easing function for acceleration/deceleration
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Optimized carousel animation with RAF and smart start control
  const animateCarousel = useCallback(() => {
    // Only animate when hero animation is complete AND we're intersecting AND not hovered
    const shouldAnimate = heroAnimationComplete && isIntersecting && !isHovered && !prefersReducedMotion.current;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      const delta = timestamp - lastTimestamp.current;
      
      // Smooth acceleration/deceleration
      setAnimationProgress(prev => {
        const targetProgress = shouldAnimate ? 1 : 0;
        const progressSpeed = 0.005; // How fast to reach target progress
        const diff = targetProgress - prev;
        return prev + diff * progressSpeed * delta;
      });
      
      // Use transform3d for hardware acceleration
      setPosition(prev => {
        // Calculate actual card width based on responsive breakpoints
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const cardWidth = isMobile ? 288 : isTablet ? 320 : 384; // w-72, w-80, w-96
        const gap = 24; // gap-6 = 24px
        
        // Calculate based on single array length for proper reset
        const singleSetWidth = (cardWidth + gap) * featuredCards.length;
        
        // Apply smooth easing to the speed
        const easedProgress = easeInOutCubic(animationProgress);
        const currentSpeed = speed * easedProgress;
        const next = prev - (currentSpeed * delta);
        
        // Reset position for seamless loop when we've moved past one full set
        if (next <= -singleSetWidth) {
          return next + singleSetWidth;
        }
        return next;
      });
      
      lastTimestamp.current = timestamp;
      rafId.current = requestAnimationFrame(animate);
    };
    
    rafId.current = requestAnimationFrame(animate);
  }, [heroAnimationComplete, isIntersecting, isHovered, animationProgress, featuredCards.length, speed]);

  // Start/stop animation based on intersection and hover state
  useEffect(() => {
    lastTimestamp.current = undefined;
    animateCarousel();
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [animateCarousel]);

  // Pause on hover for better UX
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div 
      ref={targetRef}
      className="w-full overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        height: '520px', // Increased from 420px for better card visibility
        contain: 'layout style paint', // Performance optimization
      }} // Fixed height to prevent layout shifts
    >
      {/* Horizontal scrolling carousel with smooth RAF animation */}
      <div 
        ref={containerRef}
        className="flex gap-6 h-full"
        style={{
          transform: `translate3d(${position}px, 0, 0)`,
          willChange: heroAnimationComplete ? 'transform' : 'auto', // Smart will-change management
          contain: 'layout style paint' // Performance containment
        }}
      >
        {/* Duplicate the cards array multiple times for infinite scroll */}
        {[...featuredCards, ...featuredCards, ...featuredCards, ...featuredCards, ...featuredCards, ...featuredCards].map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-72 md:w-80 lg:w-96 cursor-pointer transition-transform duration-200 hover:scale-105 relative z-10"
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
