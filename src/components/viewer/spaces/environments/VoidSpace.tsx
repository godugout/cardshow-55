
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface VoidSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
  };
}

export const VoidSpace: React.FC<VoidSpaceProps> = ({ config }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = config.particleCount || 5000;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Distribute particles in a large sphere
      const radius = Math.random() * 200 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, [particleCount]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05 * (config.animationSpeed || 1);
    }
  });

  return (
    <>
      {/* Set scene background */}
      <color attach="background" args={[config.backgroundColor]} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={[config.backgroundColor, 50, 200]} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={config.lightIntensity * 0.2} color={config.ambientColor} />
      
      {/* Starfield particles */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.8}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation={true}
        />
      </Points>
    </>
  );
};
