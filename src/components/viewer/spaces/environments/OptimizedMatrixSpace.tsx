
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
    try {
      switch (performanceLevel) {
        case 'low': return 5;
        case 'medium': return 10;
        case 'high': return 15;
        default: return 10;
      }
    } catch (error) {
      console.warn('Error determining text count:', error);
      return 10;
    }
  }, [performanceLevel]);

  const matrixChars = useMemo(() => {
    try {
      return Array.from({ length: textCount }, (_, i) => ({
        char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)),
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 30
        ] as [number, number, number],
        speed: 0.3 + Math.random() * 1.0
      }));
    } catch (error) {
      console.error('Error creating matrix characters:', error);
      return [];
    }
  }, [textCount]);

  useFrame((state) => {
    try {
      if (groupRef.current && performanceLevel !== 'low' && matrixChars.length > 0) {
        groupRef.current.children.forEach((child, i) => {
          if (i < matrixChars.length) {
            child.position.y -= matrixChars[i].speed * 0.01;
            if (child.position.y < -15) {
              child.position.y = 15;
            }
          }
        });
      }
    } catch (error) {
      console.warn('Matrix space animation error:', error);
    }
  });

  const safeConfig = useMemo(() => ({
    backgroundColor: config?.backgroundColor || '#000000',
    ambientColor: config?.ambientColor || '#00ff00',
    lightIntensity: config?.lightIntensity || 0.3
  }), [config]);

  return (
    <>
      <color attach="background" args={[safeConfig.backgroundColor]} />
      <ambientLight intensity={safeConfig.lightIntensity * 0.3} color={safeConfig.ambientColor} />
      
      <group ref={groupRef}>
        {matrixChars.map((item, i) => (
          <Text
            key={i}
            position={item.position}
            fontSize={0.8}
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
