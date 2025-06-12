
import { useCallback, useEffect, useRef, useState } from 'react';

interface PhysicsState {
  velocity: { x: number; y: number };
  lastPosition: { x: number; y: number };
  gripPoint: { x: number; y: number } | null;
  isGripping: boolean;
  momentum: { x: number; y: number };
}

interface UsePhysicsCardInteractionProps {
  allowRotation: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  rotation: { x: number; y: number };
  onGripPointChange?: (point: { x: number; y: number } | null) => void;
}

export const usePhysicsCardInteraction = ({
  allowRotation,
  isDragging,
  setIsDragging,
  setRotation,
  setAutoRotate,
  rotation,
  onGripPointChange
}: UsePhysicsCardInteractionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    velocity: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
    gripPoint: null,
    isGripping: false,
    momentum: { x: 0, y: 0 }
  });

  // Physics constants
  const DAMPING = 0.92; // How quickly movement slows down
  const SPRING_STRENGTH = 0.15; // How strong the spring physics feel
  const VELOCITY_MULTIPLIER = 0.3; // How sensitive rotation is to movement
  const MIN_VELOCITY = 0.01; // Minimum velocity before stopping
  const GRIP_SENSITIVITY = 1.2; // How much grip point affects sensitivity
  const MAX_ROTATION = 45; // Maximum rotation in degrees

  // Calculate rotation sensitivity based on distance from center
  const getRotationSensitivity = useCallback((gripPoint: { x: number; y: number }) => {
    const centerX = 0.5;
    const centerY = 0.5;
    const distanceFromCenter = Math.sqrt(
      Math.pow(gripPoint.x - centerX, 2) + Math.pow(gripPoint.y - centerY, 2)
    );
    // More sensitive at edges, less sensitive at center
    return Math.max(0.5, distanceFromCenter * GRIP_SENSITIVITY);
  }, []);

  // Physics animation loop
  const animatePhysics = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = Math.min(currentTime - lastFrameTime.current, 16); // Cap at 16ms
    lastFrameTime.current = currentTime;

    setPhysicsState(prev => {
      if (isDragging || (Math.abs(prev.velocity.x) < MIN_VELOCITY && Math.abs(prev.velocity.y) < MIN_VELOCITY)) {
        return prev;
      }

      // Apply momentum and damping
      const newVelocity = {
        x: prev.velocity.x * DAMPING,
        y: prev.velocity.y * DAMPING
      };

      // Apply velocity to rotation with spring physics
      const targetRotation = {
        x: Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, rotation.x + newVelocity.y * deltaTime)),
        y: rotation.y + newVelocity.x * deltaTime
      };

      // Spring back towards center when not dragging
      const springBackX = -rotation.x * SPRING_STRENGTH * 0.3;
      const finalRotation = {
        x: targetRotation.x + springBackX,
        y: targetRotation.y
      };

      setRotation(finalRotation);

      return {
        ...prev,
        velocity: newVelocity,
        momentum: newVelocity
      };
    });

    animationRef.current = requestAnimationFrame(animatePhysics);
  }, [isDragging, rotation, setRotation]);

  // Start physics animation
  useEffect(() => {
    if (!isDragging && (Math.abs(physicsState.velocity.x) > MIN_VELOCITY || Math.abs(physicsState.velocity.y) > MIN_VELOCITY)) {
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
  }, [isDragging, physicsState.velocity, animatePhysics]);

  // Enhanced mouse move with physics
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !allowRotation) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentPosition = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };

    if (isDragging && physicsState.gripPoint) {
      const deltaX = (currentPosition.x - physicsState.lastPosition.x) * rect.width;
      const deltaY = (currentPosition.y - physicsState.lastPosition.y) * rect.height;
      
      // Calculate sensitivity based on grip point
      const sensitivity = getRotationSensitivity(physicsState.gripPoint);
      
      // Calculate velocity for momentum
      const velocity = {
        x: deltaX * VELOCITY_MULTIPLIER * sensitivity,
        y: deltaY * VELOCITY_MULTIPLIER * sensitivity
      };

      // Apply rotation with enhanced physics
      const newRotation = {
        x: Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, rotation.x - velocity.y)),
        y: rotation.y + velocity.x
      };

      setRotation(newRotation);
      
      // Update physics state with new velocity
      setPhysicsState(prev => ({
        ...prev,
        velocity,
        lastPosition: currentPosition
      }));
    }
  }, [allowRotation, isDragging, physicsState.gripPoint, physicsState.lastPosition, rotation, setRotation, getRotationSensitivity]);

  // Enhanced drag start with grip point
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!allowRotation || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const gripPoint = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };

    console.log('🎯 Physics drag started at grip point:', gripPoint);
    
    setIsDragging(true);
    setAutoRotate(false);
    
    setPhysicsState(prev => ({
      ...prev,
      gripPoint,
      isGripping: true,
      lastPosition: gripPoint,
      velocity: { x: 0, y: 0 }, // Reset velocity on new grip
      momentum: { x: 0, y: 0 }
    }));

    // Notify parent of grip point for visual feedback
    onGripPointChange?.(gripPoint);
  }, [allowRotation, setIsDragging, setAutoRotate, onGripPointChange]);

  // Enhanced drag end with momentum
  const handleDragEnd = useCallback(() => {
    console.log('🎯 Physics drag ended with momentum:', physicsState.velocity);
    
    setIsDragging(false);
    
    setPhysicsState(prev => ({
      ...prev,
      isGripping: false,
      gripPoint: null
    }));

    // Clear grip point visual feedback
    onGripPointChange?.(null);
    
    // Start momentum animation if there's enough velocity
    if (Math.abs(physicsState.velocity.x) > MIN_VELOCITY || Math.abs(physicsState.velocity.y) > MIN_VELOCITY) {
      lastFrameTime.current = performance.now();
      animationRef.current = requestAnimationFrame(animatePhysics);
    }
  }, [setIsDragging, onGripPointChange, physicsState.velocity, animatePhysics]);

  return {
    containerRef,
    physicsState,
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  };
};
