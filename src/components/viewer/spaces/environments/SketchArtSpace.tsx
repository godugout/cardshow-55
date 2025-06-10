
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface SketchArtSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    animationSpeed?: number;
  };
}

export const SketchArtSpace: React.FC<SketchArtSpaceProps> = ({ config }) => {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.1 * (config.animationSpeed || 1);
    }
  });

  const linePoints = [
    [new THREE.Vector3(-10, -10, 0), new THREE.Vector3(10, 10, 0)],
    [new THREE.Vector3(-10, 10, 0), new THREE.Vector3(10, -10, 0)],
    [new THREE.Vector3(0, -15, -10), new THREE.Vector3(0, 15, 10)],
  ];

  return (
    <>
      <color attach="background" args={['#f5f5f5']} />
      <ambientLight intensity={config.lightIntensity} color={config.ambientColor} />
      
      <group ref={linesRef}>
        {linePoints.map((points, index) => (
          <Line
            key={index}
            points={points}
            color="#333333"
            lineWidth={2}
          />
        ))}
      </group>
    </>
  );
};
