import React, { useMemo } from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { EnhancedCardContainer } from '../components/EnhancedCardContainer';

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
  // Simple side-by-side positioning - both cards face the same direction
  const cardPositions = useMemo(() => {
    const positions = [];
    const actualSpacing = Math.max(0, cardSpacing);
    
    for (let i = 0; i < cards.length; i++) {
      const isLeftCard = i === 0;
      
      // Simple X positioning: left card negative, right card positive
      const baseX = isLeftCard ? -actualSpacing / 2 : actualSpacing / 2;
      
      positions.push({
        x: baseX,
        y: 0, // Same height
        z: 0, // Same depth - both face the same direction
        rotation: {
          x: 0,
          y: 0, // No individual rotation - both face forward
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
            <EnhancedCardContainer
              card={card}
              isFlipped={false}
              isHovering={cardIsNear && isHovering}
              showEffects={true}
              effectValues={effectValues}
              mousePosition={mousePosition}
              rotation={finalRotation}
              zoom={1} // Zoom is handled by the container
              isDragging={false}
              frameStyles={{}}
              enhancedEffectStyles={{}}
              SurfaceTexture={<div />}
              interactiveLighting={interactiveLighting && cardIsNear}
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              materialSettings={materialSettings}
              overallBrightness={overallBrightness}
              showBackgroundInfo={false}
              onMouseDown={(e) => onCardInteraction?.(index, e)}
              onMouseMove={() => {}}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              onClick={(e) => onCardInteraction?.(index, e)}
              solidCardTransition={true}
            />
          </div>
        );
      })}
    </div>
  );
};