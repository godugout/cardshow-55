
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

export const useCardFlipPhysics = (initialFlipped = false, physicsEnabled = true) => {
  const [isFlipped, setIsFlipped] = useState(initialFlipped);
  const [physicsState, setPhysicsState] = useState<FlipPhysicsState>({
    isFlipping: false,
    progress: 0,
    rotationY: initialFlipped ? 180 : 0,
    rotationX: 0,
    rotationZ: 0,
    scale: 1,
    shadowIntensity: 0.8,
    zOffset: 0,
    showingFront: !initialFlipped
  });

  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const configRef = useRef<FlipConfig>();

  // Generate flip configuration based on physics enabled state
  const generateFlipConfig = useCallback((): FlipConfig => {
    if (!physicsEnabled) {
      // Simple linear flip without physics
      return {
        duration: 400,
        direction: Math.random() > 0.5 ? 1 : -1,
        randomTilt: 0,
        bounceCount: 0,
        bounceDecay: 0
      };
    }

    // Physics-based flip with random elements
    return {
      duration: 600 + Math.random() * 200, // 600-800ms
      direction: Math.random() > 0.5 ? 1 : -1,
      randomTilt: (Math.random() - 0.5) * 8, // -4° to +4°
      bounceCount: Math.floor(Math.random() * 2) + 1, // 1-2 bounces
      bounceDecay: 0.4 + Math.random() * 0.2 // 0.4-0.6 decay
    };
  }, [physicsEnabled]);

  // Easing function for realistic motion
  const easeOutBounce = useCallback((t: number, bounceCount: number, bounceDecay: number) => {
    if (!physicsEnabled || bounceCount === 0) {
      // Simple smooth transition
      return t * t * (3 - 2 * t); // Smoothstep
    }

    if (t < 0.8) {
      // Main flip motion with smooth deceleration
      return t * t * (3 - 2 * t); // Smoothstep
    } else {
      // Subtle bounce phase
      const bouncePhase = (t - 0.8) / 0.2;
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
      
      return 1 + bounce * 0.02; // Very small oscillation
    }
  }, [physicsEnabled]);

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

    // Calculate target rotation based on flip direction
    const targetRotation = isFlipped ? 180 : 0;
    const startRotation = isFlipped ? 0 : 180;
    const rotationDelta = (targetRotation - startRotation) * config.direction;
    
    // Current rotation during animation
    const currentRotationY = startRotation + (rotationDelta * easedProgress);

    // Calculate other animation properties
    const anticipationX = progress < 0.1 ? (progress / 0.1) * -2 : 0;
    const randomTiltZ = config.randomTilt * Math.sin(progress * Math.PI);
    const scaleEffect = 1 - (Math.sin(progress * Math.PI) * (physicsEnabled ? 0.03 : 0.01));
    const shadowIntensity = 0.8 + (Math.sin(progress * Math.PI) * (physicsEnabled ? 0.3 : 0.1));
    const zOffset = Math.sin(progress * Math.PI) * (physicsEnabled ? 15 : 5);

    // Determine which face should be visible based on rotation
    const normalizedRotation = Math.abs(currentRotationY % 360);
    const showingFront = normalizedRotation < 90 || normalizedRotation > 270;

    setPhysicsState({
      isFlipping: progress < 1,
      progress,
      rotationY: currentRotationY,
      rotationX: anticipationX,
      rotationZ: randomTiltZ,
      scale: scaleEffect,
      shadowIntensity,
      zOffset,
      showingFront
    });

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateFlip);
    } else {
      // Animation complete - set final clean state
      setPhysicsState(prev => ({
        ...prev,
        isFlipping: false,
        rotationY: targetRotation,
        rotationX: 0,
        rotationZ: 0,
        scale: 1,
        zOffset: 0,
        showingFront: !isFlipped
      }));
      
      startTimeRef.current = undefined;
    }
  }, [easeOutBounce, isFlipped, physicsEnabled]);

  // Trigger flip animation
  const triggerFlip = useCallback(() => {
    if (physicsState.isFlipping) return; // Prevent double-flips

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Update flip state first
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);

    // Generate new configuration and start animation
    configRef.current = generateFlipConfig();
    startTimeRef.current = undefined;
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
      transition: physicsState.isFlipping ? 'none' : 'transform 0.3s ease-out'
    };
  }, [physicsState]);

  // Get shadow styles
  const getShadowStyle = useCallback(() => {
    const { shadowIntensity, zOffset } = physicsState;
    
    return {
      filter: `drop-shadow(0 ${20 + zOffset * 0.3}px ${40 + zOffset * 0.8}px rgba(0,0,0,${shadowIntensity * 0.7}))`
    };
  }, [physicsState]);

  // Simplified face visibility - let CSS 3D transforms handle visibility naturally
  const getFaceVisibility = useCallback((isFront: boolean) => {
    // Always return visible styles and let the 3D transforms determine what's seen
    return {
      opacity: 1,
      zIndex: 20
    };
  }, []);

  return {
    isFlipped,
    physicsState,
    triggerFlip,
    getTransformStyle,
    getShadowStyle,
    getFaceVisibility
  };
};
