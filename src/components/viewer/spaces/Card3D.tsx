
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { True3DCard } from './True3DCard';
import type { SpaceControls } from './types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
  description?: string;
  rarity?: string;
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
  const groupRef = useRef<Group>(null);

  // Enhanced animation with controls
  useFrame((state) => {
    if (groupRef.current) {
      // Enhanced floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.2;
      groupRef.current.position.y = floatY;

      // Auto rotation with enhanced control
      if (controls.autoRotate) {
        groupRef.current.rotation.y += 0.008 * controls.orbitSpeed;
      }

      // Gravity effect simulation with enhanced physics
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.08;
        groupRef.current.position.y += gravity;
      }

      // Breathing scale effect for enhanced presence
      const breatheScale = 1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
      groupRef.current.scale.setScalar(breatheScale);
    }
  });

  const handleCardClick = () => {
    console.log('🎯 True 3D Card clicked:', card.title);
    onClick?.();
  };

  const handleCardHover = (hovered: boolean) => {
    console.log('🎯 True 3D Card hovered:', hovered, card.title);
  };

  // Get lighting colors with fallbacks
  const lightColor = (selectedLighting as any)?.color || '#ffffff';
  const accentColor = (selectedLighting as any)?.accentColor || '#4444ff';

  return (
    <group ref={groupRef}>
      {/* Enhanced 3D lighting setup */}
      <pointLight
        position={[2, 3, 2]}
        intensity={0.8}
        color={lightColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <pointLight
        position={[-2, 1, 2]}
        intensity={0.4}
        color={accentColor}
      />

      {/* True 3D Card with real geometry */}
      <True3DCard
        card={card}
        position={[0, 0, 0]}
        scale={1.2}
        onClick={handleCardClick}
        onHover={handleCardHover}
        autoRotate={controls.autoRotate}
        floatIntensity={controls.floatIntensity}
      />

      {/* Enhanced ambient particles for magical effect */}
      {effectValues.holographic && 
       typeof effectValues.holographic.intensity === 'number' && 
       effectValues.holographic.intensity > 0.5 && (
        <group>
          {Array.from({ length: 12 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 3
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial 
                color={`hsl(${i * 30}, 70%, 60%)`}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
