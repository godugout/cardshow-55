
import { useState, useCallback, useRef, useEffect } from 'react';
import type { FlipPhysicsState, FlipConfig } from './flipPhysics/types';
import { generateFlipConfig } from './flipPhysics/flipConfig';
import { easeOutBounce } from './flipPhysics/easingFunctions';
import { getTransformStyle, getShadowStyle, getFaceVisibility } from './flipPhysics/transformUtils';

export const useCardFlipPhysics = (initialFlipped = false, physicsEnabled = true) => {
  const [isFlipped, setIsFlipped] = useState(initialFlipped);
  // FIXED: Initialize with correct rotation - 0 for front face, 180 for back face
  const [physicsState, setPhysicsState] = useState<FlipPhysicsState>({
    isFlipping: false,
    progress: 0,
    rotationY: initialFlipped ? 180 : 0, // Start with correct rotation
    rotationX: 0,
    rotationZ: 0,
    scale: 1,
    shadowIntensity: 0.8,
    zOffset: 0,
    showingFront: !initialFlipped // Start showing front when not flipped
  });

  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const configRef = useRef<FlipConfig>();

  // Animation step function
  const animateFlip = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const config = configRef.current!;
    const progress = Math.min(elapsed / config.duration, 1);

    // Apply easing
    const easedProgress = easeOutBounce(progress, config.bounceCount, config.bounceDecay, physicsEnabled);

    // Calculate target rotation based on flip direction
    const targetRotation = isFlipped ? 0 : 180; // FIXED: Flip between 0 and 180 correctly
    const startRotation = isFlipped ? 180 : 0;   // FIXED: Start from opposite state
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
    const showingFront = normalizedRotation <= 90 || normalizedRotation >= 270;

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
        showingFront: targetRotation === 0 // FIXED: Correctly determine final state
      }));
      
      startTimeRef.current = undefined;
    }
  }, [isFlipped, physicsEnabled]);

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
    configRef.current = generateFlipConfig(physicsEnabled);
    startTimeRef.current = undefined;
    animationRef.current = requestAnimationFrame(animateFlip);
  }, [physicsState.isFlipping, isFlipped, animateFlip, physicsEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Export utility functions
  const getTransformStyleWrapper = useCallback(() => getTransformStyle(physicsState), [physicsState]);
  const getShadowStyleWrapper = useCallback(() => getShadowStyle(physicsState), [physicsState]);

  return {
    isFlipped,
    physicsState,
    triggerFlip,
    getTransformStyle: getTransformStyleWrapper,
    getShadowStyle: getShadowStyleWrapper,
    getFaceVisibility
  };
};
