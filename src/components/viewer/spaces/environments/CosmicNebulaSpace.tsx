
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

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
  const pointsRef = useRef<any>(null);
  const nebula1Ref = useRef<any>(null);
  const nebula2Ref = useRef<any>(null);
  
  const particleCount = config.particleCount || 3000;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create nebula-like clusters
      const clusterX = (Math.random() - 0.5) * 60;
      const clusterY = (Math.random() - 0.5) * 40;
      const clusterZ = (Math.random() - 0.5) * 60;
      
      positions[i3] = clusterX + (Math.random() - 0.5) * 20;
      positions[i3 + 1] = clusterY + (Math.random() - 0.5) * 15;
      positions[i3 + 2] = clusterZ + (Math.random() - 0.5) * 20;
      
      // Cosmic colors - purples, magentas, blues
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 1; // R
        colors[i3 + 1] = 0; // G
        colors[i3 + 2] = 1; // B (magenta)
      } else if (colorChoice < 0.66) {
        colors[i3] = 0.4; // R
        colors[i3 + 1] = 0.8; // G
        colors[i3 + 2] = 1; // B (cyan)
      } else {
        colors[i3] = 0.6; // R
        colors[i3 + 1] = 0.2; // G
        colors[i3 + 2] = 1; // B (purple)
      }
    }
    
    return [positions, colors];
  }, [particleCount]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1 * (config.animationSpeed || 2);
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    
    if (nebula1Ref.current) {
      nebula1Ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      nebula1Ref.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
    
    if (nebula2Ref.current) {
      nebula2Ref.current.rotation.x = -state.clock.elapsedTime * 0.03;
      nebula2Ref.current.rotation.z = state.clock.elapsedTime * 0.06;
    }
  });

  return (
    <>
      <fog attach="fog" args={[config.backgroundColor, 30, 120]} />
      <ambientLight intensity={config.lightIntensity * 0.3} color={config.ambientColor} />
      <pointLight position={[0, 0, 0]} intensity={config.lightIntensity * 0.5} color="#ff00ff" />
      <pointLight position={[30, 30, 30]} intensity={config.lightIntensity * 0.3} color="#00ffff" />
      
      {/* Main particle field */}
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
          size={1.2}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
        />
      </Points>

      {/* Nebula clouds */}
      <mesh ref={nebula1Ref} position={[-20, 10, -30]}>
        <sphereGeometry args={[15, 8, 6]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.1} />
      </mesh>
      
      <mesh ref={nebula2Ref} position={[25, -15, -40]}>
        <sphereGeometry args={[20, 8, 6]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.08} />
      </mesh>
    </>
  );
};
