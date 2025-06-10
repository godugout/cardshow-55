
import { useRef, useCallback, useState, useEffect } from 'react';
import * as THREE from 'three';

interface InteractiveRotationState {
  rotation: THREE.Euler;
  angularVelocity: THREE.Vector3;
  isDragging: boolean;
  lastPointerPosition: { x: number; y: number };
  momentum: THREE.Vector3;
  isUserControlled: boolean;
}

interface RotationControls {
  sensitivity: number;
  dampingFactor: number;
  momentumDecay: number;
  maxAngularVelocity: number;
  snapToAngles: boolean;
  snapThreshold: number;
}

export const useInteractiveCardRotation = (
  controls: Partial<RotationControls> = {}
) => {
  const defaultControls: RotationControls = {
    sensitivity: 0.005,
    dampingFactor: 0.95,
    momentumDecay: 0.98,
    maxAngularVelocity: 0.2,
    snapToAngles: false,
    snapThreshold: 0.1,
    ...controls
  };

  const stateRef = useRef<InteractiveRotationState>({
    rotation: new THREE.Euler(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    isDragging: false,
    lastPointerPosition: { x: 0, y: 0 },
    momentum: new THREE.Vector3(0, 0, 0),
    isUserControlled: false
  });

  const [isInteracting, setIsInteracting] = useState(false);
  const frameId = useRef<number>();

  // Detect input method for different behaviors
  const getInputType = useCallback((event: PointerEvent | TouchEvent) => {
    if (event.type.startsWith('touch')) return 'touch';
    if (event instanceof PointerEvent) {
      if (event.pointerType === 'touch') return 'touch';
      if (event.pointerType === 'pen') return 'pen';
      return 'mouse';
    }
    return 'mouse';
  }, []);

  // Start rotation interaction
  const startRotation = useCallback((event: React.PointerEvent | React.TouchEvent) => {
    const state = stateRef.current;
    
    // Get pointer position
    let clientX, clientY;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }

    state.isDragging = true;
    state.isUserControlled = true;
    state.lastPointerPosition = { x: clientX, y: clientY };
    state.angularVelocity.set(0, 0, 0);
    state.momentum.set(0, 0, 0);
    
    setIsInteracting(true);
    console.log('🎯 Started card rotation interaction');
  }, []);

  // Update rotation during drag
  const updateRotation = useCallback((event: React.PointerEvent | React.TouchEvent) => {
    const state = stateRef.current;
    if (!state.isDragging) return;

    // Get current pointer position
    let clientX, clientY;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }

    // Calculate delta movement
    const deltaX = clientX - state.lastPointerPosition.x;
    const deltaY = clientY - state.lastPointerPosition.y;

    // Convert screen movement to rotation
    const rotationY = deltaX * defaultControls.sensitivity;
    const rotationX = -deltaY * defaultControls.sensitivity;

    // Update rotation
    state.rotation.y += rotationY;
    state.rotation.x += rotationX;

    // Store momentum for later use
    state.momentum.set(rotationX, rotationY, 0);
    
    // Clamp rotation to prevent gimbal lock
    state.rotation.x = THREE.MathUtils.clamp(state.rotation.x, -Math.PI / 2, Math.PI / 2);

    // Update last position
    state.lastPointerPosition = { x: clientX, y: clientY };
  }, [defaultControls.sensitivity]);

  // End rotation interaction
  const endRotation = useCallback(() => {
    const state = stateRef.current;
    state.isDragging = false;
    
    // Apply momentum for spinning effect
    const momentumMagnitude = state.momentum.length();
    if (momentumMagnitude > 0.01) {
      state.angularVelocity.copy(state.momentum.clone().multiplyScalar(2));
      
      // Clamp angular velocity
      if (state.angularVelocity.length() > defaultControls.maxAngularVelocity) {
        state.angularVelocity.normalize().multiplyScalar(defaultControls.maxAngularVelocity);
      }
      
      console.log('🌪️ Applied momentum spinning');
    } else {
      state.isUserControlled = false;
    }
    
    setIsInteracting(false);
  }, [defaultControls.maxAngularVelocity]);

  // Handle double-tap for 180° flip
  const handleFlip = useCallback((axis: 'x' | 'y' | 'z' = 'y') => {
    const state = stateRef.current;
    state.isUserControlled = true;
    
    // Animate flip
    const targetRotation = state.rotation.clone();
    targetRotation[axis] += Math.PI;
    
    // Smooth transition to flipped state
    const animateFlip = () => {
      const current = state.rotation[axis];
      const target = targetRotation[axis];
      const diff = target - current;
      
      if (Math.abs(diff) > 0.01) {
        state.rotation[axis] += diff * 0.15;
        frameId.current = requestAnimationFrame(animateFlip);
      } else {
        state.rotation[axis] = target;
        state.isUserControlled = false;
      }
    };
    
    if (frameId.current) cancelAnimationFrame(frameId.current);
    animateFlip();
    
    console.log(`🔄 Flipped card on ${axis} axis`);
  }, []);

  // Reset rotation to neutral
  const resetRotation = useCallback(() => {
    const state = stateRef.current;
    state.isUserControlled = true;
    state.angularVelocity.set(0, 0, 0);
    state.momentum.set(0, 0, 0);
    
    // Smooth transition to neutral
    const animateReset = () => {
      const hasMovement = 
        Math.abs(state.rotation.x) > 0.01 || 
        Math.abs(state.rotation.y) > 0.01 || 
        Math.abs(state.rotation.z) > 0.01;
      
      if (hasMovement) {
        state.rotation.x *= 0.9;
        state.rotation.y *= 0.9;
        state.rotation.z *= 0.9;
        frameId.current = requestAnimationFrame(animateReset);
      } else {
        state.rotation.set(0, 0, 0);
        state.isUserControlled = false;
      }
    };
    
    if (frameId.current) cancelAnimationFrame(frameId.current);
    animateReset();
    
    console.log('↺ Reset card rotation');
  }, []);

  // Physics update loop
  const updatePhysics = useCallback(() => {
    const state = stateRef.current;
    
    if (!state.isDragging && state.angularVelocity.length() > 0.001) {
      // Apply momentum rotation
      state.rotation.x += state.angularVelocity.x;
      state.rotation.y += state.angularVelocity.y;
      state.rotation.z += state.angularVelocity.z;
      
      // Apply damping
      state.angularVelocity.multiplyScalar(defaultControls.momentumDecay);
      
      // Stop when velocity is negligible
      if (state.angularVelocity.length() < 0.001) {
        state.angularVelocity.set(0, 0, 0);
        state.isUserControlled = false;
      }
    }
    
    // Snap to angles if enabled
    if (defaultControls.snapToAngles && !state.isDragging && !state.isUserControlled) {
      const snapAngle = Math.PI / 2; // 90 degrees
      ['x', 'y', 'z'].forEach(axis => {
        const current = state.rotation[axis as keyof THREE.Euler] as number;
        const snapped = Math.round(current / snapAngle) * snapAngle;
        const diff = snapped - current;
        
        if (Math.abs(diff) < defaultControls.snapThreshold) {
          (state.rotation[axis as keyof THREE.Euler] as number) = snapped;
        }
      });
    }
    
    return {
      rotation: state.rotation.clone(),
      isUserControlled: state.isUserControlled,
      angularVelocity: state.angularVelocity.clone()
    };
  }, [defaultControls.momentumDecay, defaultControls.snapToAngles, defaultControls.snapThreshold]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  return {
    startRotation,
    updateRotation,
    endRotation,
    handleFlip,
    resetRotation,
    updatePhysics,
    isInteracting,
    getRotation: () => stateRef.current.rotation.clone(),
    isUserControlled: () => stateRef.current.isUserControlled
  };
};
