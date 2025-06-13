
import React, { useRef, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { Mesh } from 'three';
import { createCardMaterials } from '../utils/cardMaterials';

interface CardMeshProps {
  frontTexture: THREE.Texture;
  backTexture: THREE.Texture;
  cardWidth: number;
  cardHeight: number;
  cardDepth: number;
  isHovered: boolean;
  autoRotate: boolean;
  onClick?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

export const CardMesh: React.FC<CardMeshProps> = ({
  frontTexture,
  backTexture,
  cardWidth,
  cardHeight,
  cardDepth,
  isHovered,
  autoRotate,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const meshRef = useRef<Mesh>(null);

  const materials = useMemo(() => {
    return createCardMaterials(frontTexture, backTexture);
  }, [frontTexture, backTexture]);

  useFrame((state) => {
    if (meshRef.current) {
      // Auto rotation
      if (autoRotate) {
        meshRef.current.rotation.y += 0.005;
      }

      // Hover effects
      if (isHovered) {
        const hoverScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
        meshRef.current.scale.setScalar(hoverScale);
      }
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick?.();
  };

  return (
    <>
      {/* Main card mesh with TRUE 3D geometry and volume */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <boxGeometry args={[cardWidth, cardHeight, cardDepth, 1, 1, 1]} />
        {materials.map((material, index) => (
          <primitive key={index} object={material} attach={`material-${index}`} />
        ))}
      </mesh>

      {/* Enhanced glow effect when hovered */}
      {isHovered && (
        <mesh position={[0, 0, 0]} scale={[1.05, 1.05, 1.05]}>
          <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
          <meshBasicMaterial 
            color={0x4444ff} 
            transparent 
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </>
  );
};
