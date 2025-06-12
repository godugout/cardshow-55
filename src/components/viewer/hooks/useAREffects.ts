
import { useMemo } from 'react';

interface UseAREffectsProps {
  zoom: number;
  rotation: { x: number; y: number };
  isHovering: boolean;
  isDragging: boolean;
  effectIntensity: number;
}

export const useAREffects = ({
  zoom,
  rotation,
  isHovering,
  isDragging,
  effectIntensity
}: UseAREffectsProps) => {
  // Calculate AR state based on zoom level
  const isARMode = zoom > 1.2;
  const isHighARMode = zoom > 1.8;
  
  // Dynamic z-index calculation
  const dynamicZIndex = useMemo(() => {
    if (isHighARMode) return 100;
    if (isARMode) return 60;
    return 10;
  }, [isARMode, isHighARMode]);

  // Enhanced 3D transform with perspective
  const enhancedTransform = useMemo(() => {
    const perspective = isARMode ? 1000 + (zoom - 1.2) * 500 : 1000;
    const translateZ = isARMode ? (zoom - 1.2) * 50 : 0;
    const rotateX = rotation.x * (isARMode ? 0.8 : 0.5);
    const rotateY = rotation.y * (isARMode ? 0.8 : 0.5);
    
    return {
      perspective: `${perspective}px`,
      transform: `
        scale(${zoom})
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(${translateZ}px)
      `,
      transformStyle: 'preserve-3d' as const
    };
  }, [zoom, rotation, isARMode]);

  // Dynamic shadow based on zoom and effects
  const enhancedShadow = useMemo(() => {
    const baseBlur = 20 + (zoom - 1) * 30;
    const spread = isARMode ? 5 + (zoom - 1.2) * 10 : 0;
    const opacity = 0.3 + (effectIntensity * 0.2) + (isARMode ? 0.2 : 0);
    
    return {
      filter: `drop-shadow(0 ${baseBlur}px ${baseBlur * 2}px rgba(0, 0, 0, ${opacity}))`,
      backdropFilter: isARMode ? 'blur(1px)' : 'none'
    };
  }, [zoom, effectIntensity, isARMode]);

  // Glow effect for AR mode
  const glowEffect = useMemo(() => {
    if (!isARMode) return {};
    
    const glowIntensity = (zoom - 1.2) * 0.5 + effectIntensity * 0.3;
    const glowColor = `rgba(0, 200, 81, ${Math.min(glowIntensity, 0.6)})`;
    
    return {
      boxShadow: `
        0 0 ${20 + glowIntensity * 40}px ${glowColor},
        0 0 ${40 + glowIntensity * 80}px ${glowColor},
        inset 0 0 ${10 + glowIntensity * 20}px rgba(255, 255, 255, 0.1)
      `
    };
  }, [isARMode, zoom, effectIntensity]);

  // Background blur effect
  const backgroundBlur = useMemo(() => {
    if (!isARMode) return 0;
    return Math.min((zoom - 1.2) * 3, 8);
  }, [isARMode, zoom]);

  // Parallax offset for depth effect
  const parallaxOffset = useMemo(() => {
    const offsetX = rotation.y * 0.1;
    const offsetY = rotation.x * 0.1;
    return { x: offsetX, y: offsetY };
  }, [rotation]);

  return {
    isARMode,
    isHighARMode,
    dynamicZIndex,
    enhancedTransform,
    enhancedShadow,
    glowEffect,
    backgroundBlur,
    parallaxOffset,
    arIntensity: isARMode ? (zoom - 1.2) / 0.8 : 0
  };
};
