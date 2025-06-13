
import React from 'react';
import { CardSideFace } from './CardSideFace';

interface CardThicknessContainerProps {
  cardWidth: number;
  cardHeight: number;
  thickness: number;
  isHovering: boolean;
  showEffects: boolean;
  rotation: { x: number; y: number };
}

export const CardThicknessContainer: React.FC<CardThicknessContainerProps> = ({
  cardWidth = 400,
  cardHeight = 560,
  thickness = 6,
  isHovering,
  showEffects,
  rotation
}) => {
  // Calculate which sides are visible based on rotation
  const getVisibleSides = () => {
    const normalizedRotationY = ((rotation.y % 360) + 360) % 360;
    const normalizedRotationX = ((rotation.x % 360) + 360) % 360;
    
    const sides = {
      top: normalizedRotationX > 0 && normalizedRotationX < 180,
      bottom: normalizedRotationX > 180 || normalizedRotationX < 0,
      left: normalizedRotationY > 90 && normalizedRotationY < 270,
      right: normalizedRotationY > 270 || normalizedRotationY < 90
    };

    return sides;
  };

  const visibleSides = getVisibleSides();

  return (
    <div 
      className="card-thickness-container"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Top Edge */}
      {visibleSides.top && (
        <CardSideFace
          position="top"
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          thickness={thickness}
          isHovering={isHovering}
          showEffects={showEffects}
        />
      )}

      {/* Bottom Edge */}
      {visibleSides.bottom && (
        <CardSideFace
          position="bottom"
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          thickness={thickness}
          isHovering={isHovering}
          showEffects={showEffects}
        />
      )}

      {/* Left Edge */}
      {visibleSides.left && (
        <CardSideFace
          position="left"
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          thickness={thickness}
          isHovering={isHovering}
          showEffects={showEffects}
        />
      )}

      {/* Right Edge */}
      {visibleSides.right && (
        <CardSideFace
          position="right"
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          thickness={thickness}
          isHovering={isHovering}
          showEffects={showEffects}
        />
      )}
    </div>
  );
};
