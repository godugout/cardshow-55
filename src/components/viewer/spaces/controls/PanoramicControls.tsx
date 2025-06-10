
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface PanoramicControlsProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  dampingFactor?: number;
}

export const PanoramicControls: React.FC<PanoramicControlsProps> = ({
  autoRotate = false,
  autoRotateSpeed = 0.5,
  enableZoom = true,
  enablePan = false,
  minDistance = 2,
  maxDistance = 25,
  dampingFactor = 0.05
}) => {
  const controlsRef = useRef<any>();
  const { camera } = useThree();

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={enablePan}
      enableZoom={enableZoom}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      minDistance={minDistance}
      maxDistance={maxDistance}
      enableDamping={true}
      dampingFactor={dampingFactor}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      target={[0, 0, 0]}
      // Enhanced mouse sensitivity
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      // Smooth zoom limits
      minZoom={0.3}
      maxZoom={3.0}
    />
  );
};
