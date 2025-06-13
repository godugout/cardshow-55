
import React from 'react';
import { CardThicknessContainer } from './CardThicknessContainer';

interface Card3DTransformProps {
  children: React.ReactNode;
  rotation: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  isHovering: boolean;
  showEffects?: boolean;
  onClick: () => void;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  children,
  rotation,
  mousePosition,
  isDragging,
  interactiveLighting = false,
  isHovering,
  showEffects = true,
  onClick
}) => {
  // Calculate dynamic transform with enhanced perspective for better 3D effect
  const getDynamicTransform = () => {
    // Debug logging for rotation tracking
    console.log('🎯 Card3DTransform - Rotation X:', rotation.x.toFixed(1), 'Y:', rotation.y.toFixed(1));
    
    // Enhanced perspective for better 3D visibility - increased from 1200px to 1800px
    let baseTransform = `perspective(1800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    
    // Add subtle interactive lighting-based depth effect
    if (interactiveLighting && isHovering) {
      const lightDepth = (mousePosition.x - 0.5) * 2; // -1 to 1
      const additionalRotateY = lightDepth * 3; // Reduced to 3 degrees for smoother effect
      baseTransform = `perspective(1800px) rotateX(${rotation.x}deg) rotateY(${rotation.y + additionalRotateY}deg)`;
    }
    
    return baseTransform;
  };

  const cardWidth = 400;
  const cardHeight = 560;
  const cardThickness = 16; // Increased from 12 to 16 pixels for maximum visibility

  return (
    <div
      className="relative"
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        transform: getDynamicTransform(),
        transformStyle: 'preserve-3d',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        filter: `drop-shadow(0 40px 80px rgba(0,0,0,${interactiveLighting && isHovering ? 1.2 : 1.0}))`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onClick={onClick}
      data-rotation-x={rotation.x.toFixed(1)}
      data-rotation-y={rotation.y.toFixed(1)}
    >
      {/* Card Thickness - Side faces with maximum visibility */}
      <CardThicknessContainer
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        thickness={cardThickness}
        isHovering={isHovering}
        showEffects={showEffects}
        rotation={rotation}
      />

      {/* Front and Back faces (children) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d'
      }}>
        {children}
      </div>
    </div>
  );
};
