
import { useCallback, useEffect, useRef } from 'react';
import { PHYSICS_CONSTANTS } from './physicsConstants';
import type { PhysicsState } from './types';

interface UsePhysicsAnimationProps {
  isDragging: boolean;
  physicsState: PhysicsState;
  setPhysicsState: (updater: (prev: PhysicsState) => PhysicsState) => void;
  rotation: { x: number; y: number };
  setRotation: (rotation: { x: number; y: number }) => void;
}

export const usePhysicsAnimation = ({
  isDragging,
  physicsState,
  setPhysicsState,
  rotation,
  setRotation
}: UsePhysicsAnimationProps) => {
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);

  const {
    DAMPING,
    ANGULAR_DAMPING,
    MIN_VELOCITY
  } = PHYSICS_CONSTANTS;

  // Enhanced physics animation loop with full 360° freedom
  const animatePhysics = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = Math.min(currentTime - lastFrameTime.current, 16);
    lastFrameTime.current = currentTime;

    setPhysicsState(prev => {
      if (isDragging || (
        Math.abs(prev.velocity.x) < MIN_VELOCITY && 
        Math.abs(prev.velocity.y) < MIN_VELOCITY &&
        Math.abs(prev.angularVelocity.x) < MIN_VELOCITY &&
        Math.abs(prev.angularVelocity.y) < MIN_VELOCITY
      )) {
        return prev;
      }

      // Enhanced momentum with angular velocity
      const newVelocity = {
        x: prev.velocity.x * DAMPING,
        y: prev.velocity.y * DAMPING
      };

      const newAngularVelocity = {
        x: prev.angularVelocity.x * ANGULAR_DAMPING,
        y: prev.angularVelocity.y * ANGULAR_DAMPING
      };

      // Apply enhanced velocity to rotation with FULL 360° freedom
      const newRotation = {
        x: rotation.x + newAngularVelocity.x * deltaTime, // No limits - full vertical freedom
        y: rotation.y + newAngularVelocity.y * deltaTime  // No limits - full horizontal freedom
      };

      // NO SPRING-BACK for full freedom - let the card rotate naturally
      setRotation(newRotation);

      return {
        ...prev,
        velocity: newVelocity,
        angularVelocity: newAngularVelocity,
        momentum: newVelocity
      };
    });

    animationRef.current = requestAnimationFrame(animatePhysics);
  }, [isDragging, rotation, setRotation, setPhysicsState, DAMPING, ANGULAR_DAMPING, MIN_VELOCITY]);

  // Start enhanced physics animation with full freedom
  useEffect(() => {
    const hasSignificantVelocity = Math.abs(physicsState.velocity.x) > MIN_VELOCITY || 
                                  Math.abs(physicsState.velocity.y) > MIN_VELOCITY ||
                                  Math.abs(physicsState.angularVelocity.x) > MIN_VELOCITY ||
                                  Math.abs(physicsState.angularVelocity.y) > MIN_VELOCITY;

    if (!isDragging && hasSignificantVelocity) {
      lastFrameTime.current = performance.now();
      animationRef.current = requestAnimationFrame(animatePhysics);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, physicsState.velocity, physicsState.angularVelocity, animatePhysics, MIN_VELOCITY]);

  return { animatePhysics };
};
