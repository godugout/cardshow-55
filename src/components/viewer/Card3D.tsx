
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/hooks/useCardEditor';

interface Card3DProps {
  card: CardData;
  isFlipped: boolean;
  isHovered: boolean;
  onFlip: () => void;
  performanceMode?: 'high' | 'medium' | 'low';
}

export const Card3D: React.FC<Card3DProps> = ({
  card,
  isFlipped,
  isHovered,
  onFlip,
  performanceMode = 'high'
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Standard card dimensions (2.5" x 3.5" ratio)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;

  // Load textures with error handling
  const texture = useTexture(
    card.image_url || '/placeholder-card.jpg',
    (texture) => {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    }
  );

  // Rarity-based material system
  const material = useMemo(() => {
    const baseMaterial = {
      map: texture,
      side: THREE.DoubleSide,
    };

    switch (card.rarity) {
      case 'common':
        return new THREE.MeshStandardMaterial({
          ...baseMaterial,
          roughness: 0.8,
          metalness: 0.1,
        });
      
      case 'uncommon':
        return new THREE.MeshStandardMaterial({
          ...baseMaterial,
          roughness: 0.6,
          metalness: 0.3,
        });
      
      case 'rare':
        return new THREE.MeshStandardMaterial({
          ...baseMaterial,
          roughness: 0.2,
          metalness: 0.8,
          envMapIntensity: 1.5,
        });
      
      case 'epic':
        return new THREE.MeshStandardMaterial({
          ...baseMaterial,
          roughness: 0.1,
          metalness: 0.9,
          envMapIntensity: 2.0,
        });
      
      case 'legendary':
        return new THREE.MeshStandardMaterial({
          ...baseMaterial,
          roughness: 0.05,
          metalness: 1.0,
          emissive: new THREE.Color(0x001122),
          emissiveIntensity: 0.3,
          envMapIntensity: 3.0,
        });
      
      case 'mythic':
        return new THREE.MeshStandardMaterial({
          ...baseMaterial,
          roughness: 0.0,
          metalness: 1.0,
          emissive: new THREE.Color(0x440088),
          emissiveIntensity: 0.5,
          envMapIntensity: 4.0,
        });
      
      default:
        return new THREE.MeshStandardMaterial(baseMaterial);
    }
  }, [texture, card.rarity]);

  // Back side material
  const backMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.3,
      metalness: 0.7,
      side: THREE.DoubleSide,
    });
  }, []);

  // Animation frame updates
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Hover animations
    if (isHovered) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.05 + 0.1;
      
      // Legendary rarity special effects
      if (card.rarity === 'legendary' || card.rarity === 'mythic') {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.2;
      }
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0,
        0.1
      );
    }

    // Flip animation
    const targetRotation = isFlipped ? Math.PI : 0;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      0.1
    );

    // Performance-based quality adjustments
    if (performanceMode === 'low') {
      // Reduce animation frequency for low-end devices
      if (Math.floor(time * 30) % 2 === 0) return;
    }
  });

  // Click handler for flipping - fixed the event type
  const handleClick = (event: any) => {
    event.stopPropagation();
    onFlip();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      material.dispose();
      backMaterial.dispose();
      texture.dispose();
    };
  }, [material, backMaterial, texture]);

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Card Front */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        position={[0, 0, 0.01]}
      >
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <primitive object={material} />
      </mesh>

      {/* Card Back */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0, -0.01]}
        rotation={[0, Math.PI, 0]}
      >
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <primitive object={backMaterial} />
      </mesh>

      {/* Holographic effect for rare+ cards */}
      {(card.rarity === 'rare' || card.rarity === 'epic' || card.rarity === 'legendary' || card.rarity === 'mythic') && (
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[cardWidth + 0.1, cardHeight + 0.1]} />
          <meshBasicMaterial
            transparent
            opacity={0.3}
            color={card.rarity === 'legendary' ? 0xffd700 : card.rarity === 'mythic' ? 0xff00ff : 0x00ffff}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Card title text for high performance mode */}
      {performanceMode === 'high' && (
        <Text
          position={[0, cardHeight/3, 0.03]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={cardWidth * 0.8}
        >
          {card.title}
        </Text>
      )}
    </group>
  );
};
