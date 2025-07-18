import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicSunProps {
  scrollProgress: number;
}

export const CosmicSun: React.FC<CosmicSunProps> = ({ scrollProgress }) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const fireRingRef = useRef<THREE.Mesh>(null);

  // Realistic sun material with fiery surface
  const sunMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFA500',
      emissive: '#FF4500',
      emissiveIntensity: 1.5,
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);

  // Fiery edge ring material - subtle animated fire effect
  const fireRingMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#FF6B35',
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (sunRef.current && fireRingRef.current) {
      const time = state.clock.elapsedTime;
      
      // Animate sun position based on scroll progress
      // Start from top (y=8) and move behind card (y=-1.5)
      const sunY = THREE.MathUtils.lerp(8, -1.5, scrollProgress * 0.8);
      const sunZ = THREE.MathUtils.lerp(-5, -8, scrollProgress * 0.6);
      
      sunRef.current.position.set(0, sunY, sunZ);
      fireRingRef.current.position.copy(sunRef.current.position);
      
      // Animate emissive intensity based on scroll progress
      const baseIntensity = THREE.MathUtils.lerp(0.8, 2.5, scrollProgress);
      
      // Add subtle pulsating when near final position
      if (scrollProgress > 0.8) {
        const pulse = Math.sin(time * 1.5) * 0.3 + 1;
        sunMaterial.emissiveIntensity = baseIntensity * pulse;
        
        // Animate fire ring for more realistic fiery edge
        const fireFlicker = Math.sin(time * 4) * 0.2 + Math.sin(time * 7) * 0.1;
        fireRingMaterial.opacity = 0.7 + fireFlicker;
      } else {
        sunMaterial.emissiveIntensity = baseIntensity;
      }
      
      // Subtle rotation for surface texture variation
      sunRef.current.rotation.y += 0.002;
      
      // Fire ring undulation effect
      fireRingRef.current.rotation.z += 0.01;
      const fireScale = 1.05 + Math.sin(time * 3) * 0.02;
      fireRingRef.current.scale.setScalar(fireScale);
      
      // Scale based on proximity
      const scale = THREE.MathUtils.lerp(0.8, 2.2, scrollProgress);
      sunRef.current.scale.setScalar(scale);
    }
  });

  const visible = scrollProgress > 0.3;
  if (!visible) return null;

  return (
    <group>
      {/* Main Sun Body */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={sunMaterial} />
      </mesh>
      
      {/* Subtle Fiery Edge Ring */}
      <mesh ref={fireRingRef}>
        <torusGeometry args={[1.02, 0.05, 16, 64]} />
        <primitive object={fireRingMaterial} />
      </mesh>
    </group>
  );
};