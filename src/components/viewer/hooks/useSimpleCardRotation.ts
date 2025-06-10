
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

  // Start rotation interaction - handles Three.js events
  const startRotation = useCallback((event: any) => {
    const state = stateRef.current;
    
    // Extract pointer position from Three.js event
    const clientX = event.nativeEvent?.clientX || event.clientX || 0;
    const clientY = event.nativeEvent?.clientY || event.clientY || 0;

    state.isDragging = true;
    state.lastPointerPosition = { x: clientX, y: clientY };
    setIsInteracting(true);
    
    console.log('🎯 Started card drag rotation');
  }, []);

  // Update rotation during drag - ONLY when actively dragging
  const updateRotation = useCallback((event: any) => {
    const state = stateRef.current;
    
    // CRITICAL: Only rotate when actively dragging
    if (!state.isDragging) return;

    // Extract pointer position from Three.js event
    const clientX = event.nativeEvent?.clientX || event.clientX || 0;
    const clientY = event.nativeEvent?.clientY || event.clientY || 0;

    // Calculate delta movement and convert to rotation
    const deltaX = clientX - state.lastPointerPosition.x;
    const deltaY = clientY - state.lastPointerPosition.y;

    // Reduced sensitivity for more controlled movement
    const sensitivity = 0.005;
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
    
    console.log('🛑 Ended card drag rotation');
  }, []);

  // Flip card 180 degrees on Y axis
  const flipCard = useCallback(() => {
    const state = stateRef.current;
    state.targetRotation.y += Math.PI;
    state.rotation.copy(state.targetRotation);
    
    console.log('🔄 Flipped card');
  }, []);

  // Reset to neutral upright position
  const resetRotation = useCallback(() => {
    const state = stateRef.current;
    state.targetRotation.set(0, 0, 0);
    state.rotation.copy(state.targetRotation);
    state.isDragging = false;
    setIsInteracting(false);
    
    console.log('↺ Reset card to upright position');
  }, []);

  // Stop all motion immediately
  const stopMotion = useCallback(() => {
    const state = stateRef.current;
    state.targetRotation.copy(state.rotation);
    state.isDragging = false;
    setIsInteracting(false);
    
    console.log('⏹️ Stopped card motion');
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
