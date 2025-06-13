
import React, { useRef, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { Mesh } from 'three';
import { createCardMaterials } from '../utils/cardMaterials';
import { mapEffectsTo3DMaterials } from '../utils/effectsTo3DMapper';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { LightingPreset, MaterialSettings } from '../../types';

interface CardMeshProps {
  frontTexture: THREE.Texture;
  backTexture: THREE.Texture;
  cardWidth: number;
  cardHeight: number;
  cardDepth: number;
  isHovered: boolean;
  autoRotate: boolean;
  onClick?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  effectValues?: EffectValues;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
}

export const CardMesh: React.FC<CardMeshProps> = ({
  frontTexture,
  backTexture,
  cardWidth,
  cardHeight,
  cardDepth,
  isHovered,
  autoRotate,
  onClick,
  onPointerEnter,
  onPointerLeave,
  effectValues = {},
  selectedLighting,
  materialSettings
}) => {
  const meshRef = useRef<Mesh>(null);

  // Map effects to 3D material properties
  const material3DProps = useMemo(() => {
    if (!selectedLighting || !materialSettings) {
      return null;
    }
    return mapEffectsTo3DMaterials(effectValues, selectedLighting, materialSettings);
  }, [effectValues, selectedLighting, materialSettings]);

  // Enhanced materials with effect mapping
  const materials = useMemo(() => {
    const baseMaterials = createCardMaterials(frontTexture, backTexture);
    
    // Apply 3D effect properties if available
    if (material3DProps && baseMaterials.length >= 6) {
      // Update front material (index 4)
      const frontMaterial = baseMaterials[4] as THREE.MeshStandardMaterial;
      frontMaterial.metalness = material3DProps.metalness;
      frontMaterial.roughness = material3DProps.roughness;
      frontMaterial.emissiveIntensity = material3DProps.emissiveIntensity;
      frontMaterial.emissive = new THREE.Color(material3DProps.emissiveColor);
      frontMaterial.clearcoat = material3DProps.clearcoat;
      frontMaterial.clearcoatRoughness = material3DProps.clearcoatRoughness;
      
      // Update edge materials for enhanced reflectivity
      for (let i = 0; i < 4; i++) {
        const edgeMaterial = baseMaterials[i] as THREE.MeshStandardMaterial;
        edgeMaterial.metalness = Math.min(0.95, material3DProps.metalness + 0.1);
        edgeMaterial.roughness = Math.max(0.05, material3DProps.roughness - 0.1);
      }
    }
    
    return baseMaterials;
  }, [frontTexture, backTexture, material3DProps]);

  useFrame((state) => {
    if (meshRef.current) {
      // Auto rotation with enhanced smoothness
      if (autoRotate) {
        meshRef.current.rotation.y += 0.005;
      }

      // Enhanced hover effects with material response
      if (isHovered) {
        const hoverScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
        meshRef.current.scale.setScalar(hoverScale);
        
        // Add subtle hover rotation
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        // Smooth return to neutral position
        meshRef.current.rotation.x *= 0.95;
      }

      // Enhanced floating animation for holographic effects
      if (effectValues.holographic && typeof effectValues.holographic.intensity === 'number' && effectValues.holographic.intensity > 0.3) {
        const floatY = Math.sin(state.clock.elapsedTime * 0.8) * 0.1 * effectValues.holographic.intensity;
        meshRef.current.position.y = floatY;
      }
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log('🎯 Enhanced 3D Card clicked with effects:', effectValues);
    onClick?.();
  };

  return (
    <>
      {/* Main card mesh with TRUE 3D geometry and enhanced materials */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
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
            color={material3DProps?.emissiveColor || '#4444ff'} 
            transparent 
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Holographic particle effects */}
      {effectValues.holographic && 
       typeof effectValues.holographic.intensity === 'number' && 
       effectValues.holographic.intensity > 0.7 && (
        <group>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * cardWidth * 1.5,
                (Math.random() - 0.5) * cardHeight * 1.5,
                (Math.random() - 0.5) * 1
              ]}
            >
              <sphereGeometry args={[0.01, 6, 6]} />
              <meshBasicMaterial 
                color={`hsl(${180 + i * 20}, 70%, 60%)`}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
};
