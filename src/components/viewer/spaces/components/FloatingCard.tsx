import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimpleCardRotation } from '../../hooks/useSimpleCardRotation';

interface FloatingCardProps {
  card: any;
  onClick?: () => void;
  onRotationRef?: (rotation: any) => void;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  card,
  onClick,
  onRotationRef
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [textureError, setTextureError] = useState(false);
  
  // Card dimensions (standard trading card ratio)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;

  // Initialize simple rotation system
  const rotation = useSimpleCardRotation();

  // Expose rotation controls to parent
  useEffect(() => {
    if (onRotationRef) {
      onRotationRef(rotation);
    }
  }, [rotation, onRotationRef]);

  console.log('🃏 FloatingCard with simple rotation:', { 
    isInteracting: rotation.isInteracting 
  });

  // Load texture safely
  useEffect(() => {
    let isMounted = true;
    const imageUrl = card?.image_url || '/placeholder-card.jpg';
    
    if (!imageUrl) {
      setTextureError(true);
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(
      imageUrl,
      (loadedTexture) => {
        if (isMounted) {
          console.log('✅ FloatingCard texture loaded successfully');
          setTexture(loadedTexture);
          setTextureError(false);
        }
      },
      undefined,
      (error) => {
        if (isMounted) {
          console.warn('❌ FloatingCard texture failed to load:', error);
          setTextureError(true);
          setTexture(null);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [card?.image_url]);

  // Memoize material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      color: textureError ? '#666666' : '#ffffff',
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
  }, [texture, textureError]);

  // Handle double-click for flip
  const handleDoubleClick = (event: any) => {
    event.stopPropagation();
    rotation.flipCard();
    if (onClick) {
      onClick();
    }
  };

  useFrame(() => {
    if (meshRef.current) {
      // Apply current rotation directly
      meshRef.current.rotation.copy(rotation.getCurrentRotation());
      
      // Keep card perfectly centered at origin
      meshRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      castShadow 
      receiveShadow 
      position={[0, 0, 0]}
      onPointerDown={rotation.startRotation}
      onPointerMove={rotation.updateRotation}
      onPointerUp={rotation.endRotation}
      onDoubleClick={handleDoubleClick}
    >
      <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      <primitive object={material} />
    </mesh>
  );
};
