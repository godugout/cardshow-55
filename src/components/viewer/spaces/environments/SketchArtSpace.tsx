
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface SketchArtSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
  };
}

export const SketchArtSpace: React.FC<SketchArtSpaceProps> = ({ config }) => {
  const linesRef = useRef<any>(null);

  // Generate sketchy line patterns
  const sketchLines = useMemo(() => {
    const lines = [];
    
    for (let i = 0; i < 20; i++) {
      const points = [];
      const segments = 10 + Math.random() * 20;
      
      for (let j = 0; j < segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const radius = 10 + Math.random() * 30;
        const noise = (Math.random() - 0.5) * 2; // Sketchy noise
        
        points.push(new Vector3(
          Math.cos(angle) * radius + noise,
          Math.sin(angle * 0.5) * radius + noise,
          Math.sin(angle) * radius + noise
        ));
      }
      
      lines.push(points);
    }
    
    return lines;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      linesRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#f5f5f5', 5, 60]} />
      
      <group ref={linesRef}>
        {sketchLines.map((points, index) => (
          <Line
            key={index}
            points={points}
            color={`hsl(${index * 18}, 70%, 50%)`}
            lineWidth={1 + Math.random() * 2}
            transparent
            opacity={0.6 + Math.random() * 0.4}
          />
        ))}
      </group>

      {/* Sketchy geometric shapes */}
      <mesh position={[-10, 5, -15]} rotation={[0.3, 0.5, 0.2]}>
        <octahedronGeometry args={[2]} />
        <meshBasicMaterial 
          color="#333333" 
          wireframe 
          transparent 
          opacity={0.7}
        />
      </mesh>

      <mesh position={[10, -3, -20]} rotation={[0.8, 0.2, 0.6]}>
        <tetrahedronGeometry args={[3]} />
        <meshBasicMaterial 
          color="#666666" 
          wireframe 
          transparent 
          opacity={0.5}
        />
      </mesh>

      {/* Paper texture background plane */}
      <mesh position={[0, 0, -50]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color="#fafafa" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </>
  );
};
