import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicSunProps {
  scrollProgress: number;
}

export const CosmicSun: React.FC<CosmicSunProps> = ({ scrollProgress }) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);

  // Sun material with emissive properties
  const sunMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ff8800',
      emissive: '#ff4400',
      emissiveIntensity: 2,
      roughness: 0.8,
      metalness: 0.1,
    });
  }, []);

  // Corona glow material
  const coronaMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#ffaa44',
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
  }, []);

  // Solar ray materials
  const rayMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#ffdd88',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (sunRef.current && coronaRef.current && raysRef.current) {
      const time = state.clock.elapsedTime;
      
      // Animate sun position based on scroll progress
      // Start from top (y=8) and move behind card (y=-1.5)
      const sunY = THREE.MathUtils.lerp(8, -1.5, scrollProgress * 0.8);
      const sunZ = THREE.MathUtils.lerp(-5, -8, scrollProgress * 0.6);
      
      sunRef.current.position.set(0, sunY, sunZ);
      coronaRef.current.position.copy(sunRef.current.position);
      raysRef.current.position.copy(sunRef.current.position);
      
      // Animate emissive intensity
      const intensity = THREE.MathUtils.lerp(1, 4, scrollProgress);
      sunMaterial.emissiveIntensity = intensity;
      
      // Pulsating glow when near final position
      if (scrollProgress > 0.8) {
        const pulse = Math.sin(time * 2) * 0.5 + 1;
        sunMaterial.emissiveIntensity = intensity * pulse;
        coronaMaterial.opacity = 0.3 + Math.sin(time * 3) * 0.2;
      }
      
      // Rotate corona and rays
      coronaRef.current.rotation.z += 0.005;
      raysRef.current.rotation.z -= 0.003;
      
      // Scale based on proximity
      const scale = THREE.MathUtils.lerp(0.5, 2, scrollProgress);
      sunRef.current.scale.setScalar(scale);
      coronaRef.current.scale.setScalar(scale * 1.5);
      raysRef.current.scale.setScalar(scale * 2);
    }
  });

  const visible = scrollProgress > 0.3;
  if (!visible) return null;

  return (
    <group>
      {/* Main Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={sunMaterial} />
      </mesh>
      
      {/* Corona Glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <primitive object={coronaMaterial} />
      </mesh>
      
      {/* Solar Rays */}
      <group ref={raysRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i * Math.PI * 2) / 12]}
            position={[0, 0, 0]}
          >
            <planeGeometry args={[0.1, 4]} />
            <primitive object={rayMaterial} />
          </mesh>
        ))}
      </group>
    </group>
  );
};