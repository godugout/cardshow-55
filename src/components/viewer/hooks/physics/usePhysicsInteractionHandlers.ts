
import { useCallback, useEffect } from 'react';
import { PHYSICS_CONSTANTS } from './physicsConstants';
import { useTouchGestures } from '../useTouchGestures';
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
    MAX_ROTATION_X,
    GRIP_SENSITIVITY,
    CLICK_THRESHOLD,
    CLICK_TIME_THRESHOLD,
    MIN_VELOCITY,
    TOUCH_SENSITIVITY_MULTIPLIER,
    SWIPE_VELOCITY_THRESHOLD
  } = PHYSICS_CONSTANTS;

  // Calculate enhanced rotation sensitivity with much higher values
  const getRotationSensitivity = useCallback((gripPoint: { x: number; y: number }, isTouch: boolean = false) => {
    const centerX = 0.5;
    const centerY = 0.5;
    const distanceFromCenter = Math.sqrt(
      Math.pow(gripPoint.x - centerX, 2) + Math.pow(gripPoint.y - centerY, 2)
    );
    const baseSensitivity = Math.max(1.2, distanceFromCenter * GRIP_SENSITIVITY);
    
    // Add effect intensity bonus for enhanced sensitivity with effects
    const effectBonus = 1 + (effectIntensity * 0.4);
    
    // Apply touch multiplier for touch devices
    const touchMultiplier = isTouch ? TOUCH_SENSITIVITY_MULTIPLIER : 1.0;
    
    return baseSensitivity * effectBonus * touchMultiplier;
  }, [effectIntensity, GRIP_SENSITIVITY, TOUCH_SENSITIVITY_MULTIPLIER]);

  // Enhanced gesture handlers
  const handleGestureStart = useCallback((position: { x: number; y: number }) => {
    if (!allowRotation) return;
    
    console.log('🎯 Enhanced gesture started with high sensitivity');
    
    setIsDragging(true);
    setAutoRotate(false);
    
    setPhysicsState(prev => ({
      ...prev,
      gripPoint: position,
      isGripping: true,
      lastPosition: position,
      velocity: { x: 0, y: 0 },
      angularVelocity: { x: 0, y: 0 },
      momentum: { x: 0, y: 0 },
      dragDistance: 0,
      dragStartTime: Date.now()
    }));

    onGripPointChange?.(position);
  }, [allowRotation, setIsDragging, setAutoRotate, onGripPointChange, setPhysicsState]);

  const handleGestureMove = useCallback((delta: { x: number; y: number }, velocity: { x: number; y: number }) => {
    if (!allowRotation || !physicsState.isGripping || !physicsState.gripPoint) return;
    
    // Calculate enhanced sensitivity
    const sensitivity = getRotationSensitivity(physicsState.gripPoint, false);
    
    // Apply much higher multipliers for immediate response
    const enhancedVelocity = {
      x: delta.x * VELOCITY_MULTIPLIER * sensitivity * 100, // Much higher multiplier
      y: delta.y * VELOCITY_MULTIPLIER * sensitivity * 100
    };

    const angularVelocity = {
      x: -enhancedVelocity.y * ANGULAR_VELOCITY_MULTIPLIER,
      y: enhancedVelocity.x * ANGULAR_VELOCITY_MULTIPLIER
    };

    // Apply immediate rotation with expanded range and high sensitivity
    const newRotation = {
      x: Math.max(-MAX_ROTATION_X, Math.min(MAX_ROTATION_X, rotation.x + angularVelocity.x * 0.15)),
      y: rotation.y + angularVelocity.y * 0.15
    };

    setRotation(newRotation);
    
    // Update physics state
    setPhysicsState(prev => {
      const newDragDistance = prev.dragDistance + Math.sqrt(delta.x * delta.x + delta.y * delta.y) * 1000;
      return {
        ...prev,
        velocity: enhancedVelocity,
        angularVelocity,
        dragDistance: newDragDistance
      };
    });
  }, [allowRotation, physicsState.isGripping, physicsState.gripPoint, rotation, setRotation, getRotationSensitivity, setPhysicsState, VELOCITY_MULTIPLIER, ANGULAR_VELOCITY_MULTIPLIER, MAX_ROTATION_X]);

  const handleGestureEnd = useCallback((finalVelocity: { x: number; y: number }) => {
    const dragEndTime = Date.now();
    const dragDuration = dragEndTime - physicsState.dragStartTime;
    const isClick = physicsState.dragDistance < CLICK_THRESHOLD && dragDuration < CLICK_TIME_THRESHOLD;
    
    console.log('🎯 Enhanced gesture ended:', {
      isClick,
      dragDistance: physicsState.dragDistance,
      finalVelocity,
      hasSwipeMomentum: Math.abs(finalVelocity.x) > SWIPE_VELOCITY_THRESHOLD || Math.abs(finalVelocity.y) > SWIPE_VELOCITY_THRESHOLD
    });
    
    setIsDragging(false);
    
    setPhysicsState(prev => ({
      ...prev,
      isGripping: false,
      gripPoint: null,
      velocity: finalVelocity,
      angularVelocity: {
        x: -finalVelocity.y * ANGULAR_VELOCITY_MULTIPLIER * 0.5,
        y: finalVelocity.x * ANGULAR_VELOCITY_MULTIPLIER * 0.5
      }
    }));

    onGripPointChange?.(null);
    
    // Start momentum animation if there's significant velocity
    const hasSignificantVelocity = Math.abs(finalVelocity.x) > MIN_VELOCITY || Math.abs(finalVelocity.y) > MIN_VELOCITY;
    
    if (hasSignificantVelocity) {
      requestAnimationFrame(animatePhysics);
    }

    return { isClick, dragDistance: physicsState.dragDistance };
  }, [setIsDragging, onGripPointChange, physicsState, animatePhysics, CLICK_THRESHOLD, CLICK_TIME_THRESHOLD, MIN_VELOCITY, SWIPE_VELOCITY_THRESHOLD, ANGULAR_VELOCITY_MULTIPLIER, setPhysicsState]);

  // Initialize touch gestures
  const {
    touchHandlers,
    mouseHandlers,
    wheelHandler
  } = useTouchGestures({
    onGestureStart: handleGestureStart,
    onGestureMove: handleGestureMove,
    onGestureEnd: handleGestureEnd,
    containerRef
  });

  // Add wheel event listener for trackpad support
  useEffect(() => {
    const container = containerRef.current;
    if (container && allowRotation) {
      container.addEventListener('wheel', wheelHandler, { passive: false });
      return () => container.removeEventListener('wheel', wheelHandler);
    }
  }, [containerRef, allowRotation, wheelHandler]);

  // Legacy mouse handlers for compatibility
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseHandlers.onMouseMove(e);
  }, [mouseHandlers]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    mouseHandlers.onMouseDown(e);
  }, [mouseHandlers]);

  const handleDragEnd = useCallback(() => {
    mouseHandlers.onMouseUp();
  }, [mouseHandlers]);

  return {
    handleMouseMove,
    handleDragStart,
    handleDragEnd,
    // New touch handlers
    touchHandlers,
    wheelHandler
  };
};
