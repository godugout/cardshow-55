
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { Float32BufferAttribute, BufferGeometry } from 'three';

interface MatrixCodeSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
  };
}

export const MatrixCodeSpace: React.FC<MatrixCodeSpaceProps> = ({ config }) => {
  const pointsRef = useRef<any>(null);
  
  const particleCount = config.particleCount || 3000;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a grid-like pattern
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // Green matrix colors with variations
      colors[i3] = 0.1; // R
      colors[i3 + 1] = Math.random() * 0.8 + 0.2; // G
      colors[i3 + 2] = 0.1; // B
    }
    
    return [positions, colors];
  }, [particleCount]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Make particles fall like digital rain
        positions[i3 + 1] -= (config.animationSpeed || 1) * 0.1;
        
        // Reset particles that fall too far
        if (positions[i3 + 1] < -50) {
          positions[i3 + 1] = 50;
          positions[i3] = (Math.random() - 0.5) * 100;
          positions[i3 + 2] = (Math.random() - 0.5) * 100;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#003300', 10, 80]} />
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
        />
      </Points>
    </>
  );
};
