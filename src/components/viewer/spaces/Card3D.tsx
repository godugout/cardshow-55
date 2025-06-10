
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/types/card';
import type { SpaceControls } from './types';

interface Card3DProps {
  card: CardData;
  controls: SpaceControls;
}

export const Card3D: React.FC<Card3DProps> = ({ card, controls }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Safe texture loading with fallback
  const textureUrl = card?.image_url || '/placeholder-card.jpg';
  const texture = useTexture(textureUrl, (error) => {
    console.warn('Texture loading error:', error);
  });
  
  // Apply controls to card animation with safety checks
  useFrame((state) => {
    if (!meshRef.current || !controls) return;
    
    try {
      const time = state.clock.elapsedTime;
      
      // Auto rotation with safe defaults
      if (controls.autoRotate) {
        const speed = controls.orbitSpeed || 1;
        meshRef.current.rotation.y += speed * 0.01;
      }
      
      // Float effect with safe defaults
      const floatIntensity = controls.floatIntensity || 0;
      if (floatIntensity > 0) {
        meshRef.current.position.y = Math.sin(time * 0.5) * floatIntensity * 0.1;
      }
      
      // Gravity effect with safe defaults
      const gravityEffect = controls.gravityEffect || 0;
      if (gravityEffect > 0) {
        meshRef.current.rotation.x = Math.sin(time * 0.3) * gravityEffect * 0.05;
      }
    } catch (error) {
      console.warn('Card3D animation error:', error);
    }
  });

  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0]}>
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
