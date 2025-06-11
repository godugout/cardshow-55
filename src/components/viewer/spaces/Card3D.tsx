
import React from 'react';
import { useCardEffects } from '../hooks/useCardEffects';
import { useCard3DInteractions } from './hooks/useCard3DInteractions';
import { Card3DGroup } from './components/Card3DGroup';
import type { SpaceControls } from './types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface Card3DProps {
  card: Simple3DCard;
  controls: SpaceControls;
  effectValues?: EffectValues;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  interactiveLighting?: boolean;
  onClick?: () => void;
}

// Helper function to convert simple card to full CardData format
const adaptCardForViewer = (card: Simple3DCard) => ({
  id: card.id,
  title: card.title,
  description: '',
  rarity: 'common' as const,
  tags: [],
  image_url: card.image_url || '/placeholder-card.jpg',
  design_metadata: {},
  visibility: 'public' as const,
  creator_attribution: {
    creator_name: 'Unknown',
    collaboration_type: 'solo' as const
  },
  publishing_options: {
    marketplace_listing: false,
    crd_catalog_inclusion: false,
    print_available: false,
    pricing: { currency: 'USD' },
    distribution: { limited_edition: false }
  }
});

export const Card3D: React.FC<Card3DProps> = ({ 
  card, 
  controls, 
  effectValues = {},
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = [100],
  interactiveLighting = false,
  onClick 
}) => {
  const zoom = 1;

  // Convert simple card to full CardData format for useCardEffects
  const adaptedCard = React.useMemo(() => adaptCardForViewer(card), [card]);

  // Use 3D interactions hook
  const {
    groupRef,
    isHovering,
    mousePosition,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleCardFlip
  } = useCard3DInteractions({ controls, onClick });

  // Use card effects if we have the required props
  const cardEffects = (selectedScene && selectedLighting && materialSettings) ? useCardEffects({
    card: adaptedCard,
    effectValues,
    mousePosition,
    showEffects: true,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation: { x: 0, y: 0 }, // Rotation is handled by Three.js now
    isHovering
  }) : null;

  return (
    <Card3DGroup
      card={card}
      groupRef={groupRef}
      isHovering={isHovering}
      effectValues={effectValues}
      mousePosition={mousePosition}
      isDragging={isDragging}
      interactiveLighting={interactiveLighting}
      cardEffects={cardEffects}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onCardFlip={handleCardFlip}
    />
  );
};
