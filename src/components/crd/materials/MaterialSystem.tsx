import React from 'react';
import * as THREE from 'three';
import { type MaterialMode } from '../types/CRDTypes';

interface MaterialSystemProps {
  mode: MaterialMode;
  intensity: number;
  type: 'card' | 'case';
  pathTheme?: 'sports' | 'fantasy' | 'life';
}

export const MaterialSystem: React.FC<MaterialSystemProps> = ({ 
  mode, 
  intensity, 
  type,
  pathTheme = 'neutral'
}) => {
  const time = Date.now() * 0.001;

  // Card Materials
  if (type === 'card') {
    switch (mode) {
      case 'ice':
        return (
          <meshPhysicalMaterial
            color="#e6f3ff"
            metalness={0}
            roughness={0}
            transmission={0.98}
            transparent={true}
            opacity={0.4}
            thickness={0.2}
            ior={1.309}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#cce7ff"
            emissiveIntensity={0.05 * intensity}
            side={THREE.DoubleSide}
          />
        );
      
      case 'gold':
        return (
          <meshStandardMaterial 
            color="#ffed4e"
            metalness={1}
            roughness={0.02}
            emissive="#ff9500"
            emissiveIntensity={0.4 * intensity}
            envMapIntensity={2}
          />
        );
      
      case 'glass':
        return (
          <meshPhysicalMaterial
            color="#e6f7ff"
            metalness={0}
            roughness={0}
            transmission={0.99}
            transparent={true}
            opacity={0.6}
            thickness={0.15}
            ior={2.417}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#b3e0ff"
            emissiveIntensity={0.08 * intensity}
            side={THREE.DoubleSide}
            envMapIntensity={3}
          />
        );
      
      case 'holo':
        const hue = (time * 50) % 360;
        const emissiveHue = (time * 70) % 360;
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(hue / 360, 0.8, 0.6)}
            metalness={1}
            roughness={0.1}
            emissive={new THREE.Color().setHSL(emissiveHue / 360, 0.9, 0.4)}
            emissiveIntensity={0.8 * intensity}
            envMapIntensity={4}
          />
        );

      // Future path-specific materials
      case 'sports':
        return (
          <meshStandardMaterial 
            color="#1a472a" // Sports green base
            metalness={0.3}
            roughness={0.4}
            emissive="#0f2817"
            emissiveIntensity={0.2 * intensity}
            envMapIntensity={1.2}
          />
        );

      case 'fantasy':
        const fantasyHue = (time * 30) % 360;
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(fantasyHue / 360, 0.7, 0.5)}
            metalness={0.8}
            roughness={0.2}
            emissive={new THREE.Color().setHSL((fantasyHue + 60) / 360, 0.8, 0.3)}
            emissiveIntensity={0.6 * intensity}
            envMapIntensity={3}
          />
        );

      case 'life':
        return (
          <meshStandardMaterial 
            color="#8b4513" // Earthy brown
            metalness={0.1}
            roughness={0.6}
            emissive="#3d1a00"
            emissiveIntensity={0.1 * intensity}
            envMapIntensity={0.8}
          />
        );
      
      default:
        // Default showcase/monolith material
        return (
          <meshStandardMaterial 
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.1}
            emissive="#0f0f2a"
            emissiveIntensity={(mode === 'showcase' ? 0.3 : 0.05) * intensity}
            envMapIntensity={1.5}
          />
        );
    }
  }
  
  // Glass Case Material
  if (type === 'case') {
    return (
      <meshStandardMaterial 
        color="#e6f3ff"
        metalness={0}
        roughness={0}
        transparent
        opacity={0.12}
        emissive="#ffffff"
        emissiveIntensity={0.03 * intensity}
      />
    );
  }

  // Fallback
  return <meshStandardMaterial color="#666666" />;
};