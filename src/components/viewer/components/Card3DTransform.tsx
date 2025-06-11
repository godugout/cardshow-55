import React from 'react';
import { useCardFlipPhysics } from '../hooks/useCardFlipPhysics';

interface Card3DTransformProps {
  children: React.ReactNode;
  rotation: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  isHovering: boolean;
  isFlipped: boolean;
  onFlip: () => void;
  onClick: () => void;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  children,
  rotation,
  mousePosition,
  isDragging,
  interactiveLighting = false,
  isHovering,
  isFlipped,
  onFlip,
  onClick
}) => {
  const { physicsState, triggerFlip, getTransformStyle, getShadowStyle } = useCardFlipPhysics();

  // Handle click to trigger physics flip
  const handleClick = () => {
    triggerFlip();
    onFlip();
    onClick();
  };

  // Calculate dynamic transform - combine mouse interaction with physics
  const getDynamicTransform = () => {
    const physicsTransform = getTransformStyle();
    
    // If flipping, use physics transform
    if (physicsState.isFlipping) {
      return physicsTransform.transform;
    }
    
    // Otherwise, use mouse interaction
    let baseTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    
    // Add subtle interactive lighting-based depth effect
    if (interactiveLighting && isHovering && !physicsState.isFlipping) {
      const lightDepth = (mousePosition.x - 0.5) * 2; // -1 to 1
      const additionalRotateY = lightDepth * 2; // Max 2 degrees
      baseTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y + additionalRotateY}deg)`;
    }
    
    return baseTransform;
  };

  const shadowStyles = getShadowStyle();

  return (
    <div
      className="relative"
      style={{
        width: '400px',
        height: '560px',
        transform: getDynamicTransform(),
        transformStyle: 'preserve-3d',
        transition: isDragging || physicsState.isFlipping ? 'none' : 'transform 0.1s ease',
        ...shadowStyles
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
