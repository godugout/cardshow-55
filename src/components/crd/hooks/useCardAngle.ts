import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useCardAngle = () => {
  const [cardAngle, setCardAngle] = useState(0);
  const cardRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);

  const updateCardAngle = () => {
    if (controlsRef.current) {
      // Get the polar angle from orbit controls (vertical rotation)
      const polarAngle = controlsRef.current.getPolarAngle();
      
      // Convert to forward lean angle (0° = upright, 90° = fully forward)
      // Polar angle: π/2 = upright, 0 = looking down (forward lean)
      const forwardLean = Math.abs((Math.PI / 2) - polarAngle) * (180 / Math.PI);
      
      setCardAngle(Math.max(0, Math.min(90, forwardLean)));
    }
  };

  const resetCardAngle = () => {
    if (controlsRef.current) {
      // Reset to upright position
      controlsRef.current.reset();
      setCardAngle(0);
    }
  };

  useEffect(() => {
    const interval = setInterval(updateCardAngle, 100);
    return () => clearInterval(interval);
  }, []);

  return {
    cardAngle,
    cardRef,
    controlsRef,
    resetCardAngle,
    updateCardAngle
  };
};