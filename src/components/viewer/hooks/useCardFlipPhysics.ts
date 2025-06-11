
import { useState, useCallback, useRef, useEffect } from 'react';

interface FlipPhysicsState {
  isFlipping: boolean;
  progress: number; // 0 to 1
  rotationY: number;
  rotationX: number;
  rotationZ: number;
  scale: number;
  shadowIntensity: number;
  zOffset: number;
  showingFront: boolean; // Track which face should be visible
}

interface FlipConfig {
  duration: number;
  direction: 1 | -1; // clockwise or counterclockwise
  randomTilt: number;
  bounceCount: number;
  bounceDecay: number;
}

export const useCardFlipPhysics = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [physicsState, setPhysicsState] = useState<FlipPhysicsState>({
    isFlipping: false,
    progress: 0,
    rotationY: 0,
    rotationX: 0,
    rotationZ: 0,
    scale: 1,
    shadowIntensity: 0.8,
    zOffset: 0,
    showingFront: true
  });

  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const configRef = useRef<FlipConfig>();

  // Generate random flip configuration
  const generateFlipConfig = useCallback((): FlipConfig => {
    return {
      duration: 400 + Math.random() * 400, // 400-800ms
      direction: Math.random() > 0.5 ? 1 : -1,
      randomTilt: (Math.random() - 0.5) * 10, // -5° to +5°
      bounceCount: Math.floor(Math.random() * 3) + 1, // 1-3 bounces
      bounceDecay: 0.3 + Math.random() * 0.3 // 0.3-0.6 decay
    };
  }, []);

  // Easing function for realistic motion
  const easeOutBounce = useCallback((t: number, bounceCount: number, bounceDecay: number) => {
    if (t < 0.7) {
      // Main flip motion with slight deceleration
      return t * t * (3 - 2 * t); // Smoothstep
    } else {
      // Bounce phase
      const bouncePhase = (t - 0.7) / 0.3;
      let bounce = 0;
      
      for (let i = 0; i < bounceCount; i++) {
        const bounceStart = i / bounceCount;
        const bounceEnd = (i + 1) / bounceCount;
        
        if (bouncePhase >= bounceStart && bouncePhase <= bounceEnd) {
          const localPhase = (bouncePhase - bounceStart) / (bounceEnd - bounceStart);
          const amplitude = Math.pow(bounceDecay, i);
          bounce = amplitude * Math.sin(localPhase * Math.PI * 2);
        }
      }
      
      return 1 + bounce * 0.05; // Small oscillation around final position
    }
  }, []);

  // Animation step function
  const animateFlip = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const config = configRef.current!;
    const progress = Math.min(elapsed / config.duration, 1);

    // Apply easing
    const easedProgress = easeOutBounce(progress, config.bounceCount, config.bounceDecay);

    // Calculate rotations
    const baseRotationY = easedProgress * 180 * config.direction;
    const anticipationX = progress < 0.1 ? (progress / 0.1) * -3 : 0; // Pre-flip anticipation
    const randomTiltZ = config.randomTilt * Math.sin(progress * Math.PI);

    // Scale effect (slight shrink at flip peak)
    const scaleEffect = 1 - (Math.sin(progress * Math.PI) * 0.05);

    // Shadow intensity (stronger when card is perpendicular)
    const shadowIntensity = 0.8 + (Math.sin(progress * Math.PI) * 0.4);

    // Z-offset for 3D depth
    const zOffset = Math.sin(progress * Math.PI) * 20;

    // Determine which face should be visible based on rotation
    // At 90 degrees, switch faces to prevent overlap
    const currentRotation = isFlipped ? baseRotationY : baseRotationY;
    const normalizedRotation = Math.abs(currentRotation % 360);
    const showingFront = normalizedRotation < 90 || normalizedRotation > 270;

    setPhysicsState({
      isFlipping: progress < 1,
      progress,
      rotationY: isFlipped ? 180 + baseRotationY : baseRotationY,
      rotationX: anticipationX,
      rotationZ: randomTiltZ,
      scale: scaleEffect,
      shadowIntensity,
      zOffset,
      showingFront: isFlipped ? !showingFront : showingFront
    });

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateFlip);
    } else {
      // Animation complete - ensure clean final state
      setPhysicsState(prev => ({
        ...prev,
        isFlipping: false,
        rotationY: isFlipped ? 180 : 0,
        rotationX: 0,
        rotationZ: 0,
        scale: 1,
        zOffset: 0,
        showingFront: !isFlipped
      }));
      startTimeRef.current = undefined;
    }
  }, [easeOutBounce, isFlipped]);

  // Trigger flip animation
  const triggerFlip = useCallback(() => {
    if (physicsState.isFlipping) return; // Prevent double-flips

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Generate new configuration
    configRef.current = generateFlipConfig();
    
    // Start animation
    startTimeRef.current = undefined;
    setIsFlipped(!isFlipped);
    animationRef.current = requestAnimationFrame(animateFlip);
  }, [physicsState.isFlipping, isFlipped, animateFlip, generateFlipConfig]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Get transform styles for the entire card container
  const getTransformStyle = useCallback(() => {
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
      transition: physicsState.isFlipping ? 'none' : 'transform 0.2s ease-out'
    };
  }, [physicsState]);

  // Get shadow styles
  const getShadowStyle = useCallback(() => {
    const { shadowIntensity, zOffset } = physicsState;
    
    return {
      filter: `drop-shadow(0 ${25 + zOffset * 0.5}px ${50 + zOffset}px rgba(0,0,0,${shadowIntensity * 0.8}))`
    };
  }, [physicsState]);

  // Get visibility styles for card faces
  const getFaceVisibility = useCallback((isFront: boolean) => {
    const { showingFront, isFlipping } = physicsState;
    
    if (isFlipping) {
      // During flip, use z-index to control which face is visible
      return {
        opacity: 1,
        zIndex: (isFront && showingFront) || (!isFront && !showingFront) ? 30 : 10,
        backfaceVisibility: 'hidden' as const
      };
    } else {
      // When not flipping, clean visibility state
      return {
        opacity: (isFront && !isFlipped) || (!isFront && isFlipped) ? 1 : 0,
        zIndex: (isFront && !isFlipped) || (!isFront && isFlipped) ? 30 : 10,
        backfaceVisibility: 'hidden' as const
      };
    }
  }, [physicsState, isFlipped]);

  return {
    isFlipped,
    physicsState,
    triggerFlip,
    getTransformStyle,
    getShadowStyle,
    getFaceVisibility
  };
};
