
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
  thickness = 8, // Increased from 6 to 8 for better visibility
  isHovering,
  showEffects,
  rotation
}) => {
  // Always show all sides for better 3D effect - removed conditional rendering
  // This ensures the 3D effect is always visible when rotating
  
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
      {/* Always render all side faces for consistent 3D appearance */}
      
      {/* Top Edge */}
      <CardSideFace
        position="top"
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        thickness={thickness}
        isHovering={isHovering}
        showEffects={showEffects}
        rotation={rotation}
      />

      {/* Bottom Edge */}
      <CardSideFace
        position="bottom"
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        thickness={thickness}
        isHovering={isHovering}
        showEffects={showEffects}
        rotation={rotation}
      />

      {/* Left Edge */}
      <CardSideFace
        position="left"
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        thickness={thickness}
        isHovering={isHovering}
        showEffects={showEffects}
        rotation={rotation}
      />

      {/* Right Edge */}
      <CardSideFace
        position="right"
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        thickness={thickness}
        isHovering={isHovering}
        showEffects={showEffects}
        rotation={rotation}
      />
    </div>
  );
};
