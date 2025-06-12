
import React from 'react';

interface Card3DTransformProps {
  rotation: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  isHovering: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  rotation,
  mousePosition,
  isDragging,
  interactiveLighting = false,
  isHovering,
  onClick,
  children
}) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const transform3D = `
    perspective(1000px)
    rotateX(${rotation.x}deg) 
    rotateY(${rotation.y}deg)
    translateZ(${isHovering ? '20px' : '0px'})
  `;

  return (
    <div 
      className="relative preserve-3d cursor-pointer"
      style={{
        transform: transform3D,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        transformStyle: 'preserve-3d',
      }}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        // Only trigger on single click, not double click
        if (e.detail === 1) {
          setTimeout(() => {
            if (e.detail === 1) {
              // This was a single click
            }
          }, 200);
        }
      }}
    >
      {children}
    </div>
  );
};
