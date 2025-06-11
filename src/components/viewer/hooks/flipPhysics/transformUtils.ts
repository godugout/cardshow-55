
import type { FlipPhysicsState } from './types';

export const getTransformStyle = (physicsState: FlipPhysicsState) => {
  const { rotationX, rotationY, rotationZ, scale, zOffset } = physicsState;
  
  return {
    transform: `
      perspective(1000px) 
      translateZ(${zOffset}px) 
      rotateX(${rotationX}deg) 
      rotateY(${rotationY}deg) 
      rotateZ(${rotationZ}deg) 
      scale(${scale})
    `,
    transformStyle: 'preserve-3d' as const,
    transition: physicsState.isFlipping ? 'none' : 'transform 0.3s ease-out'
  };
};

export const getShadowStyle = (physicsState: FlipPhysicsState) => {
  const { shadowIntensity, zOffset } = physicsState;
  
  return {
    filter: `drop-shadow(0 ${20 + zOffset * 0.3}px ${40 + zOffset * 0.8}px rgba(0,0,0,${shadowIntensity * 0.7}))`
  };
};

// SIMPLIFIED: Direct face visibility based on isFlipped state
export const getFaceVisibility = (isFront: boolean, isFlipped: boolean) => {
  console.log(`👁️ SIMPLIFIED Face visibility:`, { isFront, isFlipped, shouldShow: isFront ? !isFlipped : isFlipped });
  
  // Front face visible when NOT flipped, back face visible when flipped
  const shouldShow = isFront ? !isFlipped : isFlipped;
  
  return {
    opacity: shouldShow ? 1 : 0,
    zIndex: shouldShow ? 30 : 10,
    pointerEvents: (shouldShow ? 'auto' : 'none') as React.CSSProperties['pointerEvents']
  };
};
