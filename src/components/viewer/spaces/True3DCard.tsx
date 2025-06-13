import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { textureManager } from './utils/TextureManager';
import type { Mesh } from 'three';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
  description?: string;
  rarity?: string;
}

interface True3DCardProps {
  card: Simple3DCard;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  autoRotate?: boolean;
  floatIntensity?: number;
}

export const True3DCard: React.FC<True3DCardProps> = ({
  card,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  onHover,
  autoRotate = false,
  floatIntensity = 0.1
}) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Card dimensions (trading card proportions with actual thickness)
  const cardWidth = 2.5 * scale;
  const cardHeight = 3.5 * scale;
  const cardDepth = 0.15 * scale; // Increased thickness for better 3D volume

  // Load textures with error handling
  useEffect(() => {
    const loadTextures = async () => {
      try {
        // Load front texture (card image)
        const front = card.image_url 
          ? await textureManager.loadTexture(card.image_url)
          : textureManager.createFallbackTexture(0x4444ff);
        setFrontTexture(front);

        // Load back texture (CRD logo)
        const back = await textureManager.loadTexture('/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png')
          .catch(() => textureManager.createFallbackTexture(0x222222));
        setBackTexture(back);
      } catch (error) {
        console.error('Error loading card textures:', error);
        setFrontTexture(textureManager.createFallbackTexture(0x4444ff));
        setBackTexture(textureManager.createFallbackTexture(0x222222));
      }
    };

    loadTextures();
  }, [card.image_url]);

  // Create materials for each face
  const materials = useMemo(() => {
    if (!frontTexture || !backTexture) {
      return Array(6).fill(new THREE.MeshStandardMaterial({ color: 0x666666 }));
    }

    // Enhanced edge material with metallic properties
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.1,
      side: THREE.DoubleSide,
      envMapIntensity: 1.0
    });

    // Front material with enhanced properties
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      side: THREE.DoubleSide,
      transparent: false,
      roughness: 0.3,
      metalness: 0.1
    });

    // Back material with dark background
    const backgroundCanvas = document.createElement('canvas');
    backgroundCanvas.width = 512;
    backgroundCanvas.height = 512;
    const ctx = backgroundCanvas.getContext('2d')!;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw logo in center
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const logoSize = 200;
      const x = (512 - logoSize) / 2;
      const y = (512 - logoSize) / 2;
      ctx.drawImage(img, x, y, logoSize, logoSize);
    };
    img.src = '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';

    const backMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(backgroundCanvas),
      side: THREE.DoubleSide,
      transparent: false,
      roughness: 0.4,
      metalness: 0.2
    });

    // Array of materials for BoxGeometry faces: [+X, -X, +Y, -Y, +Z, -Z]
    return [
      edgeMaterial, // Right edge (+X)
      edgeMaterial, // Left edge (-X)  
      edgeMaterial, // Top edge (+Y)
      edgeMaterial, // Bottom edge (-Y)
      frontMaterial, // Front face (+Z)
      backMaterial  // Back face (-Z)
    ];
  }, [frontTexture, backTexture]);

  // Enhanced animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      if (floatIntensity > 0) {
        const floatY = Math.sin(state.clock.elapsedTime * 0.8) * floatIntensity;
        groupRef.current.position.y = position[1] + floatY;
      }

      // Auto rotation
      if (autoRotate && meshRef.current) {
        meshRef.current.rotation.y += 0.005;
      }

      // Hover effects
      if (isHovered && meshRef.current) {
        const hoverScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
        meshRef.current.scale.setScalar(hoverScale);
      }
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log('🎯 True3DCard clicked:', card.title);
    onClick?.();
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    onHover?.(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'default';
  };

  if (!frontTexture || !backTexture) {
    return null; // Loading
  }

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
    >
      {/* Main card mesh with TRUE 3D geometry and volume */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
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

      {/* Card title text floating above */}
      <Text
        position={[0, cardHeight/2 + 0.3, cardDepth/2 + 0.01]}
        fontSize={0.2}
        color="white"
        anchorY="bottom"
        anchorX="center"
        maxWidth={cardWidth * 0.9}
        textAlign="center"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {card.title}
      </Text>

      {/* Card rarity indicator with enhanced styling */}
      {card.rarity && (
        <Text
          position={[0, -cardHeight/2 - 0.2, cardDepth/2 + 0.01]}
          fontSize={0.15}
          color="#ffd700"
          anchorY="top"
          anchorX="center"
          textAlign="center"
          outlineWidth={0.01}
          outlineColor="black"
        >
          ★ {card.rarity.toUpperCase()} ★
        </Text>
      )}
    </group>
  );
};
