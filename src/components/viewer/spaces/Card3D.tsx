
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { useCardFaceMaterials } from './materials/CardFaceMaterials';
import type { SpaceControls } from './types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface Card3DProps {
  card: Simple3DCard;
  controls: SpaceControls;
  effectValues?: EffectValues;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  interactiveLighting?: boolean;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({ 
  card, 
  controls, 
  effectValues = {},
  interactiveLighting = false,
  onClick 
}) => {
  const groupRef = useRef<Group>(null);
  const cardMeshRef = useRef<Mesh>(null);
  
  // State for 3D card interaction
  const [isHovering, setIsHovering] = React.useState(false);

  // Use the hook to get materials
  const materials = useCardFaceMaterials(card, effectValues, isHovering, interactiveLighting);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      groupRef.current.position.y = floatY;

      // Auto rotation
      if (controls.autoRotate) {
        groupRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        groupRef.current.position.y += gravity;
      }
    }

    // Add subtle effect-based pulsing
    if (cardMeshRef.current && effectValues && Object.keys(effectValues).length > 0) {
      const pulseIntensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      cardMeshRef.current.scale.setScalar(pulseIntensity * 0.015 + 0.985);
    }
  });

  const handleCardClick = () => {
    onClick?.();
  };

  const handlePointerEnter = () => setIsHovering(true);
  const handlePointerLeave = () => setIsHovering(false);

  // Card dimensions - Thick for visible edges
  const cardWidth = 4;
  const cardHeight = 5.6;
  const cardDepth = 0.2; // Thick enough for visible edges

  return (
    <group ref={groupRef}>
      {/* 3D Card with Box Geometry and Multi-Material Setup */}
      <mesh 
        ref={cardMeshRef}
        castShadow 
        receiveShadow
        material={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleCardClick}
      >
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      </mesh>
      
      {/* Enhanced lighting for edge visibility and effects */}
      {isHovering && (
        <>
          <pointLight
            position={[3, 0, 2]}
            intensity={2.0}
            color={0x4a90e2}
            distance={15}
            decay={2}
          />
          <pointLight
            position={[-3, 0, 2]}
            intensity={2.0}
            color={0x4a90e2}
            distance={15}
            decay={2}
          />
          <pointLight
            position={[0, 3, 1]}
            intensity={1.5}
            color={0x4a90e2}
            distance={12}
            decay={2}
          />
          <pointLight
            position={[0, -3, 1]}
            intensity={1.5}
            color={0x4a90e2}
            distance={12}
            decay={2}
          />
        </>
      )}
      
      {/* Ambient enhancement for card effects */}
      {Object.keys(effectValues).length > 0 && (
        <pointLight
          position={[0, 0, 3]}
          intensity={0.8}
          color={0xffffff}
          distance={8}
          decay={1}
        />
      )}
    </group>
  );
};
