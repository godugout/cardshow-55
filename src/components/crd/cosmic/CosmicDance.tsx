import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CosmicMoon } from './CosmicMoon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TemplateEngine, interpolateFrame } from '@/templates/engine';

interface CosmicDanceProps {
  animationProgress: number; // 0 to 1 from the timeline slider
  isPlaying: boolean;
  cardAngle: number; // Current card forward lean angle
  cameraDistance: number; // Camera distance for zoom tracking
  isOptimalZoom: boolean; // Whether camera is at optimal zoom
  isOptimalPosition: boolean; // Whether card is centered
  onTriggerReached?: () => void; // Called when all conditions are met
  onCardControlUpdate?: (params: { positionY: number; lean: number; controlTaken: boolean }) => void;
  templateEngine?: TemplateEngine; // New prop for template configuration
}

interface AnimationFrame {
  progress: number;
  sun: {
    x: number; // Screen percentage -50 to 50
    y: number; // Screen position (legacy: % for rest, 120px for start; template: px)
    scale: number; // 0.5 to 2.0
    opacity: number; // 0 to 1
  };
  card: {
    lean: number; // Forward lean angle in degrees
    positionY: number; // Vertical position offset for cinematic movement
    controlTaken: boolean; // Whether the system takes control of the card
  };
  lighting: {
    intensity: number; // 0.5 to 2.0
    warmth: number; // Color temperature adjustment
  };
  environment: {
    skyColor: string; // Gradient sky color
    spaceDepth: number; // Deep space feeling
  };
}

// Enhanced animation keyframes inspired by 2001: A Space Odyssey - Perfect Alignment
const ANIMATION_FRAMES: AnimationFrame[] = [
  // Dawn scene - Sun starts at same position as moon's final resting position (120px from top)
  {
    progress: 0,
    sun: { x: 0, y: 120, scale: 0.4, opacity: 0.8 },
    card: { lean: 0, positionY: 0, controlTaken: false },
    lighting: { intensity: 0.8, warmth: 0 },
    environment: { skyColor: '#0a0a2e', spaceDepth: 1.0 }
  },
  // Early descent - Card begins to lift but stays below sun
  {
    progress: 0.25,
    sun: { x: 0, y: 40, scale: 0.7, opacity: 0.95 },
    card: { lean: 20, positionY: 1.0, controlTaken: false },
    lighting: { intensity: 1.0, warmth: 0.2 },
    environment: { skyColor: '#1a1a3e', spaceDepth: 0.9 }
  },
  // CONTROL TAKEOVER - System takes card control, moves further down for clearance
  {
    progress: 0.5,
    sun: { x: 0, y: 50, scale: 1.0, opacity: 1.0 },
    card: { lean: 45, positionY: 2.5, controlTaken: true },
    lighting: { intensity: 1.3, warmth: 0.5 },
    environment: { skyColor: '#2a1a1e', spaceDepth: 0.7 }
  },
  // Eternal alignment - Card positioned perfectly below sun's edge
  {
    progress: 0.75,
    sun: { x: 0, y: 60, scale: 1.6, opacity: 1.0 },
    card: { lean: 65, positionY: 3.5, controlTaken: true },
    lighting: { intensity: 1.6, warmth: 0.8 },
    environment: { skyColor: '#3a0a0e', spaceDepth: 0.4 }
  },
  // TRANSCENDENCE - Final cinematic position with maximum clearance
  {
    progress: 1.0,
    sun: { x: 0, y: 70, scale: 2.2, opacity: 1.0 },
    card: { lean: 80, positionY: 4.5, controlTaken: true },
    lighting: { intensity: 2.0, warmth: 1.0 },
    environment: { skyColor: '#4a0000', spaceDepth: 0.2 }
  }
];

