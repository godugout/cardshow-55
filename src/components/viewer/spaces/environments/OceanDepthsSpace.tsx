
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface OceanDepthsSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
  };
}

export const OceanDepthsSpace: React.FC<OceanDepthsSpaceProps> = ({ config }) => {
  const oceanRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (oceanRef.current) {
      oceanRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01;
      });
    }
  });

  return (
    <>
      <color attach="background" args={[config.backgroundColor]} />
      <fog attach="fog" args={[config.backgroundColor, 20, 100]} />
      
      <ambientLight intensity={config.lightIntensity * 0.4} color={config.ambientColor} />
      <directionalLight position={[0, 20, 0]} intensity={config.lightIntensity * 0.6} color="#0066cc" />
      
      <group ref={oceanRef}>
        {/* Floating bubbles */}
        {Array.from({ length: 30 }, (_, i) => (
          <Sphere 
            key={i}
            args={[0.2 + Math.random() * 0.3, 8, 6]}
            position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 40
            ]}
          >
            <meshPhongMaterial 
              color="#87CEEB" 
              transparent 
              opacity={0.3}
            />
          </Sphere>
        ))}
      </group>
    </>
  );
};
