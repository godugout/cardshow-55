
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import type { Card } from '@/types/card';
import type { QualitySettings } from './hooks/usePerformanceMonitor';

interface Card3DProps {
  card: Card;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isSelected?: boolean;
  isHovered?: boolean;
  qualitySettings: QualitySettings;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  card,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isSelected = false,
  isHovered = false,
  qualitySettings,
  onClick,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Load card texture with appropriate quality
  const textureUrl = qualitySettings.textureQuality === 'high' 
    ? card.image_url 
    : card.thumbnail_url || card.image_url;
    
  const texture = useLoader(TextureLoader, textureUrl || '/api/placeholder/300/400');

  // Configure texture based on quality settings
  useMemo(() => {
    if (texture) {
      texture.minFilter = qualitySettings.textureQuality === 'high' 
        ? THREE.LinearMipmapLinearFilter 
        : THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = qualitySettings.textureQuality !== 'low';
    }
  }, [texture, qualitySettings.textureQuality]);

  // Standard trading card dimensions (2.5" x 3.5" ratio)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;

  // Spring animation for interactions
  const { animatedScale, rotationY } = useSpring({
    animatedScale: isSelected ? scale * 1.1 : isHovered ? scale * 1.05 : scale,
    rotationY: isSelected ? rotation[1] + 0.1 : rotation[1],
    config: { tension: 300, friction: 30 }
  });

  // Idle animation
  useFrame((state) => {
    if (meshRef.current && !isSelected && !isHovered) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      
      // Very subtle rotation
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
    }
  });

  // Material based on quality settings and card rarity
  const material = useMemo(() => {
    const baseProps = {
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    };

    if (!qualitySettings.enableEffects) {
      return new THREE.MeshBasicMaterial(baseProps);
    }

    // Enhanced material for higher quality
    const materialProps = {
      ...baseProps,
      roughness: card.rarity === 'legendary' ? 0.1 : 0.3,
      metalness: card.rarity === 'legendary' ? 0.8 : 0.1,
      emissive: card.rarity === 'legendary' ? new THREE.Color(0x004444) : new THREE.Color(0x000000),
      emissiveIntensity: isHovered ? 0.3 : 0.1,
    };

    return new THREE.MeshStandardMaterial(materialProps);
  }, [texture, qualitySettings.enableEffects, card.rarity, isHovered]);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation-y={rotationY}
      scale={animatedScale}
      onClick={onClick}
      onPointerOver={() => onHover?.(true)}
      onPointerOut={() => onHover?.(false)}
    >
      <mesh
        ref={meshRef}
        material={material}
        castShadow={qualitySettings.shadowQuality !== 'off'}
        receiveShadow={qualitySettings.shadowQuality !== 'off'}
      >
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      </mesh>
      
      {/* Card glow effect for special rarities */}
      {qualitySettings.enableEffects && (card.rarity === 'legendary' || card.rarity === 'mythic') && (
        <mesh position={[0, 0, -0.001]} scale={[1.05, 1.05, 1]}>
          <planeGeometry args={[cardWidth, cardHeight]} />
          <meshBasicMaterial
            color={card.rarity === 'legendary' ? 0xffd700 : 0xff4444}
            transparent
            opacity={isHovered ? 0.3 : 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </animated.group>
  );
};
