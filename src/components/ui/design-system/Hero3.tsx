
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAnimationController } from '@/hooks/useAnimationController';

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

interface PhysicsState {
  position: number;
  velocity: number;
  targetPosition: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartPosition: number;
  momentum: number;
  snapTarget: number | null;
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const { addAnimation, removeAnimation } = useAnimationController();

  // Physics state
  const [physics, setPhysics] = useState<PhysicsState>({
    position: 0,
    velocity: 0,
    targetPosition: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartPosition: 0,
    momentum: 0,
    snapTarget: null
  });

  // Constants for physics
  const FRICTION = 0.92;
  const SPRING_STRENGTH = 0.1;
  const SNAP_THRESHOLD = 50;
  const CARD_WIDTH = 400; // 384px + 16px gap
  const MIN_VELOCITY = 0.1;

  // Calculate single set width for position normalization
  const singleSetWidth = featuredCards.length * CARD_WIDTH;

  // Physics animation loop
  const animatePhysics = useCallback((timestamp: number) => {
    setPhysics(prev => {
      let newPosition = prev.position;
      let newVelocity = prev.velocity;
      let newSnapTarget = prev.snapTarget;

      if (!prev.isDragging) {
        // Apply momentum and friction
        if (Math.abs(newVelocity) > MIN_VELOCITY) {
          newPosition += newVelocity;
          newVelocity *= FRICTION;
        } else if (newSnapTarget !== null) {
          // Snap to target with spring physics
          const diff = newSnapTarget - newPosition;
          const force = diff * SPRING_STRENGTH;
          newVelocity += force;
          newPosition += newVelocity;
          newVelocity *= 0.8; // Damping

          // Check if close enough to snap target
          if (Math.abs(diff) < 1 && Math.abs(newVelocity) < 0.5) {
            newPosition = newSnapTarget;
            newVelocity = 0;
            newSnapTarget = null;
          }
        } else {
          // Find nearest snap point if no target set
          const cardIndex = Math.round(-newPosition / CARD_WIDTH);
          newSnapTarget = -cardIndex * CARD_WIDTH;
        }

        // Normalize position for infinite scroll
        if (newPosition <= -singleSetWidth) {
          newPosition += singleSetWidth;
          if (newSnapTarget !== null) {
            newSnapTarget += singleSetWidth;
          }
        }
        if (newPosition > 0) {
          newPosition -= singleSetWidth;
          if (newSnapTarget !== null) {
            newSnapTarget -= singleSetWidth;
          }
        }
      }

      return {
        ...prev,
        position: newPosition,
        velocity: newVelocity,
        snapTarget: newSnapTarget
      };
    });
  }, [singleSetWidth]);

  // Setup physics animation
  useEffect(() => {
    if (shouldStartAnimation || physics.isDragging || Math.abs(physics.velocity) > MIN_VELOCITY || physics.snapTarget !== null) {
      addAnimation('hero3-physics', animatePhysics, 1);
    } else {
      removeAnimation('hero3-physics');
    }

    return () => removeAnimation('hero3-physics');
  }, [shouldStartAnimation, physics.isDragging, physics.velocity, physics.snapTarget, animatePhysics, addAnimation, removeAnimation]);

  // Mouse/Touch handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    
    setPhysics(prev => ({
      ...prev,
      isDragging: true,
      dragStartX: startX,
      dragStartPosition: prev.position,
      velocity: 0,
      snapTarget: null
    }));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!physics.isDragging) return;

    const deltaX = e.clientX - physics.dragStartX;
    const newPosition = physics.dragStartPosition + deltaX;

    setPhysics(prev => ({
      ...prev,
      position: newPosition,
      velocity: deltaX * 0.1 // Track velocity for momentum
    }));
  }, [physics.isDragging, physics.dragStartX, physics.dragStartPosition]);

  const handleMouseUp = useCallback(() => {
    if (!physics.isDragging) return;

    setPhysics(prev => ({
      ...prev,
      isDragging: false,
      momentum: prev.velocity
    }));
  }, [physics.isDragging]);

  // Mouse wheel handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.5;
    
    setPhysics(prev => ({
      ...prev,
      velocity: prev.velocity - delta * 0.1,
      snapTarget: null
    }));
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? 1 : -1;
      const targetPosition = physics.position + (direction * CARD_WIDTH);
      
      setPhysics(prev => ({
        ...prev,
        snapTarget: targetPosition,
        velocity: 0
      }));
    }
  }, [physics.position]);

  // Global mouse events
  useEffect(() => {
    if (physics.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [physics.isDragging, handleMouseMove, handleMouseUp]);

  // Calculate dynamic shadows and effects based on velocity
  const shadowIntensity = Math.min(Math.abs(physics.velocity) * 0.1, 1);
  const rotationAmount = physics.velocity * 0.05;

  if (!showFeaturedCards || featuredCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden" ref={containerRef}>
      <div 
        ref={carouselRef}
        className="flex gap-6 cursor-grab select-none"
        style={{ 
          transform: `translateX(${physics.position}px) rotate(${rotationAmount * 0.1}deg)`,
          transition: physics.isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Featured cards carousel"
      >
        {/* Duplicate cards for seamless infinite scroll */}
        {[...featuredCards, ...featuredCards].map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-64 md:w-80 lg:w-96 cursor-pointer"
            onPointerEnter={() => setHoveredCard(`${card.id}-${index}`)}
            onPointerLeave={() => setHoveredCard(null)}
            onFocus={() => setFocusedCard(`${card.id}-${index}`)}
            onBlur={() => setFocusedCard(null)}
            onClick={(e) => e.preventDefault()}
            style={{
              transform: hoveredCard === `${card.id}-${index}` 
                ? `scale(1.05) translateY(-8px) rotateX(5deg)` 
                : focusedCard === `${card.id}-${index}`
                ? `scale(1.02) translateY(-4px)`
                : 'scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div 
              className="relative bg-crd-dark rounded-xl overflow-hidden border border-crd-mediumGray/20"
              style={{
                boxShadow: hoveredCard === `${card.id}-${index}`
                  ? `
                    0 25px 50px -12px rgba(0, 0, 0, ${0.4 + shadowIntensity * 0.3}),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `
                  : `
                    0 10px 25px -3px rgba(0, 0, 0, ${0.2 + shadowIntensity * 0.1}),
                    0 4px 6px -2px rgba(0, 0, 0, 0.1)
                  `,
                transition: 'box-shadow 0.3s ease-out'
              }}
            >
              {/* Card Image with Parallax Effect */}
              <div className="aspect-[3/4] relative overflow-hidden">
                {card.image_url || card.thumbnail_url ? (
                  <img 
                    src={card.image_url || card.thumbnail_url} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                    style={{
                      transform: hoveredCard === `${card.id}-${index}` 
                        ? `scale(1.1) translateZ(20px)` 
                        : 'scale(1)',
                      transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      filter: hoveredCard === `${card.id}-${index}` 
                        ? 'brightness(1.1) contrast(1.05) saturate(1.1)' 
                        : 'brightness(1)',
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkGray flex items-center justify-center">
                    <div className="text-4xl opacity-50">🎨</div>
                  </div>
                )}
                
                {/* Enhanced Overlay with Micro-interactions */}
                {hoveredCard === `${card.id}-${index}` && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    style={{
                      opacity: hoveredCard === `${card.id}-${index}` ? 1 : 0,
                      transition: 'opacity 0.3s ease-out'
                    }}
                  >
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-crd-lightGray">Creator: {card.creator_name || 'Unknown'}</p>
                        </div>
                        <div className="text-right">
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
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
