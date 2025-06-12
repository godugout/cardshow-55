
import React, { useRef, useState, useCallback } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';

interface UnifiedCardProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  isHovering: boolean;
  showEffects: boolean;
  interactiveLighting: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  card,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  isHovering,
  showEffects,
  interactiveLighting,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  const groupRef = useRef<Group>(null);
  const frontRef = useRef<Mesh>(null);
  const backRef = useRef<Mesh>(null);
  const edgeRef = useRef<Mesh>(null);
  
  const [isFlipped, setIsFlipped] = useState(false);

  // Enhanced card dimensions for full screen viewing
  const cardWidth = 5.0;
  const cardHeight = 7.0;
  const cardThickness = 0.08;

  // Handle card flip
  const handleCardFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
    onClick();
  }, [onClick]);

  // Apply rotation and animations
  useFrame((state) => {
    if (groupRef.current) {
      // Apply manual rotation
      groupRef.current.rotation.x = (rotation.x * Math.PI) / 180 * 0.6;
      groupRef.current.rotation.y = (rotation.y * Math.PI) / 180 * 0.6;
      
      // Add card flip rotation
      if (isFlipped) {
        groupRef.current.rotation.y += Math.PI;
      }

      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = floatY;

      // Scale based on zoom with enhanced scaling for full screen
      const scaleFactor = Math.max(0.5, Math.min(2.0, zoom * 1.2));
      groupRef.current.scale.setScalar(scaleFactor);
    }
  });

  // Enhanced HTML dimensions for full screen
  const htmlWidth = 600;
  const htmlHeight = 840;

  return (
    <group 
      ref={groupRef}
      onPointerDown={onMouseDown}
      onPointerMove={onMouseMove}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
    >
      {/* Card Base Geometry - Provides physical presence */}
      <mesh ref={edgeRef} castShadow receiveShadow>
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Front Face Content */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, cardThickness / 2 + 0.001]}
        rotation={[0, 0, 0]}
        style={{
          width: `${htmlWidth}px`,
          height: `${htmlHeight}px`,
          pointerEvents: 'auto'
        }}
      >
        <div 
          style={{
            width: `${htmlWidth}px`,
            height: `${htmlHeight}px`,
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            transition: 'transform 0.6s ease'
          }}
        >
          <CardFrontContainer
            card={card}
            isFlipped={isFlipped}
            isHovering={isHovering}
            showEffects={showEffects}
            effectValues={effectValues}
            mousePosition={mousePosition}
            frameStyles={frameStyles}
            enhancedEffectStyles={enhancedEffectStyles}
            SurfaceTexture={SurfaceTexture}
            interactiveLighting={interactiveLighting}
            onClick={handleCardFlip}
          />
        </div>
      </Html>

      {/* Back Face Content */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, -cardThickness / 2 - 0.001]}
        rotation={[0, Math.PI, 0]}
        style={{
          width: `${htmlWidth}px`,
          height: `${htmlHeight}px`,
          pointerEvents: 'auto'
        }}
      >
        <div 
          style={{
            width: `${htmlWidth}px`,
            height: `${htmlHeight}px`,
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            transition: 'transform 0.6s ease'
          }}
        >
          <CardBackContainer
            isFlipped={isFlipped}
            isHovering={isHovering}
            showEffects={showEffects}
            effectValues={effectValues}
            mousePosition={mousePosition}
            frameStyles={frameStyles}
            enhancedEffectStyles={enhancedEffectStyles}
            SurfaceTexture={SurfaceTexture}
            interactiveLighting={interactiveLighting}
          />
        </div>
      </Html>

      {/* Invisible collision mesh for interactions */}
      <mesh 
        castShadow 
        receiveShadow
        onPointerEnter={onMouseEnter}
        onPointerLeave={onMouseLeave}
        onClick={handleCardFlip}
      >
        <boxGeometry args={[cardWidth + 0.2, cardHeight + 0.2, cardThickness + 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};
