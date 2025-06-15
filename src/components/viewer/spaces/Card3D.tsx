
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group, Mesh } from 'three';
import { EnhancedCardContainer } from '../components/EnhancedCardContainer';
import { useCardEffects } from '../hooks/useCardEffects';
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

// Helper function to convert simple card to full CardData format
const adaptCardForViewer = (card: Simple3DCard) => ({
  id: card.id,
  title: card.title,
  description: '',
  rarity: 'common' as const,
  tags: [],
  image_url: card.image_url || '/placeholder-card.jpg',
  design_metadata: {},
  visibility: 'public' as const,
  creator_attribution: {
    creator_name: 'Unknown',
    collaboration_type: 'solo' as const
  },
  publishing_options: {
    marketplace_listing: false,
    crd_catalog_inclusion: false,
    print_available: false,
    pricing: { currency: 'USD' },
    distribution: { limited_edition: false }
  }
});

export const Card3D: React.FC<Card3DProps> = ({ 
  card, 
  controls, 
  effectValues = {},
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = [100],
  interactiveLighting = false,
  onClick 
}) => {
  const groupRef = useRef<Group>(null);
  const cardMeshRef = useRef<Mesh>(null);
  
  // Simple state for 3D card interaction
  const [isHovering, setIsHovering] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const zoom = 1;
  const isDragging = false;

  // Convert simple card to full CardData format for useCardEffects
  const adaptedCard = React.useMemo(() => adaptCardForViewer(card), [card]);

  // Use the hook to get materials
  const materials = useCardFaceMaterials(card, effectValues, isHovering, interactiveLighting);

  // Use card effects if we have the required props
  const cardEffects = (selectedScene && selectedLighting && materialSettings) ? useCardEffects({
    card: adaptedCard,
    effectValues,
    mousePosition,
    showEffects: true,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering
  }) : null;

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

    // Add subtle edge glow pulsing
    if (cardMeshRef.current && effectValues && Object.keys(effectValues).length > 0) {
      const pulseIntensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      cardMeshRef.current.scale.setScalar(pulseIntensity * 0.02 + 0.98);
    }
  });

  const handleCardClick = () => {
    onClick?.();
  };

  const handlePointerEnter = () => setIsHovering(true);
  const handlePointerLeave = () => setIsHovering(false);
  const handleMouseDown = () => {};
  const handleMouseMove = () => {};

  // Card dimensions - Much thicker for visible edges (0.2 units = about 20 "pixels")
  const cardWidth = 4;
  const cardHeight = 5.6;
  const cardDepth = 0.2; // Increased from 0.04 to 0.2 for visible thickness

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
      
      {/* Enhanced lighting for edge visibility */}
      {isHovering && (
        <>
          <pointLight
            position={[3, 0, 2]}
            intensity={1.5}
            color={0x4a90e2}
            distance={12}
            decay={2}
          />
          <pointLight
            position={[-3, 0, 2]}
            intensity={1.5}
            color={0x4a90e2}
            distance={12}
            decay={2}
          />
          <pointLight
            position={[0, 3, 1]}
            intensity={1.2}
            color={0x4a90e2}
            distance={10}
            decay={2}
          />
          <pointLight
            position={[0, -3, 1]}
            intensity={1.2}
            color={0x4a90e2}
            distance={10}
            decay={2}
          />
        </>
      )}
      
      {/* HTML overlay for the enhanced card - Positioned further out for proper layering */}
      <Html
        transform
        occlude
        position={[0, 0, cardDepth + 0.02]}
        distanceFactor={0.625}
        style={{
          width: '400px',
          height: '560px',
          pointerEvents: 'none'
        }}
      >
        <div style={{ width: '400px', height: '560px' }}>
          <EnhancedCardContainer
            card={adaptedCard}
            isHovering={isHovering}
            showEffects={true}
            effectValues={effectValues}
            mousePosition={mousePosition}
            rotation={rotation}
            zoom={zoom}
            isDragging={isDragging}
            frameStyles={cardEffects?.getFrameStyles() || { transition: 'all 0.3s ease' }}
            enhancedEffectStyles={cardEffects?.getEnhancedEffectStyles() || {}}
            SurfaceTexture={cardEffects?.SurfaceTexture || <div />}
            interactiveLighting={interactiveLighting}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseEnter={handlePointerEnter}
            onMouseLeave={handlePointerLeave}
            onClick={handleCardClick}
          />
        </div>
      </Html>
    </group>
  );
};
