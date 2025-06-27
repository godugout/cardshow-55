
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MuseumDisplayProps {
  cardDimensions: [number, number, number];
  cardPosition: [number, number, number];
  card: any;
  exploded: boolean;
  layersCount: number;
  autoRotate?: boolean;
  standMaterial?: 'metal' | 'acrylic';
}

export const MuseumDisplay: React.FC<MuseumDisplayProps> = ({
  cardDimensions,
  cardPosition,
  card,
  exploded,
  layersCount,
  autoRotate = true,
  standMaterial = 'metal'
}) => {
  const rotatingGroupRef = useRef<THREE.Group>(null);
  const [cardWidth, cardHeight] = cardDimensions;
  const caseWidth = cardWidth + 0.6;
  const caseHeight = cardHeight + 0.6;
  const caseDepth = 0.6;
  const spacing = exploded ? layersCount * 0.4 : 0;

  useFrame(() => {
    if (autoRotate && rotatingGroupRef.current && !exploded) {
      rotatingGroupRef.current.rotation.y += 0.003;
    }
  });

  const standColor = standMaterial === 'metal' ? '#C0C0C0' : '#ffffff';
  const standMetalness = standMaterial === 'metal' ? 0.8 : 0.1;

  return (
    <group>
      {/* Museum Pedestal */}
      <mesh position={[0, -cardHeight/2 - 0.4, cardPosition[2]]} castShadow receiveShadow>
        <cylinderGeometry args={[Math.max(caseWidth, caseDepth) * 0.6, Math.max(caseWidth, caseDepth) * 0.6, 0.3, 32]} />
        <meshPhysicalMaterial
          color={standColor}
          roughness={0.2}
          metalness={standMetalness}
        />
      </mesh>

      <group ref={rotatingGroupRef}>
        {/* Glass Display Case */}
        <mesh position={[0, 0, cardPosition[2] + spacing]} castShadow receiveShadow>
          <boxGeometry args={[caseWidth, caseHeight, caseDepth]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.05}
            roughness={0.0}
            metalness={0.0}
            transmission={0.98}
          />
        </mesh>

        {/* Case Frame */}
        <mesh position={[0, caseHeight/2 + 0.02, cardPosition[2] + spacing]} castShadow receiveShadow>
          <boxGeometry args={[caseWidth + 0.05, 0.04, caseDepth + 0.05]} />
          <meshPhysicalMaterial
            color={standColor}
            roughness={0.2}
            metalness={standMetalness}
          />
        </mesh>
      </group>

      {/* Information Placard */}
      <mesh position={[0, -cardHeight/2 - 0.15, cardPosition[2] + caseDepth/2 + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[caseWidth * 0.8, 0.02, 0.15]} />
        <meshPhysicalMaterial
          color="#f5f5f5"
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
};
