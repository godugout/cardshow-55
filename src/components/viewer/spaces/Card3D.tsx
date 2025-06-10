
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Mesh, PlaneGeometry, MeshStandardMaterial } from 'three';
import type { CardData } from '@/types/card';
import type { SpaceControls } from './types';

interface Card3DProps {
  card: CardData;
  controls: SpaceControls;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({ card, controls, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Load card image as texture
  const texture = useLoader(TextureLoader, card.image_url || '/placeholder-card.jpg');
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      meshRef.current.position.y = floatY;

      // Auto rotation
      if (controls.autoRotate) {
        meshRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        meshRef.current.position.y += gravity;
      }
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      castShadow 
      receiveShadow
      onClick={onClick}
    >
      <planeGeometry args={[2.5, 3.5]} />
      <meshStandardMaterial 
        map={texture} 
        transparent 
        side={2} // DoubleSide
      />
    </mesh>
  );
};
