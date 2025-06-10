
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

interface NeonCitySpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
  };
}

export const NeonCitySpace: React.FC<NeonCitySpaceProps> = ({ config }) => {
  const cityRef = useRef<any>(null);
  const neonRef = useRef<any>(null);

  useFrame((state) => {
    if (neonRef.current) {
      // Pulsing neon effect
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      neonRef.current.children.forEach((child: any, index: number) => {
        if (child.material) {
          child.material.emissiveIntensity = intensity + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
        }
      });
    }
  });

  return (
    <>
      <fog attach="fog" args={['#0a0a0a', 15, 80]} />
      
      {/* City skyline silhouettes */}
      <group ref={cityRef} position={[0, -10, -40]}>
        {/* Building shapes */}
        <mesh position={[-20, 5, 0]}>
          <boxGeometry args={[4, 20, 4]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-10, 8, 0]}>
          <boxGeometry args={[3, 25, 3]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[5, 22, 5]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[15, 7, 0]}>
          <boxGeometry args={[3, 24, 3]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[25, 4, 0]}>
          <boxGeometry args={[4, 18, 4]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Neon lights */}
      <group ref={neonRef}>
        <mesh position={[-20, 0, -35]}>
          <boxGeometry args={[0.2, 3, 0.2]} />
          <meshStandardMaterial 
            color="#ff00ff" 
            emissive="#ff00ff" 
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-10, 2, -35]}>
          <boxGeometry args={[0.2, 4, 0.2]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff" 
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 1, -35]}>
          <boxGeometry args={[0.2, 5, 0.2]} />
          <meshStandardMaterial 
            color="#ffff00" 
            emissive="#ffff00" 
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[15, 3, -35]}>
          <boxGeometry args={[0.2, 3, 0.2]} />
          <meshStandardMaterial 
            color="#ff0080" 
            emissive="#ff0080" 
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Cyberpunk particles */}
      <Stars 
        radius={60} 
        depth={30} 
        count={800} 
        factor={6} 
        saturation={0.9} 
        fade 
        speed={1.5} 
      />
    </>
  );
};
