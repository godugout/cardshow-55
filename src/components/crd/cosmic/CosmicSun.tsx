import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicSunProps {
  scrollProgress: number;
}

export const CosmicSun: React.FC<CosmicSunProps> = ({ scrollProgress }) => {
  const sunRef = useRef<THREE.Mesh>(null);

  // Simple sun material
  const sunMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFA500',
      emissive: '#FF4500',
      emissiveIntensity: 1.2,
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);

  useFrame((state) => {
    if (sunRef.current) {
      // Only gentle rotation, position and scale are set once in the return statement
      sunRef.current.rotation.y += 0.005;
      sunRef.current.rotation.x += 0.002;
    }
  });

  // Sun starts in final resting position - no animation
  return (
    <mesh 
      ref={sunRef}
      position={[0, -6, -15]} // Positioned behind card and ring (further back on Z-axis)
      scale={[1.6, 1.6, 1.6]} // Final scale
    >
      <sphereGeometry args={[1, 32, 32]} />
      <primitive object={sunMaterial} />
    </mesh>
  );
};