
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface OptimizedMatrixSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
  };
  performanceLevel: 'low' | 'medium' | 'high';
}

export const OptimizedMatrixSpace: React.FC<OptimizedMatrixSpaceProps> = ({ 
  config, 
  performanceLevel 
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const textCount = useMemo(() => {
    switch (performanceLevel) {
      case 'low': return 8;
      case 'medium': return 15;
      case 'high': return 25;
      default: return 15;
    }
  }, [performanceLevel]);

  const matrixChars = useMemo(() => 
    Array.from({ length: textCount }, (_, i) => ({
      char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)),
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 1.5
    })), 
  [textCount]);

  useFrame((state) => {
    if (groupRef.current && performanceLevel !== 'low') {
      groupRef.current.children.forEach((child, i) => {
        child.position.y -= matrixChars[i].speed * 0.02;
        if (child.position.y < -20) {
          child.position.y = 20;
        }
      });
    }
  });

  return (
    <>
      <color attach="background" args={[config.backgroundColor]} />
      <ambientLight intensity={config.lightIntensity * 0.3} color={config.ambientColor} />
      
      <group ref={groupRef}>
        {matrixChars.map((item, i) => (
          <Text
            key={i}
            position={item.position}
            fontSize={1}
            color="#00ff00"
            anchorX="center"
            anchorY="middle"
          >
            {item.char}
          </Text>
        ))}
      </group>
    </>
  );
};
