
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

interface OceanDepthsSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
  };
}

export const OceanDepthsSpace: React.FC<OceanDepthsSpaceProps> = ({ config }) => {
  const bubblesRef = useRef<any>(null);
  const kelpRef = useRef<any>(null);
  
  const bubbleCount = config.particleCount || 500;
  
  const bubbles = useMemo(() => {
    const positions = new Float32Array(bubbleCount * 3);
    const sizes = new Float32Array(bubbleCount);
    
    for (let i = 0; i < bubbleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;
      sizes[i] = Math.random() * 0.5 + 0.2;
    }
    
    return { positions, sizes };
  }, [bubbleCount]);

  useFrame((state) => {
    if (bubblesRef.current) {
      // Rising bubbles
      const positions = bubblesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < bubbleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += 0.02; // Rise up
        
        // Reset bubbles that go too high
        if (positions[i3 + 1] > 30) {
          positions[i3 + 1] = -30;
          positions[i3] = (Math.random() - 0.5) * 60;
          positions[i3 + 2] = (Math.random() - 0.5) * 60;
        }
        
        // Add some drift
        positions[i3] += Math.sin(state.clock.elapsedTime + i) * 0.005;
        positions[i3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.005;
      }
      
      bubblesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (kelpRef.current) {
      // Swaying kelp
      kelpRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      kelpRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.4) * 0.05;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#006994', 20, 80]} />
      
      {/* Kelp forest */}
      <group ref={kelpRef}>
        <mesh position={[-20, -10, -25]}>
          <cylinderGeometry args={[0.3, 0.5, 30, 6]} />
          <meshLambertMaterial color="#2E8B57" transparent opacity={0.8} />
        </mesh>
        <mesh position={[15, -8, -30]}>
          <cylinderGeometry args={[0.4, 0.6, 25, 6]} />
          <meshLambertMaterial color="#3CB371" transparent opacity={0.7} />
        </mesh>
        <mesh position={[-30, -12, -35]}>
          <cylinderGeometry args={[0.2, 0.4, 35, 6]} />
          <meshLambertMaterial color="#2E8B57" transparent opacity={0.9} />
        </mesh>
        <mesh position={[25, -15, -20]}>
          <cylinderGeometry args={[0.5, 0.7, 28, 6]} />
          <meshLambertMaterial color="#20B2AA" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Coral formations */}
      <mesh position={[-10, -18, -15]}>
        <sphereGeometry args={[3, 8, 6]} />
        <meshLambertMaterial color="#FF7F50" transparent opacity={0.8} />
      </mesh>
      <mesh position={[12, -20, -18]}>
        <coneGeometry args={[2, 4, 8]} />
        <meshLambertMaterial color="#FF6347" transparent opacity={0.7} />
      </mesh>

      {/* Rising bubbles */}
      <Points ref={bubblesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bubbles.positions, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.3}
          color="#87CEEB"
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </Points>

      {/* Ocean floor */}
      <mesh position={[0, -25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#8FBC8F" transparent opacity={0.4} />
      </mesh>
    </>
  );
};
