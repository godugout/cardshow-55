
import React from 'react';
import { Html } from '@react-three/drei';
import { True3DCardContainer } from '../../components/True3DCardContainer';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface Card3DFaceProps {
  card: Simple3DCard;
  isBack?: boolean;
  isHovering: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  cardEffects?: any;
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseUp: (e: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCardFlip: () => void;
  rotation?: { x: number; y: number };
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

export const Card3DFace: React.FC<Card3DFaceProps> = ({
  card,
  isBack = false,
  isHovering,
  effectValues,
  mousePosition,
  isDragging,
  interactiveLighting = false,
  cardEffects,
  rotation = { x: 0, y: 0 },
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
  onCardFlip
}) => {
  const adaptedCard = React.useMemo(() => adaptCardForViewer(card), [card]);
  
  const position: [number, number, number] = [0, 0, 0];

  return (
    <Html
      transform
      occlude
      position={position}
      distanceFactor={1}
      style={{
        width: '400px',
        height: '560px',
        pointerEvents: 'auto'
      }}
    >
      <div 
        style={{ 
          width: '400px', 
          height: '560px',
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: 'scale(0.8)',
          transformOrigin: 'center center'
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onCardFlip}
      >
        <True3DCardContainer
          card={adaptedCard}
          isHovering={isHovering}
          showEffects={true}
          effectValues={effectValues}
          mousePosition={mousePosition}
          rotation={rotation}
          isDragging={isDragging}
          frameStyles={cardEffects?.getFrameStyles() || { transition: isDragging ? 'none' : 'all 0.3s ease' }}
          enhancedEffectStyles={cardEffects?.getEnhancedEffectStyles() || {}}
          SurfaceTexture={cardEffects?.SurfaceTexture || <div />}
          interactiveLighting={interactiveLighting}
        />
      </div>
    </Html>
  );
};
