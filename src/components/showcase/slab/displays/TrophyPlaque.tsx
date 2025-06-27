
import React from 'react';
import * as THREE from 'three';

interface TrophyPlaqueProps {
  cardDimensions: [number, number, number];
  cardPosition: [number, number, number];
  card: any;
  exploded: boolean;
  layersCount: number;
  woodType?: 'oak' | 'walnut' | 'cherry' | 'mahogany';
  engraving?: string;
}

export const TrophyPlaque: React.FC<TrophyPlaqueProps> = ({
  cardDimensions,
  cardPosition,
  card,
  exploded,
  layersCount,
  woodType = 'walnut',
  engraving = 'PREMIUM COLLECTION'
}) => {
  const [cardWidth, cardHeight] = cardDimensions;
  const baseWidth = cardWidth + 1.0;
  const baseHeight = cardHeight + 0.8;
  const baseThickness = 0.4;
  const spacing = exploded ? layersCount * 0.5 : 0;

  // Wood colors based on type
  const woodColors = {
    oak: '#D2B48C',
    walnut: '#8B4513',
    cherry: '#A0522D',
    mahogany: '#654321'
  };

  return (
    <group>
      {/* Wooden Base */}
      <mesh position={[0, -cardHeight/2 - 0.3, cardPosition[2] - spacing]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth, baseThickness, baseHeight]} />
        <meshPhysicalMaterial
          color={woodColors[woodType]}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Glass Dome */}
      <mesh position={[0, cardHeight/4, cardPosition[2] + spacing]} castShadow receiveShadow>
        <sphereGeometry args={[Math.max(cardWidth, cardHeight) * 0.6, 32, 16]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          roughness={0.0}
          metalness={0.0}
          transmission={0.95}
        />
      </mesh>

      {/* Nameplate */}
      <mesh position={[0, -cardHeight/2 - 0.1, cardPosition[2] + 0.21]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth * 0.6, 0.05, 0.2]} />
        <meshPhysicalMaterial
          color="#FFD700"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};
