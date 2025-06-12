
import { useCallback, useEffect, useRef, useState } from 'react';

interface AdvancedPhysicsState {
  angularVelocity: { x: number; y: number; z: number };
  lastPosition: { x: number; y: number };
  gripPoint: { x: number; y: number } | null;
  isGripping: boolean;
  momentum: { x: number; y: number };
  rotationalInertia: number;
  snapTargets: number[];
  isSnapping: boolean;
}

interface UseAdvancedPhysicsCardInteractionProps {
  allowRotation: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  rotation: { x: number; y: number };
  onGripPointChange?: (point: { x: number; y: number } | null) => void;
  effectIntensity?: number; // For dynamic inertia based on effects
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
  
  const [physicsState, setPhysicsState] = useState<AdvancedPhysicsState>({
    angularVelocity: { x: 0, y: 0, z: 0 },
    lastPosition: { x: 0, y: 0 },
    gripPoint: null,
    isGripping: false,
    momentum: { x: 0, y: 0 },
    rotationalInertia: 1.0,
    snapTargets: [0, 90, 180, 270], // Cardinal angles for Y-axis
    isSnapping: false
  });

  // Enhanced physics constants
  const DAMPING = 0.94; // Slightly higher for smoother motion
  const ANGULAR_DAMPING = 0.96; // Separate damping for angular velocity
  const VELOCITY_MULTIPLIER = 0.8; // Increased sensitivity
  const MIN_VELOCITY = 0.005; // Lower threshold for longer momentum
  const SNAP_THRESHOLD = 15; // Degrees within which snapping occurs
  const SNAP_STRENGTH = 0.3; // How strong the magnetic snap is
  const GYROSCOPIC_EFFECT = 0.1; // Cross-axis influence
  const FLICK_THRESHOLD = 5; // Minimum velocity for flick gesture

  // Dynamic inertia based on effect intensity (heavier cards with more effects)
  const getRotationalInertia = useCallback(() => {
    return 1.0 + (effectIntensity / 100) * 0.5; // Max 1.5x inertia at 100% effects
  }, [effectIntensity]);

  // Find nearest snap target
  const findNearestSnapTarget = useCallback((angle: number, targets: number[]) => {
    let normalizedAngle = ((angle % 360) + 360) % 360; // Normalize to 0-360
    let minDistance = Infinity;
    let nearestTarget = null;
    
    for (const target of targets) {
      const distance = Math.abs(normalizedAngle - target);
      const wrappedDistance = Math.abs(normalizedAngle - (target + 360));
      const finalDistance = Math.min(distance, wrappedDistance);
      
      if (finalDistance < minDistance && finalDistance < SNAP_THRESHOLD) {
        minDistance = finalDistance;
        nearestTarget = target;
      }
    }
    
    return nearestTarget;
  }, []);

  // Advanced physics animation loop
  const animateAdvancedPhysics = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = Math.min(currentTime - lastFrameTime.current, 16); // Cap at 16ms
    lastFrameTime.current = currentTime;

    setPhysicsState(prev => {
      if (isDragging) return prev;

      const inertia = getRotationalInertia();
      
      // Apply angular damping
      const newAngularVelocity = {
        x: prev.angularVelocity.x * ANGULAR_DAMPING,
        y: prev.angularVelocity.y * ANGULAR_DAMPING,
        z: prev.angularVelocity.z * ANGULAR_DAMPING
      };

      // Gyroscopic effects - rotation on one axis affects the other
      const gyroInfluenceX = prev.angularVelocity.y * GYROSCOPIC_EFFECT;
      const gyroInfluenceY = prev.angularVelocity.x * GYROSCOPIC_EFFECT;

      // Check for magnetic snapping on Y-axis
      const nearestYTarget = findNearestSnapTarget(rotation.y, prev.snapTargets);
      let finalAngularVelocityY = newAngularVelocity.y;
      
      if (nearestYTarget !== null && Math.abs(newAngularVelocity.y) < 1) {
        const snapForce = (nearestYTarget - rotation.y) * SNAP_STRENGTH;
        finalAngularVelocityY += snapForce;
      }

      // Apply angular velocity to rotation with full 360° freedom
      const targetRotation = {
        x: rotation.x + (newAngularVelocity.x + gyroInfluenceX) * deltaTime / inertia,
        y: rotation.y + (finalAngularVelocityY + gyroInfluenceY) * deltaTime / inertia
      };

      // Clamp X rotation to reasonable limits (full flip capability)
      targetRotation.x = Math.max(-90, Math.min(90, targetRotation.x));
      
      // Y rotation is completely free (360°)
      // No clamping needed - let it spin freely

      setRotation(targetRotation);

      // Stop animation when velocity is very low
      const totalVelocity = Math.abs(newAngularVelocity.x) + Math.abs(newAngularVelocity.y);
      if (totalVelocity < MIN_VELOCITY) {
        return {
          ...prev,
          angularVelocity: { x: 0, y: 0, z: 0 },
          momentum: { x: 0, y: 0 }
        };
      }

      return {
        ...prev,
        angularVelocity: newAngularVelocity,
        rotationalInertia: inertia
      };
    });

