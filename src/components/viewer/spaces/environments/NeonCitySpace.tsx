
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface NeonCitySpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    fogColor?: string;
    fogDensity?: number;
  };
}

export const NeonCitySpace: React.FC<NeonCitySpaceProps> = ({ config }) => {
  const cityRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cityRef.current) {
      cityRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <>
      <color attach="background" args={[config.backgroundColor]} />
      {config.fogColor && (
        <fog attach="fog" args={[config.fogColor, 5, config.fogDensity ? 1/config.fogDensity : 30]} />
      )}
      
      <ambientLight intensity={config.lightIntensity * 0.3} color={config.ambientColor} />
      <pointLight position={[0, 20, 0]} intensity={config.lightIntensity} color="#ff00ff" />
      <pointLight position={[10, 10, 10]} intensity={config.lightIntensity * 0.7} color="#00ffff" />
      
      <group ref={cityRef}>
        {/* Buildings */}
        {Array.from({ length: 15 }, (_, i) => {
          const angle = (i / 15) * Math.PI * 2;
          const radius = 20 + Math.random() * 15;
          const height = 5 + Math.random() * 15;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <Box 
              key={i} 
              args={[2, height, 2]} 
              position={[x, height/2, z]}
            >
              <meshPhongMaterial 
                color="#1a0033" 
                emissive={i % 3 === 0 ? "#ff00ff" : i % 3 === 1 ? "#00ffff" : "#ff0080"}
                emissiveIntensity={0.2}
              />
            </Box>
          );
        })}
      </group>
    </>
  );
};
