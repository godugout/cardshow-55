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
      
      // Simple linear movement from top to behind monolith
      const sunY = THREE.MathUtils.lerp(8, -6, scrollProgress); // Goes much lower
      const sunZ = THREE.MathUtils.lerp(-5, -3, scrollProgress); // Stays in front of card
      
      sunRef.current.position.set(0, sunY, sunZ);
      
      // Simple rotation
      sunRef.current.rotation.y += 0.005;
      sunRef.current.rotation.x += 0.002;
      
      // Linear scaling - starts smaller, grows to current size
      const scale = THREE.MathUtils.lerp(0.5, 1.6, scrollProgress);
      sunRef.current.scale.setScalar(scale);
    }
  });

  const visible = scrollProgress > 0.3;
  if (!visible) return null;

  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <primitive object={sunMaterial} />
    </mesh>
  );
};