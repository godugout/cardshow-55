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
  // Calculate 3D positions for cards in the shared environment - "book opening" effect
  const cardPositions = useMemo(() => {
    const positions = [];
    
    // Reverse spacing logic: 0 = closed sandwich, higher = more open
    const actualSpacing = Math.max(0, cardSpacing);
    
    for (let i = 0; i < cards.length; i++) {
      // Calculate "book opening" positions
      const isLeftCard = i === 0;
      const isRightCard = i === 1;
      
      // X positioning: spread cards apart based on spacing
      const baseX = isLeftCard ? -actualSpacing / 2 : actualSpacing / 2;
      
      // Y positioning: keep centered (no offset)
      const heightOffset = 0;
      
      // Z positioning: slight depth variation for visual interest
      const depthOffset = isLeftCard ? 5 : -5;
      
      // "Book opening" Y-rotations that scale with spacing
      let yRotation = 0;
      if (actualSpacing > 0) {
        const maxRotation = 45; // Maximum rotation at full spacing
        const rotationAmount = (actualSpacing / 200) * maxRotation; // Scale to max spacing
        yRotation = isLeftCard ? -rotationAmount : rotationAmount;
      }

      positions.push({
        x: baseX,
        y: heightOffset,
        z: depthOffset,
        rotation: {
          x: 0,
          y: yRotation,
          z: 0
        }
      });
    }

    return positions;
  }, [cards.length, cardSpacing]);

  // Auto-rotation logic for the entire card group
  const [globalRotation, setGlobalRotation] = React.useState({ x: 0, y: 0 });
  
  React.useEffect(() => {
    if (!autoRotate) return;

    let animationId: number;
    const animate = () => {
      setGlobalRotation(prev => ({
        x: Math.sin(Date.now() * 0.0005) * 8,
        y: prev.y + 0.3
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
        transformStyle: 'preserve-3d'
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
              transform: `
                translate3d(${position.x}px, ${position.y}px, ${position.z}px)
                rotateX(${finalRotation.x + position.rotation.x}deg)
                rotateY(${finalRotation.y + position.rotation.y}deg)
                rotateZ(${position.rotation.z}deg)
                scale(${baseScale})
              `,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)', // Faster transition
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