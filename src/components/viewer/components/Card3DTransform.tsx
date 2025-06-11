import React from 'react';
import { useCardFlipPhysics } from '../hooks/useCardFlipPhysics';
import { useDoubleClick } from '@/hooks/useDoubleClick';

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
  physicsEnabled?: boolean;
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
  onClick,
  physicsEnabled = true
}) => {
  // Initialize physics with the current flip state and physics settings
  const { physicsState, triggerFlip, getTransformStyle, getShadowStyle } = useCardFlipPhysics(isFlipped, physicsEnabled);

  // Handle double-click to trigger physics flip
  const handleDoubleClick = useDoubleClick({
    onDoubleClick: () => {
      console.log('🎯 Double-click detected - triggering flip');
      triggerFlip();
      onFlip();
    },
    onSingleClick: () => {
      // Single click is reserved for drag operations
      onClick();
    },
    delay: 250
  });

  // Calculate dynamic transform - use physics during flip, mouse interaction otherwise
  const getDynamicTransform = () => {
    const physicsTransform = getTransformStyle();
    
    // If flipping, use pure physics transform
    if (physicsState.isFlipping) {
      console.log('🔄 Using physics transform during flip:', physicsTransform.transform);
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
    
    console.log('🎨 Using interactive transform:', finalTransform, 'baseRotationY:', baseRotationY);
    return finalTransform;
  };

  // FIXED: Corrected face visibility logic to properly show front vs back
  const getSimplifiedFaceVisibility = (isFront: boolean) => {
    const currentRotationY = physicsState.rotationY;
    
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((currentRotationY % 360) + 360) % 360;
    
    // CORRECTED: Front face visible when rotation is 0-90 or 270-360 (close to 0)
    // Back face visible when rotation is 90-270 (close to 180)
    const frontShouldBeVisible = normalizedRotation < 90 || normalizedRotation > 270;
    
    console.log(`👁️ Face visibility calculation:`, {
      isFront,
      currentRotationY,
      normalizedRotation,
      frontShouldBeVisible,
      shouldThisFaceBeVisible: isFront ? frontShouldBeVisible : !frontShouldBeVisible
    });
    
    if (isFront) {
      return {
        opacity: frontShouldBeVisible ? 1 : 0,
        zIndex: frontShouldBeVisible ? 30 : 10,
        pointerEvents: (frontShouldBeVisible ? 'auto' : 'none') as React.CSSProperties['pointerEvents']
      };
    } else {
      return {
        opacity: !frontShouldBeVisible ? 1 : 0,
        zIndex: !frontShouldBeVisible ? 30 : 10,
        pointerEvents: (!frontShouldBeVisible ? 'auto' : 'none') as React.CSSProperties['pointerEvents']
      };
    }
  };

  const shadowStyles = getShadowStyle();

  // Debug logging
  console.log('🃏 Card3DTransform render:', {
    isFlipped,
    'physicsState.rotationY': physicsState.rotationY,
    'physicsState.showingFront': physicsState.showingFront,
    'physicsState.isFlipping': physicsState.isFlipping
  });

  return (
    <div
      className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        width: '400px',
        height: '560px',
        transform: getDynamicTransform(),
        transformStyle: 'preserve-3d',
        transition: isDragging || physicsState.isFlipping ? 'none' : 'transform 0.1s ease',
        ...shadowStyles
      }}
      onClick={handleDoubleClick}
    >
      {/* Visual hint for double-click when hovering */}
      {isHovering && !isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap animate-fade-in">
            Double-click to flip
          </div>
        </div>
      )}

      {/* Always pass the simplified face visibility function to children */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            getFaceVisibility: getSimplifiedFaceVisibility
          } as any);
        }
        return child;
      })}
    </div>
  );
};

export default Card3DTransform;
