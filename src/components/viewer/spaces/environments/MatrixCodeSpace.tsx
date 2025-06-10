
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface MatrixCodeSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    animationSpeed?: number;
  };
}

export const MatrixCodeSpace: React.FC<MatrixCodeSpaceProps> = ({ config }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const matrixElements = useMemo(() => {
    const elements = [];
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    for (let i = 0; i < 50; i++) {
      elements.push({
        id: i,
        text: Array.from({ length: 10 }, () => 
          characters[Math.floor(Math.random() * characters.length)]
        ).join('\n'),
        position: [
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 100
        ] as [number, number, number],
        speed: Math.random() * 2 + 0.5
      });
    }
    
    return elements;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = config.animationSpeed || 1.0;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const element = matrixElements[index];
        if (element) {
          child.position.y -= element.speed * speed * 0.1;
          if (child.position.y < -30) {
            child.position.y = 30;
          }
        }
      });
    }
  });

  return (
    <>
      {/* Set scene background */}
      <color attach="background" args={[config.backgroundColor]} />
      
      {/* Green ambient lighting */}
      <ambientLight intensity={config.lightIntensity * 0.3} color={config.ambientColor} />
      <directionalLight 
        position={[0, 10, 5]} 
        intensity={config.lightIntensity * 0.7} 
        color="#00ff00" 
      />
      
      {/* Matrix code rain */}
      <group ref={groupRef}>
        {matrixElements.map((element) => (
          <Text
            key={element.id}
            position={element.position}
            fontSize={1}
            color="#00ff00"
            font="/fonts/matrix.woff"
            anchorX="center"
            anchorY="middle"
            material-transparent
            material-opacity={0.7}
          >
            {element.text}
          </Text>
        ))}
      </group>
      
      {/* Fog for depth */}
      <fog attach="fog" args={[config.backgroundColor, 20, 80]} />
    </>
  );
};
