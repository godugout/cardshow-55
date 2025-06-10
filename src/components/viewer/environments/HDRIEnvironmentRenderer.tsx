
import React from 'react';
import { Environment } from '@react-three/drei';
import type { EnvironmentScene } from '../types';

interface HDRIEnvironmentRendererProps {
  scene: EnvironmentScene;
  intensity?: number;
  enableCaching?: boolean;
}

export const HDRIEnvironmentRenderer: React.FC<HDRIEnvironmentRendererProps> = ({
  scene,
  intensity = 1.0,
  enableCaching = true
}) => {
  return (
    <>
      {/* Set background from scene */}
      <color attach="background" args={[scene.lighting.color]} />
      
      {/* Environment lighting */}
      <Environment
        preset="studio"
        background={false}
        environmentIntensity={intensity * scene.lighting.intensity}
      />
      
      {/* Scene-specific lighting */}
      <ambientLight 
        intensity={scene.lighting.intensity * 0.4 * intensity} 
        color={scene.lighting.color} 
      />
      <directionalLight
        position={[
          Math.cos(scene.lighting.azimuth) * Math.cos(scene.lighting.elevation),
          Math.sin(scene.lighting.elevation),
          Math.sin(scene.lighting.azimuth) * Math.cos(scene.lighting.elevation)
        ]}
        intensity={scene.lighting.intensity * 0.8 * intensity}
        color={scene.lighting.color}
        castShadow
      />
      
      {/* Atmospheric effects */}
      {scene.atmosphere.fog && (
        <fog 
          attach="fog" 
          args={[
            scene.atmosphere.fogColor, 
            10, 
            scene.atmosphere.fogDensity ? 1/scene.atmosphere.fogDensity : 50
          ]} 
        />
      )}
    </>
  );
};
