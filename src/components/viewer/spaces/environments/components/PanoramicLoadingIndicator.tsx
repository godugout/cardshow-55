
import React from 'react';

interface PanoramicLoadingIndicatorProps {
  brightness: number;
}

export const PanoramicLoadingIndicator: React.FC<PanoramicLoadingIndicatorProps> = ({ brightness }) => {
  return (
    <>
      {/* Fallback lighting while loading */}
      <ambientLight intensity={0.3 * brightness} />
      <directionalLight position={[5, 5, 5]} intensity={0.5 * brightness} />
      
      {/* Simple loading mesh */}
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.5} />
      </mesh>
    </>
  );
};
