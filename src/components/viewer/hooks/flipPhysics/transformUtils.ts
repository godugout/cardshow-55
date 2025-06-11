
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

export const getFaceVisibility = (isFront: boolean) => {
  // Always return visible styles and let the 3D transforms determine what's seen
  return {
    opacity: 1,
    zIndex: 20
  };
};
