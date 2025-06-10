
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh } from 'three';
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
  const meshRef = useRef<Mesh>(null);
  
  // Simple state for 3D card interaction
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const zoom = 1;
  const isDragging = false;

  // Use card effects if we have the required props
  const cardEffects = (selectedScene && selectedLighting && materialSettings) ? useCardEffects({
    card: { id: card.id, title: card.title, image_url: card.image_url },
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
    if (meshRef.current) {
      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      meshRef.current.position.y = floatY;

      // Auto rotation
      if (controls.autoRotate) {
        meshRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        meshRef.current.position.y += gravity;
      }
    }
  });

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    onClick?.();
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseDown = () => {};
  const handleMouseMove = () => {};

  // Convert the 3D card data to the format expected by EnhancedCardContainer
  const enhancedCardData = {
    id: card.id,
    title: card.title,
    image_url: card.image_url || '/placeholder-card.jpg'
  };

  return (
    <group ref={meshRef}>
      {/* Render the enhanced card container with 3D positioning */}
      <mesh 
        castShadow 
        receiveShadow
        onClick={handleCardClick}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
      >
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial transparent opacity={0} /> {/* Invisible plane for interaction */}
      </mesh>
      
      {/* HTML overlay for the enhanced card */}
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
        <div style={{ width: '250px', height: '350px', transform: 'scale(0.6)' }}>
          <EnhancedCardContainer
            card={enhancedCardData}
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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          />
        </div>
      </Html>
    </group>
  );
};
