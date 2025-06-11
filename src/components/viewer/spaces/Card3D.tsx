
import React, { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group } from 'three';
import { CardFrontContainer } from '../components/CardFrontContainer';
import { CardBackContainer } from '../components/CardBackContainer';
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
  
  // Enhanced interaction state to match 2D version
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [autoRotateEnabled, setAutoRotateEnabled] = React.useState(controls.autoRotate);
  
  // Double-click detection (same as 2D version)
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const zoom = 1;

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
      // Apply manual rotation from dragging
      groupRef.current.rotation.x = (rotation.x * Math.PI) / 180 * 0.5; // Reduce sensitivity
      groupRef.current.rotation.y = (rotation.y * Math.PI) / 180 * 0.5;
      
      // Add flip rotation if card is flipped
      if (isFlipped) {
        groupRef.current.rotation.y += Math.PI;
      }

      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      groupRef.current.position.y = floatY;

      // Auto rotation (only when not dragging)
      if (autoRotateEnabled && !isDragging) {
        groupRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        groupRef.current.position.y += gravity;
      }
    }
  });

  // Double-click flip handler (same logic as 2D version)
  const handleCardFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
    onClick?.();
  }, [onClick]);

  // Mouse interaction handlers (matching 2D version behavior)
  const handleMouseDown = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - rotation.y, 
      y: e.clientY - rotation.x 
    });
    setAutoRotateEnabled(false);
    
    // Double-click detection
    clickCount.current += 1;
    
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    
    clickTimeout.current = setTimeout(() => {
      if (clickCount.current === 2) {
        handleCardFlip();
      }
      clickCount.current = 0;
    }, 300);
  }, [rotation, handleCardFlip]);

  const handleMouseMove = useCallback((e: any) => {
    e.stopPropagation();
    
    // Update mouse position for effects (normalized to 0-1)
    const rect = e.target.getBoundingClientRect?.() || { left: 0, top: 0, width: 400, height: 560 };
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePosition({ x, y });
    
    // Handle dragging rotation
    if (isDragging) {
      setRotation({
        x: Math.max(-90, Math.min(90, e.clientY - dragStart.y)),
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsDragging(false);
    // Re-enable auto rotation when mouse leaves
    setAutoRotateEnabled(controls.autoRotate);
  }, [controls.autoRotate]);

  return (
    <group ref={groupRef}>
      {/* Front Face */}
      <Html
        transform
        occlude
        position={[0, 0, 0.01]}
        distanceFactor={1}
        style={{
          width: '400px',
          height: '560px',
          pointerEvents: 'auto'
        }}
      >
        <div 
          style={{ 
            width: '400px', 
            height: '560px',
            cursor: isDragging ? 'grabbing' : 'grab',
            transform: 'scale(0.8)',
            transformOrigin: 'center center'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CardFrontContainer
            card={adaptedCard}
            isFlipped={false}
            isHovering={isHovering}
            showEffects={true}
            effectValues={effectValues}
            mousePosition={mousePosition}
            frameStyles={cardEffects?.getFrameStyles() || { transition: isDragging ? 'none' : 'all 0.3s ease' }}
            enhancedEffectStyles={cardEffects?.getEnhancedEffectStyles() || {}}
            SurfaceTexture={cardEffects?.SurfaceTexture || <div />}
            interactiveLighting={interactiveLighting}
            onClick={handleCardFlip}
          />
        </div>
      </Html>
      
      {/* Back Face */}
      <Html
        transform
        occlude
        position={[0, 0, -0.01]}
        rotation={[0, Math.PI, 0]}
        distanceFactor={1}
        style={{
          width: '400px',
          height: '560px',
          pointerEvents: 'auto'
        }}
      >
        <div 
          style={{ 
            width: '400px', 
            height: '560px',
            cursor: isDragging ? 'grabbing' : 'grab',
            transform: 'scale(0.8)',
            transformOrigin: 'center center'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CardBackContainer
            isFlipped={false}
            isHovering={isHovering}
            showEffects={true}
            effectValues={effectValues}
            mousePosition={mousePosition}
            frameStyles={cardEffects?.getFrameStyles() || { transition: isDragging ? 'none' : 'all 0.3s ease' }}
            enhancedEffectStyles={cardEffects?.getEnhancedEffectStyles() || {}}
            SurfaceTexture={cardEffects?.SurfaceTexture || <div />}
            interactiveLighting={interactiveLighting}
          />
        </div>
      </Html>
      
      {/* Invisible collision mesh for interactions */}
      <mesh 
        castShadow 
        receiveShadow
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
      >
        <boxGeometry args={[3.2, 4.5, 0.02]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};
