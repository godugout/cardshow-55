
import { useRef, useCallback, useState } from 'react';
import * as THREE from 'three';

interface SimpleRotationState {
  rotation: THREE.Euler;
  isDragging: boolean;
  lastPointerPosition: { x: number; y: number };
  targetRotation: THREE.Euler;
}

export const useSimpleCardRotation = () => {
  const stateRef = useRef<SimpleRotationState>({
    rotation: new THREE.Euler(0, 0, 0),
    isDragging: false,
    lastPointerPosition: { x: 0, y: 0 },
    targetRotation: new THREE.Euler(0, 0, 0)
  });

  const [isInteracting, setIsInteracting] = useState(false);

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
    state.lastPointerPosition = { x: clientX, y: clientY };
    setIsInteracting(true);
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

    // Calculate delta movement and convert to rotation
    const deltaX = clientX - state.lastPointerPosition.x;
    const deltaY = clientY - state.lastPointerPosition.y;

    const sensitivity = 0.01;
    const rotationY = deltaX * sensitivity;
    const rotationX = -deltaY * sensitivity;

    // Apply rotation directly
    state.rotation.y += rotationY;
    state.rotation.x += rotationX;
    state.targetRotation.copy(state.rotation);

    // Clamp X rotation to prevent over-rotation
    state.rotation.x = THREE.MathUtils.clamp(state.rotation.x, -Math.PI / 2, Math.PI / 2);
    state.targetRotation.x = state.rotation.x;

    // Update last position
    state.lastPointerPosition = { x: clientX, y: clientY };
  }, []);

  // End rotation interaction
  const endRotation = useCallback(() => {
    const state = stateRef.current;
    state.isDragging = false;
    setIsInteracting(false);
  }, []);

  // Flip card 180 degrees on Y axis
  const flipCard = useCallback(() => {
    const state = stateRef.current;
    state.targetRotation.y += Math.PI;
    state.rotation.copy(state.targetRotation);
  }, []);

  // Reset to neutral position
  const resetRotation = useCallback(() => {
    const state = stateRef.current;
    state.targetRotation.set(0, 0, 0);
    state.rotation.copy(state.targetRotation);
  }, []);

  // Stop all motion immediately
  const stopMotion = useCallback(() => {
    const state = stateRef.current;
    state.targetRotation.copy(state.rotation);
  }, []);

  // Get current rotation for rendering
  const getCurrentRotation = useCallback(() => {
    return stateRef.current.rotation.clone();
  }, []);

  // Check if user is actively controlling
  const isUserControlled = useCallback(() => {
    return stateRef.current.isDragging;
  }, []);

  return {
    startRotation,
    updateRotation,
    endRotation,
    flipCard,
    resetRotation,
    stopMotion,
    getCurrentRotation,
    isUserControlled,
    isInteracting
  };
};
