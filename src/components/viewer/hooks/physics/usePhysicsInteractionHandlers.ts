
import { useCallback } from 'react';
import { PHYSICS_CONSTANTS } from './physicsConstants';
import type { PhysicsState, PhysicsHookProps } from './types';

interface UsePhysicsInteractionHandlersProps extends Pick<PhysicsHookProps, 
  'allowRotation' | 'setIsDragging' | 'setAutoRotate' | 'setRotation' | 'rotation' | 'onGripPointChange' | 'effectIntensity'
> {
  physicsState: PhysicsState;
  setPhysicsState: (updater: (prev: PhysicsState) => PhysicsState) => void;
  animatePhysics: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const usePhysicsInteractionHandlers = ({
  allowRotation,
  setIsDragging,
  setAutoRotate,
  setRotation,
  rotation,
  onGripPointChange,
  effectIntensity = 0,
  physicsState,
  setPhysicsState,
  animatePhysics,
  containerRef
}: UsePhysicsInteractionHandlersProps) => {
  const {
    VELOCITY_MULTIPLIER,
    ANGULAR_VELOCITY_MULTIPLIER,
    GRIP_SENSITIVITY,
    CLICK_THRESHOLD,
    CLICK_TIME_THRESHOLD,
    MIN_VELOCITY
  } = PHYSICS_CONSTANTS;

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
  }, [effectIntensity, GRIP_SENSITIVITY]);

  // Enhanced mouse move with full 360° vertical freedom
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !allowRotation) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentPosition = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };

    if (physicsState.isGripping && physicsState.gripPoint) {
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

      // Apply immediate rotation with FULL 360° freedom - NO CLAMPING
      const newRotation = {
        x: rotation.x + angularVelocity.x * 0.1, // No limits - full vertical freedom
        y: rotation.y + angularVelocity.y * 0.1  // No limits - full horizontal freedom
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
  }, [allowRotation, physicsState.isGripping, physicsState.gripPoint, physicsState.lastPosition, rotation, setRotation, getRotationSensitivity, containerRef, setPhysicsState, VELOCITY_MULTIPLIER, ANGULAR_VELOCITY_MULTIPLIER]);

  // Enhanced drag start with full freedom capability
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!allowRotation || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const gripPoint = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };

    console.log('🎯 Enhanced physics drag started with FULL 360° vertical freedom');
    
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
  }, [allowRotation, setIsDragging, setAutoRotate, onGripPointChange, containerRef, setPhysicsState]);

  // Enhanced drag end with full rotational momentum
  const handleDragEnd = useCallback(() => {
    const dragEndTime = Date.now();
    const dragDuration = dragEndTime - physicsState.dragStartTime;
    const isClick = physicsState.dragDistance < CLICK_THRESHOLD && dragDuration < CLICK_TIME_THRESHOLD;
    
    console.log('🎯 Enhanced physics drag ended with full 360° freedom:', {
      isClick,
      dragDistance: physicsState.dragDistance,
      dragDuration,
      momentum: physicsState.angularVelocity,
      fullVerticalFreedom: true
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
      requestAnimationFrame(animatePhysics);
    }

    // Return click detection result
    return { isClick, dragDistance: physicsState.dragDistance };
  }, [setIsDragging, onGripPointChange, physicsState, animatePhysics, CLICK_THRESHOLD, CLICK_TIME_THRESHOLD, MIN_VELOCITY, setPhysicsState]);

  return {
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  };
};
