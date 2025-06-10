
import React from 'react';

interface PanoramicLoadingIndicatorProps {
  brightness: number;
}

export const PanoramicLoadingIndicator: React.FC<PanoramicLoadingIndicatorProps> = ({ brightness }) => {
  console.log('🔄 Showing loading state');
  
  return (
    <>
      <ambientLight intensity={0.6 * brightness} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8 * brightness}
        castShadow
      />
      {/* Subtle loading indicator instead of green ring */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.02, 8, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </>
  );
};
