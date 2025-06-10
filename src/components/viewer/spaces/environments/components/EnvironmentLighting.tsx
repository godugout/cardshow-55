
import React from 'react';

interface EnvironmentLightingProps {
  brightness: number;
}

export const EnvironmentLighting: React.FC<EnvironmentLightingProps> = ({ brightness }) => {
  return (
    <>
      {/* Optimized lighting for card illumination */}
      <ambientLight intensity={0.4 * brightness} />
      
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8 * brightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.3 * brightness}
        color="#ffffff"
      />
      
      <pointLight
        position={[15, 0, 15]}
        intensity={0.2 * brightness}
        distance={50}
      />
      <pointLight
        position={[-15, 0, -15]}
        intensity={0.2 * brightness}
        distance={50}
      />
    </>
  );
};
