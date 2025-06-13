
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { True3DCard } from './True3DCard';
import { mapLightingTo3D } from './utils/effectsTo3DMapper';
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
    console.log('🎯 Enhanced 3D Card clicked:', card.title, 'Effects:', effectValues);
    onClick?.();
  };

  const handleCardHover = (hovered: boolean) => {
    console.log('🎯 Enhanced 3D Card hovered:', hovered, card.title);
  };

  // Get enhanced lighting properties
  const lightingProps = selectedLighting ? mapLightingTo3D(selectedLighting) : {
    mainLightColor: '#ffffff',
    mainLightIntensity: 0.8,
    ambientColor: '#404040',
    ambientIntensity: 0.3,
    accentColor: '#4444ff',
    accentIntensity: 0.4
  };

  // Apply brightness multiplier - ensure we have a valid number
  const brightnessValue = Array.isArray(overallBrightness) && overallBrightness.length > 0 
    ? overallBrightness[0] 
    : 100;
  const brightnessMultiplier = typeof brightnessValue === 'number' ? brightnessValue / 100 : 1;

  return (
    <group ref={groupRef}>
      {/* Enhanced 3D lighting setup with effect-driven colors */}
      <pointLight
        position={[2, 3, 2]}
        intensity={lightingProps.mainLightIntensity * brightnessMultiplier}
        color={lightingProps.mainLightColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <pointLight
        position={[-2, 1, 2]}
        intensity={lightingProps.accentIntensity * brightnessMultiplier}
        color={lightingProps.accentColor}
      />

      {/* Enhanced ambient light */}
      <ambientLight 
        intensity={lightingProps.ambientIntensity * brightnessMultiplier}
        color={lightingProps.ambientColor}
      />

      {/* True 3D Card with enhanced effects integration */}
      <True3DCard
        card={card}
        position={[0, 0, 0]}
        scale={1.2}
        onClick={handleCardClick}
        onHover={handleCardHover}
        autoRotate={controls.autoRotate}
        floatIntensity={controls.floatIntensity}
        effectValues={effectValues}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
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
                opacity={0.6 * effectValues.holographic.intensity}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
