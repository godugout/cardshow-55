
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/hooks/useCardEditor';
import type { SpaceControls } from './types';

interface Card3DProps {
  card: CardData;
  controls: SpaceControls;
}

export const Card3D: React.FC<Card3DProps> = ({ card, controls }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load card texture
  const texture = useTexture(card.imageUrl || '/placeholder-card.jpg');
  
  // Apply controls to card animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Auto rotation
    if (controls.autoRotate) {
      meshRef.current.rotation.y += controls.orbitSpeed * 0.01;
    }
    
    // Float effect
    if (controls.floatIntensity > 0) {
      meshRef.current.position.y = Math.sin(time * 0.5) * controls.floatIntensity * 0.1;
    }
    
    // Gravity effect
    if (controls.gravityEffect > 0) {
      meshRef.current.rotation.x = Math.sin(time * 0.3) * controls.gravityEffect * 0.05;
    }
  });

  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.3}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