    animationRef.current = requestAnimationFrame(animateAdvancedPhysics);
  }, [isDragging, rotation, setRotation, getRotationalInertia, findNearestSnapTarget]);

  // Start advanced physics animation
  useEffect(() => {
    const hasVelocity = Math.abs(physicsState.angularVelocity.x) > MIN_VELOCITY || 
                      Math.abs(physicsState.angularVelocity.y) > MIN_VELOCITY;
    
    if (!isDragging && hasVelocity) {
      lastFrameTime.current = performance.now();
      animationRef.current = requestAnimationFrame(animateAdvancedPhysics);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, physicsState.angularVelocity, animateAdvancedPhysics]);

  // Enhanced mouse move with advanced physics
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
      
      // Enhanced sensitivity calculation based on grip position
      const centerDistance = Math.sqrt(
        Math.pow(physicsState.gripPoint.x - 0.5, 2) + 
        Math.pow(physicsState.gripPoint.y - 0.5, 2)
      );
      const sensitivity = Math.max(0.5, centerDistance * 1.5) * VELOCITY_MULTIPLIER;
      
      // Calculate angular velocity with enhanced physics
      const angularVelX = -deltaY * sensitivity * 0.1; // Inverted for natural movement
      const angularVelY = deltaX * sensitivity * 0.1;
      
      // Apply rotation with full 360° freedom
      const newRotation = {
        x: Math.max(-90, Math.min(90, rotation.x + angularVelX)), // X limited to flip range
        y: rotation.y + angularVelY // Y completely unlimited for 360° spin
      };

      setRotation(newRotation);
      
      // Update angular velocity for momentum
      setPhysicsState(prev => ({
        ...prev,
        angularVelocity: {
          x: angularVelX * 0.8, // Store velocity for momentum
          y: angularVelY * 0.8,
          z: 0
        },
        lastPosition: currentPosition
      }));
    }
  }, [allowRotation, isDragging, physicsState.gripPoint, physicsState.lastPosition, rotation, setRotation]);

  // Enhanced drag start with advanced grip detection
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!allowRotation || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const gripPoint = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };

    console.log('🎯 Advanced physics drag started at:', gripPoint);
    
    setIsDragging(true);
    setAutoRotate(false);
    
    setPhysicsState(prev => ({
      ...prev,
      gripPoint,
      isGripping: true,
      lastPosition: gripPoint,
      angularVelocity: { x: 0, y: 0, z: 0 }, // Reset velocity on new grip
      momentum: { x: 0, y: 0 }
    }));

    onGripPointChange?.(gripPoint);
  }, [allowRotation, setIsDragging, setAutoRotate, onGripPointChange]);

  // Enhanced drag end with flick gesture detection
  const handleDragEnd = useCallback(() => {
    console.log('🎯 Advanced physics drag ended with velocity:', physicsState.angularVelocity);
    
    setIsDragging(false);
    
    // Detect flick gestures for enhanced spinning
    const totalVelocity = Math.abs(physicsState.angularVelocity.x) + Math.abs(physicsState.angularVelocity.y);
    if (totalVelocity > FLICK_THRESHOLD) {
      console.log('🌪️ Flick gesture detected! Enhanced spin activated.');
      // Boost velocity for dramatic spinning effect
      setPhysicsState(prev => ({
        ...prev,
        angularVelocity: {
          x: prev.angularVelocity.x * 1.5,
          y: prev.angularVelocity.y * 1.5,
          z: 0
        },
        isGripping: false,
        gripPoint: null
      }));
    } else {
      setPhysicsState(prev => ({
        ...prev,
        isGripping: false,
        gripPoint: null
      }));
    }

    onGripPointChange?.(null);
    
    // Start momentum animation
    if (totalVelocity > MIN_VELOCITY) {
      lastFrameTime.current = performance.now();
      animationRef.current = requestAnimationFrame(animateAdvancedPhysics);
    }
  }, [setIsDragging, onGripPointChange, physicsState.angularVelocity, animateAdvancedPhysics]);

  return {
    containerRef,
    physicsState,
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  };
};
