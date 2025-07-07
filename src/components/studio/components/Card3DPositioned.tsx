import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/types/card';

interface Card3DPositionedProps {
  card: CardData;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  isSelected: boolean;
  onClick: () => void;
  onPositionChange?: (position: THREE.Vector3) => void;
  enableDrag?: boolean;
}

// Standard trading card dimensions (scaled down for 3D scene)
const CARD_WIDTH = 2.5;
const CARD_HEIGHT = 3.5;
const CARD_DEPTH = 0.05;

export const Card3DPositioned: React.FC<Card3DPositionedProps> = ({
  card,
  position,
  rotation,
  scale,
  isSelected,
  onClick,
  onPositionChange,
  enableDrag = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { camera, raycaster, pointer } = useThree();

  // Get safe texture URL - avoid blob URLs for Three.js
  const getTextureUrl = useCallback(() => {
    if (!card.image_url) return '/placeholder-card.jpg';
    
    // If it's a blob URL, it might get invalidated - use thumbnail or fallback
    if (card.image_url.startsWith('blob:')) {
      console.warn('⚠️ Blob URL detected for 3D texture, using fallback:', card.title);
      return card.thumbnail_url || '/placeholder-card.jpg';
    }
    
    return card.image_url;
  }, [card]);

  // Load card texture with blob URL protection
  const texture = useTexture(getTextureUrl(), (texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
  });

  // Animation and effects
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    // Smooth position and rotation transitions
    groupRef.current.position.lerp(position, 0.1);
    groupRef.current.rotation.copy(rotation);
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

    // Hover effect - gentle floating
    if (hovered && !isDragging) {
      const floatY = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.position.y = position.y + floatY;
    }

    // Selected card special effects
    if (isSelected) {
      // Gentle glow effect through material emission
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissive) {
        const glowIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        material.emissiveIntensity = glowIntensity;
      }
    }
  });

  // Handle click events
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    onClick();
  }, [onClick]);

  // Handle drag events
  const handlePointerDown = useCallback((event: any) => {
    if (!enableDrag) return;
    event.stopPropagation();
    setIsDragging(true);
  }, [enableDrag]);

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (groupRef.current && onPositionChange) {
        onPositionChange(groupRef.current.position);
      }
    }
  }, [isDragging, onPositionChange]);

  // Create materials
  const frontMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: texture,
    roughness: isSelected ? 0.1 : 0.3,
    metalness: isSelected ? 0.2 : 0.1,
    emissive: isSelected ? new THREE.Color(0x004488) : new THREE.Color(0x000000),
    emissiveIntensity: isSelected ? 0.1 : 0
  }), [texture, isSelected]);

  const backMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.4,
    metalness: 0.1
  }), []);

  return (
    <group 
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main Card Mesh */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
        <meshStandardMaterial
          map={texture}
          roughness={isSelected ? 0.1 : 0.3}
          metalness={isSelected ? 0.2 : 0.1}
          emissive={isSelected ? new THREE.Color(0x004488) : new THREE.Color(0x000000)}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Selection Indicator */}
      {isSelected && (
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[CARD_WIDTH * 0.6, CARD_WIDTH * 0.65, 32]} />
          <meshBasicMaterial color={0x4488ff} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Card Info Overlay (when hovered and not dragging) */}
      {hovered && !isDragging && (
        <Html
          position={[0, CARD_HEIGHT * 0.6, 0]}
          center
          distanceFactor={8}
          occlude
        >
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {card.title}
          </div>
        </Html>
      )}
    </group>
  );
};

export default Card3DPositioned;