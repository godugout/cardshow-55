
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingCardProps {
  card: any;
  floatIntensity?: number;
  autoRotate?: boolean;
  gravityEffect?: number;
  onClick?: () => void;
  environmentControls?: {
    depthOfField: number;
    parallaxIntensity: number;
    fieldOfView: number;
    atmosphericDensity: number;
  };
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  card,
  floatIntensity = 1.0,
  autoRotate = false,
  gravityEffect = 0.0,
  onClick,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  }
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(card.image_url || '/placeholder-card.jpg');
  
  // Card dimensions (standard trading card ratio)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;
  
  console.log('🃏 FloatingCard physics:', { floatIntensity, autoRotate, gravityEffect });

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Enhanced floating animation with intensity control
      if (floatIntensity > 0) {
        const floatY = Math.sin(time * 0.8) * (0.2 * floatIntensity);
        const floatX = Math.cos(time * 0.5) * (0.1 * floatIntensity);
        meshRef.current.position.y = floatY;
        meshRef.current.position.x = floatX;
      }
      
      // Enhanced gravity effect
      if (gravityEffect > 0) {
        const gravityOffset = -gravityEffect * 0.5;
        meshRef.current.position.y += gravityOffset;
        
        // Add slight sway for gravity effect
        const sway = Math.sin(time * 0.3) * (gravityEffect * 0.1);
        meshRef.current.rotation.z = sway;
      }
      
      // Enhanced auto-rotation with physics
      if (autoRotate) {
        meshRef.current.rotation.y += 0.005;
        
        // Add subtle wobble for more natural rotation
        const wobble = Math.sin(time * 2) * 0.02;
        meshRef.current.rotation.x = wobble;
      }
      
      // Parallax effect based on environment controls
      if (environmentControls.parallaxIntensity > 0) {
        const parallaxX = Math.sin(time * 0.2) * (environmentControls.parallaxIntensity * 0.1);
        const parallaxZ = Math.cos(time * 0.15) * (environmentControls.parallaxIntensity * 0.05);
        meshRef.current.position.x += parallaxX;
        meshRef.current.position.z += parallaxZ;
      }
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      castShadow 
      receiveShadow 
      onClick={onClick}
      position={[0, 0, 0]}
    >
      <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.3}
        metalness={0.1}
        transparent={true}
        opacity={0.9 + (environmentControls.atmosphericDensity * 0.1)}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
