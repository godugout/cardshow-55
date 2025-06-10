
import React from 'react';

interface PanoramicLightingProps {
  brightness: number;
}

export const PanoramicLighting: React.FC<PanoramicLightingProps> = ({ brightness }) => {
  return (
    <>
      <ambientLight intensity={0.4 * brightness} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8 * brightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight 
        position={[-10, -10, -5]} 
        intensity={0.3 * brightness}
        color="#4A90E2"
      />
    </>
  );
};
