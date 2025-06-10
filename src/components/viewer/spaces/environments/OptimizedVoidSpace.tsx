
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
    try {
      const baseCount = config?.particleCount || 500;
      switch (performanceLevel) {
        case 'low': return Math.min(baseCount * 0.2, 100);
        case 'medium': return Math.min(baseCount * 0.5, 300);
        case 'high': return Math.min(baseCount, 500);
        default: return 300;
      }
    } catch (error) {
      console.warn('Error calculating particle count:', error);
      return 300;
    }
  }, [config?.particleCount, performanceLevel]);

  const positions = useMemo(() => {
    try {
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      resourceManager.register(geometry);
      
      return geometry;
    } catch (error) {
      console.error('Error creating particle positions:', error);
      // Return minimal fallback geometry
      const fallbackGeometry = new THREE.BufferGeometry();
      const fallbackPositions = new Float32Array(3);
      fallbackGeometry.setAttribute('position', new THREE.BufferAttribute(fallbackPositions, 3));
      return fallbackGeometry;
    }
  }, [particleCount, resourceManager]);

  useFrame((state) => {
    try {
      if (pointsRef.current && performanceLevel !== 'low') {
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      }
    } catch (error) {
      console.warn('Void space animation error:', error);
    }
  });

  const safeConfig = useMemo(() => ({
    backgroundColor: config?.backgroundColor || '#000000',
    ambientColor: config?.ambientColor || '#ffffff',
    lightIntensity: config?.lightIntensity || 0.5
  }), [config]);

  return (
    <>
      <color attach="background" args={[safeConfig.backgroundColor]} />
      <ambientLight intensity={safeConfig.lightIntensity * 0.5} color={safeConfig.ambientColor} />
      
      <Points ref={pointsRef} geometry={positions}>
        <PointMaterial
          size={0.3}
          sizeAttenuation={true}
          color="#ffffff"
          transparent
          opacity={0.6}
        />
      </Points>
    </>
  );
};
