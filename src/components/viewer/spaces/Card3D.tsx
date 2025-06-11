
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group } from 'three';
import { EnhancedCardContainer } from '../components/EnhancedCardContainer';
import { useCardEffects } from '../hooks/useCardEffects';
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
  
  // Simple state for 3D card interaction
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const zoom = 1;
  const isDragging = false;

  // Double-click detection
  const lastClickTime = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout>();

  // Convert simple card to full CardData format for useCardEffects
  const adaptedCard = React.useMemo(() => adaptCardForViewer(card), [card]);

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
  });

  const handleCardClick = () => {
    const now = Date.now();
    const timeDiff = now - lastClickTime.current;
    
    // Clear any existing timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    
    if (timeDiff < 300) {
      // Double click detected
      setIsFlipped(!isFlipped);
      onClick?.();
      lastClickTime.current = 0; // Reset to prevent triple click
    } else {
      // Single click - set timeout to check for double click
      clickTimeout.current = setTimeout(() => {
        // Single click action if needed
      }, 300);
      lastClickTime.current = now;
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <group ref={groupRef}>
      {/* Interactive mesh for click detection */}
      <mesh 
        castShadow 
        receiveShadow
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* HTML overlay for the enhanced card - completely non-interactive */}
      <Html
        transform
        occlude
        position={[0, 0, 0.01]}
        distanceFactor={1}
        style={{
          width: '250px',
          height: '350px',
          pointerEvents: 'none'
        }}
      >
        <div style={{ 
          width: '250px', 
          height: '350px', 
          transform: 'scale(0.6)',
          pointerEvents: 'none'
        }}>
          <EnhancedCardContainer
            card={adaptedCard}
            isFlipped={isFlipped}
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
            onMouseDown={() => {}}
            onMouseMove={() => {}}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onClick={() => {}} // Remove click handling from HTML overlay
          />
        </div>
      </Html>
    </group>
  );
};
