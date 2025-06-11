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
  // Initialize physics with the current flip state
  const { physicsState, triggerFlip, getTransformStyle, getShadowStyle, getFaceVisibility } = useCardFlipPhysics(isFlipped);

  // Handle click to trigger physics flip
  const handleClick = () => {
    triggerFlip();
    onFlip();
    onClick();
  };

  // Calculate dynamic transform - use physics during flip, mouse interaction otherwise
  const getDynamicTransform = () => {
    const physicsTransform = getTransformStyle();
    
    // If flipping, use pure physics transform
    if (physicsState.isFlipping) {
      return physicsTransform.transform;
    }
    
    // Otherwise, use mouse interaction with current physics rotation as base
    const baseRotationY = physicsState.rotationY;
    let finalTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${baseRotationY + rotation.y}deg)`;
    
    // Add subtle interactive lighting-based depth effect
    if (interactiveLighting && isHovering && !physicsState.isFlipping) {
      const lightDepth = (mousePosition.x - 0.5) * 1.5; // -0.75 to 0.75
      finalTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${baseRotationY + rotation.y + lightDepth}deg)`;
    }
    
    return finalTransform;
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
      {/* Always pass the physics face visibility function to children */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            getFaceVisibility
          } as any);
        }
        return child;
      })}
    </div>
  );
};
