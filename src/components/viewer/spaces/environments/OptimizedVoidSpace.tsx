
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ResourceManager } from '../../utils/ResourceManager';

interface OptimizedVoidSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
  };
  performanceLevel: 'low' | 'medium' | 'high';
}

export const OptimizedVoidSpace: React.FC<OptimizedVoidSpaceProps> = ({ 
  config, 
  performanceLevel 
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const resourceManager = ResourceManager.getInstance();

  const particleCount = useMemo(() => {
    const baseCount = config.particleCount || 1000;
    switch (performanceLevel) {
      case 'low': return Math.min(baseCount * 0.3, 300);
      case 'medium': return Math.min(baseCount * 0.6, 600);
      case 'high': return baseCount;
      default: return baseCount;
    }
  }, [config.particleCount, performanceLevel]);

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    resourceManager.register(geometry);
    
    return geometry;
  }, [particleCount, resourceManager]);

  useFrame((state) => {
    if (pointsRef.current && performanceLevel !== 'low') {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <>
      <color attach="background" args={[config.backgroundColor]} />
      <ambientLight intensity={config.lightIntensity * 0.5} color={config.ambientColor} />
      
      <Points ref={pointsRef} geometry={positions}>
        <PointMaterial
          size={0.5}
          sizeAttenuation={true}
          color="#ffffff"
          transparent
          opacity={0.6}
        />
      </Points>
    </>
  );
};
