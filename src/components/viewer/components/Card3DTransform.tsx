
import React from 'react';

interface Card3DTransformProps {
  children: React.ReactNode;
  rotation: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  isHovering: boolean;
  onClick: () => void;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  children,
  rotation,
  mousePosition,
  isDragging,
  interactiveLighting = false,
  isHovering,
  onClick
}) => {
  return (
    <div
      className="relative"
      style={{
        width: '400px',
        height: '560px',
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: isDragging ? 'none' : 'transform 0.1s ease',
        filter: `drop-shadow(0 25px 50px rgba(0,0,0,0.8)) ${
          isHovering && interactiveLighting 
            ? 'brightness(1.1) contrast(1.05)' 
            : 'brightness(1)'
        }`,
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
