
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import type { CardData } from '@/hooks/useCardEditor';
import type { SpaceControls } from './types';

interface Card3DProps {
  card: CardData;
  controls: SpaceControls;
}

export const Card3D: React.FC<Card3DProps> = ({ card, controls }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load card image as texture
  const texture = useLoader(TextureLoader, card.image_url || '/placeholder-card.jpg');
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation based on controls
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      meshRef.current.position.y = floatY;

      // Auto rotation based on controls
      if (controls.autoRotate) {
        meshRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        meshRef.current.position.y += gravity;
      }

      // Subtle tilt based on orbit
      const tiltX = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      const tiltZ = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
      meshRef.current.rotation.x = tiltX;
      meshRef.current.rotation.z = tiltZ;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[2.5, 3.5]} />
      <meshStandardMaterial 
        map={texture} 
        transparent 
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
};
