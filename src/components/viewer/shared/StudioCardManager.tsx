import React, { useMemo } from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CleanCardRenderer } from '../components/CleanCardRenderer';

interface StudioCardManagerProps {
  cards: CardData[];
  cardSpacing: number;
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  zoom: number;
  autoRotate: boolean;
  allowRotation: boolean;
  onCardInteraction?: (cardIndex: number, event: React.MouseEvent) => void;
}

export const StudioCardManager: React.FC<StudioCardManagerProps> = ({
  cards,
  cardSpacing,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  mousePosition,
  isHovering,
  zoom,
  autoRotate,
  allowRotation,
  onCardInteraction
}) => {
  // Position cards at the forest convergence point (where perspective lines meet)
  const cardPositions = useMemo(() => {
    const positions = [];
    const actualSpacing = Math.max(0, cardSpacing);
    
    // Forest convergence point: center horizontally, 40% down vertically (typical horizon line)
    const convergencePoint = {
      x: 0, // Center horizontally
      y: -80, // Slightly above center (40% from top = -80px from center)
      z: -50 // Slightly pushed back to match the depth of the forest focal point
    };
    
    for (let i = 0; i < cards.length; i++) {
      const isLeftCard = i === 0;
      
      // Position cards around the convergence point
      const baseX = convergencePoint.x + (isLeftCard ? -actualSpacing / 2 : actualSpacing / 2);
      
      positions.push({
        x: baseX,
        y: convergencePoint.y, // At the forest horizon line
        z: convergencePoint.z, // At the depth where the forest path converges
        rotation: {
          x: 0,
          y: 0, // Both face forward toward viewer
          z: 0
        }
      });
    }

    return positions;
  }, [cards.length, cardSpacing]);

  // Auto-rotation logic for the entire card group - rotate around shared center
  const [globalRotation, setGlobalRotation] = React.useState({ x: 0, y: 0 });
  
  React.useEffect(() => {
    if (!autoRotate) return;

    let animationId: number;
    const animate = () => {
      setGlobalRotation(prev => ({
        x: Math.sin(Date.now() * 0.0003) * 5, // Reduced amplitude
        y: prev.y + 0.2 // Slower rotation
      }));
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [autoRotate]);

  // Interactive rotation based on mouse for both cards (simplified)
  const interactiveRotation = {
    x: (mousePosition.y - 0.5) * (allowRotation ? 20 : 0), // Reduced sensitivity
    y: (mousePosition.x - 0.5) * (allowRotation ? 30 : 0)  // Reduced sensitivity
  };

  // Combine rotations
  const finalRotation = {
    x: globalRotation.x + interactiveRotation.x,
    y: globalRotation.y + interactiveRotation.y
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{
        transformStyle: 'preserve-3d',
        // Apply global rotation to the entire group container
        transform: `
          rotateX(${finalRotation.x}deg)
          rotateY(${finalRotation.y}deg)
        `,
        transition: autoRotate ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      {cards.map((card, index) => {
        const position = cardPositions[index];
        
        // Calculate individual card effects based on position and mouse proximity
        const cardMouseDistance = Math.abs(mousePosition.x - (0.5 + position.x / 1000));
        const cardIsNear = cardMouseDistance < 0.4; // Increased threshold
        const cardHoverIntensity = Math.max(0, 1 - cardMouseDistance * 2); // Reduced multiplier
        
        // Ensure consistent scaling for all cards
        const baseScale = zoom;

        return (
          <div
            key={card.id}
            className="absolute"
            style={{
              // Simple positioning - no individual rotations
              transform: `
                translate3d(${position.x}px, ${position.y}px, ${position.z}px)
                scale(${baseScale})
              `,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
              filter: `
                brightness(${1 + cardHoverIntensity * 0.2}) 
                contrast(${1.1 + cardHoverIntensity * 0.1})
                drop-shadow(0 ${25 + cardHoverIntensity * 15}px ${50 + cardHoverIntensity * 25}px rgba(0,0,0,${0.6 + cardHoverIntensity * 0.3}))
              `
            }}
          >
            <CleanCardRenderer
              card={card}
              effectValues={effectValues}
              showEffects={true}
              rotation={{ x: 0, y: 0 }} // Individual cards don't rotate, only the group does
              zoom={1}
              isHovering={cardIsNear && isHovering}
              isDragging={false}
              autoRotate={false}
              interactiveLighting={interactiveLighting && cardIsNear}
              mousePosition={mousePosition}
              onMouseDown={(e) => onCardInteraction?.(index, e)}
              onMouseMove={() => {}}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              onClick={(e) => onCardInteraction?.(index, e)}
            />
          </div>
        );
      })}
    </div>
  );
};