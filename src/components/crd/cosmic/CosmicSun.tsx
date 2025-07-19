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
      const time = state.clock.elapsedTime;
      
      // Sun stays in final position (no animation based on scroll progress)
      const sunY = -6; // Final position from previous animation
      const sunZ = -3; // Final Z position
      
      sunRef.current.position.set(0, sunY, sunZ);
      
      // Simple rotation
      sunRef.current.rotation.y += 0.005;
      sunRef.current.rotation.x += 0.002;
      
      // Final scale (no animation)
      const scale = 1.6; // Final scale from previous animation
      sunRef.current.scale.setScalar(scale);
    }
  });

  // Sun is always visible now (no scroll dependency)
  return (

    <mesh ref={sunRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <primitive object={sunMaterial} />
    </mesh>
  );
};