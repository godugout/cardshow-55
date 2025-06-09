
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

interface ForestGladeSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
  };
}

export const ForestGladeSpace: React.FC<ForestGladeSpaceProps> = ({ config }) => {
  const treesRef = useRef<any>(null);
  const particlesRef = useRef<any>(null);

  const particleCount = config.particleCount || 1000;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = Math.random() * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 80;
    }
    
    return positions;
  }, [particleCount]);

  useFrame((state) => {
    if (particlesRef.current) {
      // Floating particles like pollen or fireflies
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += Math.sin(state.clock.elapsedTime + i) * 0.01;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.005;
        positions[i3 + 2] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.01;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (treesRef.current) {
      // Gentle swaying
      treesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#90EE90', 30, 100]} />
      
      {/* Tree trunks */}
      <group ref={treesRef}>
        <mesh position={[-25, -5, -30]}>
          <cylinderGeometry args={[1, 2, 20, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        <mesh position={[25, -3, -35]}>
          <cylinderGeometry args={[1.5, 2.5, 25, 8]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        <mesh position={[-35, -8, -40]}>
          <cylinderGeometry args={[0.8, 1.8, 18, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        
        {/* Tree canopies */}
        <mesh position={[-25, 8, -30]}>
          <sphereGeometry args={[8, 8, 6]} />
          <meshLambertMaterial color="#228B22" transparent opacity={0.8} />
        </mesh>
        <mesh position={[25, 12, -35]}>
          <sphereGeometry args={[10, 8, 6]} />
          <meshLambertMaterial color="#32CD32" transparent opacity={0.7} />
        </mesh>
        <mesh position={[-35, 5, -40]}>
          <sphereGeometry args={[7, 8, 6]} />
          <meshLambertMaterial color="#228B22" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Floating particles (pollen/fireflies) */}
      <Points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.5}
          color="#FFD700"
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </Points>

      {/* Ground plane */}
      <mesh position={[0, -15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#228B22" transparent opacity={0.3} />
      </mesh>
    </>
  );
};
