
import React from 'react';
import * as THREE from 'three';

interface ProtectiveCaseProps {
  cardDimensions: [number, number, number];
  cardPosition: [number, number, number];
  card: any;
  exploded: boolean;
  layersCount: number;
  caseType: 'top-loader' | 'graded-slab' | 'basic';
  caseColor?: string;
  tint?: string;
  tintOpacity?: number;
  certNumber?: string;
}

export const ProtectiveCase: React.FC<ProtectiveCaseProps> = ({
  cardDimensions,
  cardPosition,
  card,
  exploded,
  layersCount,
  caseType,
  caseColor = '#ffffff',
  tint = '#ffffff',
  tintOpacity = 0.1,
  certNumber
}) => {
  const [cardWidth, cardHeight, cardDepth] = cardDimensions;
  const caseThickness = 0.05;
  const spacing = exploded ? layersCount * 0.3 : 0;

  return (
    <group>
      {/* Front Case */}
      <mesh position={[0, 0, cardPosition[2] + cardDepth/2 + caseThickness + spacing]} castShadow receiveShadow>
        <boxGeometry args={[cardWidth + 0.1, cardHeight + 0.1, caseThickness]} />
        <meshPhysicalMaterial
          color={caseColor}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Back Case */}
      <mesh position={[0, 0, cardPosition[2] - cardDepth/2 - caseThickness - spacing]} castShadow receiveShadow>
        <boxGeometry args={[cardWidth + 0.1, cardHeight + 0.1, caseThickness]} />
        <meshPhysicalMaterial
          color={caseColor}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Certification Label (for graded slabs) */}
      {caseType === 'graded-slab' && certNumber && (
        <mesh position={[0, -cardHeight/2 + 0.2, cardPosition[2] + cardDepth/2 + caseThickness + 0.01 + spacing]}>
          <planeGeometry args={[0.8, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  );
};
