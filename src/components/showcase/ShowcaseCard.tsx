
import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ProtectiveCase } from './slab/displays/ProtectiveCase';
import { TrophyPlaque } from './slab/displays/TrophyPlaque';
import { MuseumDisplay } from './slab/displays/MuseumDisplay';
import type { CardData } from '@/hooks/useCardEditor';
import type { SlabPresetConfig } from './SlabPresets';

interface ShowcaseCardProps {
  card: CardData;
  slabConfig: SlabPresetConfig;
  exploded: boolean;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  card,
  slabConfig,
  exploded
}) => {
  const texture = useTexture(card.image_url || '/placeholder-card.jpg');
  
  // Standard trading card dimensions
  const cardDimensions: [number, number, number] = [2.5, 3.5, 0.02];
  const cardPosition: [number, number, number] = [0, 0, 0];

  // Create card mesh
  const CardMesh = () => (
    <mesh position={cardPosition} castShadow receiveShadow>
      <boxGeometry args={cardDimensions} />
      <meshStandardMaterial
        map={texture}
        roughness={0.3}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );

  // Render appropriate display based on slab config
  const renderDisplay = () => {
    switch (slabConfig.type) {
      case 'toploader':
      case 'onestouch':
      case 'graded':
        return (
          <ProtectiveCase
            cardDimensions={cardDimensions}
            cardPosition={cardPosition}
            card={card}
            exploded={exploded}
            layersCount={0}
            caseType={slabConfig.type === 'toploader' ? 'top-loader' : slabConfig.type === 'graded' ? 'graded-slab' : 'basic'}
            caseColor={slabConfig.caseColor || '#000000'}
            tint={slabConfig.tint}
            tintOpacity={slabConfig.tintOpacity}
            certNumber={slabConfig.certNumber}
          />
        );
      
      case 'trophy':
        return (
          <TrophyPlaque
            cardDimensions={cardDimensions}
            cardPosition={cardPosition}
            card={card}
            exploded={exploded}
            layersCount={0}
            woodType={slabConfig.woodType}
            engraving={slabConfig.engraving}
          />
        );
      
      case 'museum':
        return (
          <MuseumDisplay
            cardDimensions={cardDimensions}
            cardPosition={cardPosition}
            card={card}
            exploded={exploded}
            layersCount={0}
            autoRotate={slabConfig.autoRotate}
            standMaterial={slabConfig.standMaterial}
          />
        );
      
      default:
        return <CardMesh />;
    }
  };

  return (
    <group>
      {renderDisplay()}
    </group>
  );
};
