
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardFace3D } from './CardFace3D';

interface True3DCardContainerProps {
  card: CardData;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting: boolean;
}

export const True3DCardContainer: React.FC<True3DCardContainerProps> = ({
  card,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting
}) => {
  // Normalize rotation.y to 0-360 range for consistent face detection
  const normalizedRotationY = ((rotation.y % 360) + 360) % 360;
  
  // Determine if we should show the back face based on Y rotation
  // Back face is visible when rotated between 90° and 270°
  const shouldShowBack = normalizedRotationY > 90 && normalizedRotationY < 270;

  console.log('🎯 True3D Card rotation:', {
    rotationY: rotation.y,
    normalizedY: normalizedRotationY,
    shouldShowBack,
    cardTitle: card.title
  });

  return (
    <div
      className="relative"
      style={{
        width: '400px',
        height: '560px',
        transformStyle: 'preserve-3d',
        // Remove CSS rotation - let Three.js handle it
        filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))'
      }}
    >
      {/* Front Face - Card Image */}
      <CardFace3D
        card={card}
        isBack={false}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
      />

      {/* Back Face - CRD Logo */}
      <CardFace3D
        card={card}
        isBack={true}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
      />

      {/* Visual Indicator of Current Face */}
      {isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {shouldShowBack ? 'Back Side' : 'Front Side'}
          </div>
        </div>
      )}
    </div>
  );
};
