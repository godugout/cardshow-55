
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface CosmicNebulaSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
  };
}

export const CosmicNebulaSpace: React.FC<CosmicNebulaSpaceProps> = ({ config }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Mesh>(null);
  
  const particleCount = config.particleCount || 3000;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create nebula-like distribution
      const radius = Math.random() * 150 + 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Colorful particles
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors[i3] = 1; colors[i3 + 1] = 0.4; colors[i3 + 2] = 0.8; // Pink
      } else if (colorChoice < 0.6) {
        colors[i3] = 0.3; colors[i3 + 1] = 0.8; colors[i3 + 2] = 1; // Blue
      } else {
        colors[i3] = 0.8; colors[i3 + 1] = 0.3; colors[i3 + 2] = 1; // Purple
      }
    }
    
    return { positions, colors };
  }, [particleCount]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = config.animationSpeed || 0.5;
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.02 * speed;
      pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    }
    
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = time * 0.01 * speed;
    }
  });

  return (
    <>
      {/* Set scene background */}
      <color attach="background" args={[config.backgroundColor]} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={config.lightIntensity * 0.4} color={config.ambientColor} />
      <pointLight position={[0, 50, 0]} intensity={config.lightIntensity * 0.6} color="#ff4d9f" />
      <pointLight position={[50, -30, 20]} intensity={config.lightIntensity * 0.4} color="#4da6ff" />
      
      {/* Nebula particles */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[positions.colors, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={1.2}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Nebula clouds */}
      <Sphere ref={nebulaRef} args={[80, 32, 32]} position={[0, 0, -100]}>
        <meshBasicMaterial 
          color="#4a154b" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </>
  );
};
