
import { useCallback, useEffect, useRef, useState } from 'react';

interface PhysicsState {
  velocity: { x: number; y: number };
  angularVelocity: { x: number; y: number };
  rotationalInertia: number;
  lastPosition: { x: number; y: number };
  gripPoint: { x: number; y: number } | null;
  isGripping: boolean;
  momentum: { x: number; y: number };
  dragDistance: number;
  dragStartTime: number;
}

interface UseAdvancedPhysicsCardInteractionProps {
  allowRotation: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  rotation: { x: number; y: number };
  onGripPointChange?: (point: { x: number; y: number } | null) => void;
  effectIntensity?: number;
}

export const useAdvancedPhysicsCardInteraction = ({
  allowRotation,
  isDragging,
  setIsDragging,
  setRotation,
  setAutoRotate,
  rotation,
  onGripPointChange,
  effectIntensity = 0
}: UseAdvancedPhysicsCardInteractionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    velocity: { x: 0, y: 0 },
    angularVelocity: { x: 0, y: 0 },
    rotationalInertia: 1.0,
    lastPosition: { x: 0, y: 0 },
    gripPoint: null,
    isGripping: false,
    momentum: { x: 0, y: 0 },
    dragDistance: 0,
    dragStartTime: 0
  });

  // Enhanced physics constants for better responsiveness
  const DAMPING = 0.88; // Reduced for more immediate response
  const ANGULAR_DAMPING = 0.90;
  const SPRING_STRENGTH = 0.15;
  const VELOCITY_MULTIPLIER = 1.8; // Increased from 0.8 for much better sensitivity
  const ANGULAR_VELOCITY_MULTIPLIER = 2.2; // Enhanced angular response
  const MIN_VELOCITY = 0.008; // Slightly lower threshold
  const GRIP_SENSITIVITY = 1.4;
  const MAX_ROTATION_X = 35;
  const MAX_ROTATION_Y = 180;
  const CLICK_THRESHOLD = 5; // Pixels - movement below this is considered a click
  const CLICK_TIME_THRESHOLD = 300; // ms - max time for a click

  // Calculate enhanced rotation sensitivity
  const getRotationSensitivity = useCallback((gripPoint: { x: number; y: number }) => {
    const centerX = 0.5;
    const centerY = 0.5;
    const distanceFromCenter = Math.sqrt(
      Math.pow(gripPoint.x - centerX, 2) + Math.pow(gripPoint.y - centerY, 2)
    );
    const baseSensitivity = Math.max(0.7, distanceFromCenter * GRIP_SENSITIVITY);
    
    // Add effect intensity bonus for enhanced sensitivity with effects
    const effectBonus = 1 + (effectIntensity * 0.3);
    return baseSensitivity * effectBonus;
  }, [effectIntensity]);

  // Enhanced physics animation loop
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

      // Apply enhanced velocity to rotation
      const targetRotation = {
        x: Math.max(-MAX_ROTATION_X, Math.min(MAX_ROTATION_X, rotation.x + newAngularVelocity.x * deltaTime)),
        y: rotation.y + newAngularVelocity.y * deltaTime
      };

      // Enhanced spring back for X-axis
      const springBackX = -rotation.x * SPRING_STRENGTH * 0.4;
      const finalRotation = {
        x: targetRotation.x + springBackX,
        y: targetRotation.y
      };

      setRotation(finalRotation);

      return {
        ...prev,
        velocity: newVelocity,
        angularVelocity: newAngularVelocity,
        momentum: newVelocity
      };
    });

    animationRef.current = requestAnimationFrame(animatePhysics);
  }, [isDragging, rotation, setRotation]);

  // Start enhanced physics animation
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
  }, [isDragging, physicsState.velocity, physicsState.angularVelocity, animatePhysics]);

  // Enhanced mouse move with improved sensitivity
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
      
      // Enhanced sensitivity calculation
      const sensitivity = getRotationSensitivity(physicsState.gripPoint);
      
      // Enhanced velocity calculations with better responsiveness
      const velocity = {
        x: deltaX * VELOCITY_MULTIPLIER * sensitivity,
        y: deltaY * VELOCITY_MULTIPLIER * sensitivity
      };

      const angularVelocity = {
        x: -velocity.y * ANGULAR_VELOCITY_MULTIPLIER,
        y: velocity.x * ANGULAR_VELOCITY_MULTIPLIER
      };

      // Apply immediate rotation for responsive feel
      const newRotation = {
        x: Math.max(-MAX_ROTATION_X, Math.min(MAX_ROTATION_X, rotation.x + angularVelocity.x * 0.1)),
        y: rotation.y + angularVelocity.y * 0.1
      };

      setRotation(newRotation);
      
      // Update physics state with enhanced values
      setPhysicsState(prev => {
        const newDragDistance = prev.dragDistance + Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return {
          ...prev,
          velocity,
          angularVelocity,
          lastPosition: currentPosition,
          dragDistance: newDragDistance
        };
      });
    }
  }, [allowRotation, isDragging, physicsState.gripPoint, physicsState.lastPosition, rotation, setRotation, getRotationSensitivity]);

  // Enhanced drag start with smart click detection
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!allowRotation || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const gripPoint = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };

    console.log('🎯 Enhanced physics drag started with improved sensitivity');
    
    setIsDragging(true);
    setAutoRotate(false);
    
    setPhysicsState(prev => ({
      ...prev,
      gripPoint,
      isGripping: true,
      lastPosition: gripPoint,
      velocity: { x: 0, y: 0 },
      angularVelocity: { x: 0, y: 0 },
      momentum: { x: 0, y: 0 },
      dragDistance: 0,
      dragStartTime: Date.now()
    }));

    onGripPointChange?.(gripPoint);
  }, [allowRotation, setIsDragging, setAutoRotate, onGripPointChange]);

  // Enhanced drag end with smart click detection
  const handleDragEnd = useCallback(() => {
    const dragEndTime = Date.now();
    const dragDuration = dragEndTime - physicsState.dragStartTime;
    const isClick = physicsState.dragDistance < CLICK_THRESHOLD && dragDuration < CLICK_TIME_THRESHOLD;
    
    console.log('🎯 Enhanced physics drag ended:', {
      isClick,
      dragDistance: physicsState.dragDistance,
      dragDuration,
      momentum: physicsState.angularVelocity
    });
    
    setIsDragging(false);
    
    setPhysicsState(prev => ({
      ...prev,
      isGripping: false,
      gripPoint: null
    }));

    onGripPointChange?.(null);
    
    // Start enhanced momentum animation if there's significant velocity
    const hasSignificantVelocity = Math.abs(physicsState.angularVelocity.x) > MIN_VELOCITY || 
                                  Math.abs(physicsState.angularVelocity.y) > MIN_VELOCITY;
    
    if (hasSignificantVelocity) {
      lastFrameTime.current = performance.now();
      animationRef.current = requestAnimationFrame(animatePhysics);
    }

    // Return click detection result
    return { isClick, dragDistance: physicsState.dragDistance };
  }, [setIsDragging, onGripPointChange, physicsState, animatePhysics]);

  return {
    containerRef,
    physicsState,
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  };
};
