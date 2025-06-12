
import { useMemo } from 'react';

interface AREffectsConfig {
  zoom: number;
  isHovering: boolean;
  isDragging: boolean;
  rotation: { x: number; y: number };
}

export const useAREffects = ({
  zoom,
  isHovering,
  isDragging,
  rotation
}: AREffectsConfig) => {
  // AR mode activates when zoom > 1.5
  const isARMode = zoom > 1.5;
  
  // Dynamic z-index calculation
  const dynamicZIndex = useMemo(() => {
    if (isARMode) return 60; // Above studio panel (50)
    return 10; // Default z-index
  }, [isARMode]);

  // Enhanced 3D transforms
  const arTransforms = useMemo(() => {
    const baseScale = zoom;
    const perspective = isARMode ? 1000 : 800;
    const rotateX = rotation.x * (isARMode ? 0.8 : 0.5);
    const rotateY = rotation.y * (isARMode ? 0.8 : 0.5);
    
    return {
      transform: `
        perspective(${perspective}px) 
        scale3d(${baseScale}, ${baseScale}, 1) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
        translateZ(${isARMode ? '50px' : '0px'})
      `,
      transformOrigin: 'center center',
      transformStyle: 'preserve-3d' as const
    };
  }, [zoom, rotation, isARMode]);

  // Dynamic shadows and glow effects
  const arShadowEffects = useMemo(() => {
    const shadowIntensity = Math.min((zoom - 1) * 0.5, 1);
    const glowIntensity = isARMode ? Math.min((zoom - 1.5) * 0.3, 0.6) : 0;
    
    return {
      boxShadow: `
        0 ${shadowIntensity * 20}px ${shadowIntensity * 40}px rgba(0, 0, 0, ${shadowIntensity * 0.3}),
        0 ${shadowIntensity * 10}px ${shadowIntensity * 20}px rgba(0, 0, 0, ${shadowIntensity * 0.2}),
        ${isARMode ? `0 0 ${glowIntensity * 60}px rgba(0, 200, 81, ${glowIntensity})` : ''}
      `,
      filter: isARMode ? `brightness(${1 + glowIntensity * 0.2}) contrast(${1 + glowIntensity * 0.1})` : 'none'
    };
  }, [zoom, isARMode]);

  // Background blur effect for overlapped UI
  const backgroundBlurIntensity = useMemo(() => {
    if (!isARMode) return 0;
    return Math.min((zoom - 1.5) * 2, 8);
  }, [zoom, isARMode]);

  // Parallax offset for depth effect
  const parallaxOffset = useMemo(() => {
    const intensity = isARMode ? (zoom - 1.5) * 0.1 : 0;
    return {
      x: rotation.y * intensity,
      y: -rotation.x * intensity
    };
  }, [rotation, isARMode, zoom]);

  return {
    isARMode,
    dynamicZIndex,
    arTransforms,
    arShadowEffects,
    backgroundBlurIntensity,
    parallaxOffset
  };
};
