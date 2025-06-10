
import React from 'react';

export const LoadingFallback: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="#666666" transparent opacity={0.5} />
      </mesh>
    </>
  );
};