export const CosmicDance: React.FC<CosmicDanceProps> = React.memo(({
  animationProgress,
  isPlaying,
  cardAngle,
  cameraDistance,
  isOptimalZoom,
  isOptimalPosition,
  onTriggerReached,
  onCardControlUpdate,
  templateEngine
}) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const sunRef = useRef<HTMLDivElement>(null);
  
  // Memoized trigger callback to prevent re-renders
  const handleTrigger = useCallback(() => {
    onTriggerReached?.();
  }, [onTriggerReached]);

  // Check for trigger point - ALL conditions must be met
  useEffect(() => {
    const isReadyForAlignment = cardAngle >= 45 && isOptimalZoom && isOptimalPosition;
    
    if (isReadyForAlignment && !hasTriggered) {
      setHasTriggered(true);
      handleTrigger();
    } else if (cardAngle < 40 || !isOptimalZoom || !isOptimalPosition) {
      setHasTriggered(false);
    }
  }, [cardAngle, isOptimalZoom, isOptimalPosition, hasTriggered, handleTrigger]);

  // Memoized interpolation function to prevent re-computation
  const getCurrentFrame = useCallback((progress: number) => {
    if (templateEngine) {
      // Use template engine keyframes if available
      return interpolateFrame(templateEngine.keyframes, progress);
    } else {
      // Fallback to legacy ANIMATION_FRAMES
      if (progress <= 0) return ANIMATION_FRAMES[0];
      if (progress >= 1) return ANIMATION_FRAMES[ANIMATION_FRAMES.length - 1];

      // Find the two frames to interpolate between
      let nextFrameIndex = ANIMATION_FRAMES.findIndex(frame => frame.progress > progress);
      if (nextFrameIndex === -1) nextFrameIndex = ANIMATION_FRAMES.length - 1;
      
      const prevFrame = ANIMATION_FRAMES[nextFrameIndex - 1] || ANIMATION_FRAMES[0];
      const nextFrame = ANIMATION_FRAMES[nextFrameIndex];
      
      // Calculate interpolation factor
      const frameProgress = (progress - prevFrame.progress) / (nextFrame.progress - prevFrame.progress);
      const t = Math.max(0, Math.min(1, frameProgress));
      
      // Interpolate all values
      return {
        progress,
        sun: {
          x: THREE.MathUtils.lerp(prevFrame.sun.x, nextFrame.sun.x, t),
          y: THREE.MathUtils.lerp(prevFrame.sun.y, nextFrame.sun.y, t),
          scale: THREE.MathUtils.lerp(prevFrame.sun.scale, nextFrame.sun.scale, t),
          opacity: THREE.MathUtils.lerp(prevFrame.sun.opacity, nextFrame.sun.opacity, t),
        },
        card: {
          lean: THREE.MathUtils.lerp(prevFrame.card.lean, nextFrame.card.lean, t),
          positionY: THREE.MathUtils.lerp(prevFrame.card.positionY, nextFrame.card.positionY, t),
          controlTaken: nextFrame.card.controlTaken || prevFrame.card.controlTaken,
        },
        lighting: {
          intensity: THREE.MathUtils.lerp(prevFrame.lighting.intensity, nextFrame.lighting.intensity, t),
          warmth: THREE.MathUtils.lerp(prevFrame.lighting.warmth, nextFrame.lighting.warmth, t),
        },
        environment: {
          skyColor: prevFrame.environment.skyColor, // Use discrete color changes for now
          spaceDepth: THREE.MathUtils.lerp(prevFrame.environment.spaceDepth, nextFrame.environment.spaceDepth, t),
        }
      };
    }
  }, [templateEngine]);

  // Memoized current frame to prevent object recreation
  const currentFrame = useMemo(() => getCurrentFrame(animationProgress), [getCurrentFrame, animationProgress]);

  // Stable card control update with proper dependencies
  useEffect(() => {
    if (isPlaying && onCardControlUpdate) {
      // Handle both template engine format and legacy format
      const cardData = templateEngine ? {
        positionY: (currentFrame.card as any)?.y || 0,
        lean: (currentFrame.card as any)?.lean || 0,
        controlTaken: (currentFrame.card as any)?.lock || false
      } : {
        positionY: (currentFrame.card as any).positionY || 0,
        lean: (currentFrame.card as any).lean || 0,
        controlTaken: (currentFrame.card as any).controlTaken || false
      };
      
      onCardControlUpdate(cardData);
    }
  }, [isPlaying, animationProgress, templateEngine]); // Use animationProgress instead of currentFrame

  // Enhanced cosmic environment effects with stable dependencies
  useEffect(() => {
    // Apply environment effects to document body for full immersion
    const body = document.body;
    
    // Handle both template engine format and legacy format
    const skyColor = templateEngine 
      ? (currentFrame.environment as any)?.backgroundColor || '#0a0a2e'
      : (currentFrame.environment as any)?.skyColor || '#0a0a2e';
    const spaceDepth = templateEngine
      ? (currentFrame.environment as any)?.intensity || 1.0
      : (currentFrame.environment as any)?.spaceDepth || 1.0;
    
    // Subtle background color shift for cosmic atmosphere
    body.style.background = `radial-gradient(circle at center, ${skyColor} 0%, #000000 100%)`;
    
    return () => {
      // Cleanup on unmount
      body.style.background = '';
    };
  }, [templateEngine, currentFrame.environment]);

  // Sun animation removed - sun now rendered in 3D scene at fixed position

  // Handle animation completion for studio transition
  useEffect(() => {
    if (templateEngine?.transitionToStudio && animationProgress >= 1 && !isPlaying) {
      // Animation completed, trigger studio transition
      onTriggerReached?.();
    }
  }, [templateEngine, animationProgress, isPlaying, onTriggerReached]);

  return (
    <>
      {/* Cosmic Moon - 2001 Style Crescent - Above hero title, static after animation */}
      <CosmicMoon
        progress={animationProgress}
        isVisible={animationProgress > 0.1}
        isAnimationComplete={!isPlaying && animationProgress >= 1.0}
        templateEngine={templateEngine}
      />
    </>
  );
});