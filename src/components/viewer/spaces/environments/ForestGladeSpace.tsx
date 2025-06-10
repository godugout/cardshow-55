
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface ForestGladeSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    fogColor?: string;
    fogDensity?: number;
  };
}

export const ForestGladeSpace: React.FC<ForestGladeSpaceProps> = ({ config }) => {
  const forestRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (forestRef.current) {
      forestRef.current.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
          child.rotation.y = Math.sin(state.clock.elapsedTime + index) * 0.02;
        }
      });
    }
  });

  return (
    <>
      <color attach="background" args={[config.backgroundColor]} />
      {config.fogColor && (
        <fog attach="fog" args={[config.fogColor, 10, config.fogDensity ? 1/config.fogDensity : 50]} />
      )}
      
      <ambientLight intensity={config.lightIntensity * 0.6} color={config.ambientColor} />
      <directionalLight position={[10, 10, 5]} intensity={config.lightIntensity * 0.8} color="#90ee90" />
      
      <group ref={forestRef}>
        {/* Trees */}
        {Array.from({ length: 20 }, (_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 15 + Math.random() * 10;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <group key={i} position={[x, 0, z]}>
              {/* Trunk */}
              <Cylinder args={[0.3, 0.5, 4]} position={[0, 2, 0]}>
                <meshLambertMaterial color="#8B4513" />
              </Cylinder>
              {/* Leaves */}
              <Sphere args={[2, 8, 6]} position={[0, 5, 0]}>
                <meshLambertMaterial color="#228B22" />
              </Sphere>
            </group>
          );
        })}
      </group>
    </>
  );
};
