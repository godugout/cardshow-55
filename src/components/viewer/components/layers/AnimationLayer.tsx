import React from 'react';

interface AnimationLayerProps {
  rotation: { x: number; y: number };
  zoom: number;
  isHovering: boolean;
  isDragging: boolean;
  autoRotate: boolean;
  children: React.ReactNode;
}

/**
 * Pure animation layer - handles transforms and animations without affecting content
 */
export const AnimationLayer: React.FC<AnimationLayerProps> = ({
  rotation,
  zoom,
  isHovering,
  isDragging,
  autoRotate,
  children
}) => {
  // Calculate hover scale
  const hoverScale = isHovering ? 1.05 : 1;
  const finalScale = zoom * hoverScale;

  return (
    <div
      className="transform-gpu preserve-3d"
      style={{
        transform: `
          perspective(1000px)
          rotateX(${rotation.x}deg)
          rotateY(${rotation.y}deg)
          scale(${finalScale})
        `,
        transformStyle: 'preserve-3d',
        transition: isDragging || autoRotate 
          ? 'transform 0.1s ease-out' 
          : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        cursor: isDragging ? 'grabbing' : 'grab',
        filter: isHovering 
          ? 'brightness(1.1) contrast(1.05) drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
          : 'brightness(1) contrast(1) drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
      }}
    >
      {children}
    </div>
  );
};