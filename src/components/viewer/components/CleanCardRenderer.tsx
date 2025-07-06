import React from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { BaseCard } from './base/BaseCard';
import { EffectsLayer } from './layers/EffectsLayer';
import { AnimationLayer } from './layers/AnimationLayer';
import { InteractionLayer } from './layers/InteractionLayer';

interface CleanCardRendererProps {
  card: CardData;
  effectValues: EffectValues;
  showEffects: boolean;
  rotation: { x: number; y: number };
  zoom: number;
  isHovering: boolean;
  isDragging: boolean;
  autoRotate: boolean;
  interactiveLighting?: boolean;
  mousePosition: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
}

/**
 * Clean card renderer using layered architecture
 * Each layer is completely independent and doesn't contaminate others
 */
export const CleanCardRenderer: React.FC<CleanCardRendererProps> = ({
  card,
  effectValues,
  showEffects,
  rotation,
  zoom,
  isHovering,
  isDragging,
  autoRotate,
  interactiveLighting,
  mousePosition,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  return (
    <InteractionLayer
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <AnimationLayer
        rotation={rotation}
        zoom={zoom}
        isHovering={isHovering}
        isDragging={isDragging}
        autoRotate={autoRotate}
      >
        <BaseCard card={card}>
          <EffectsLayer
            effectValues={effectValues}
            showEffects={showEffects}
            interactiveLighting={interactiveLighting}
            mousePosition={mousePosition}
          />
        </BaseCard>
      </AnimationLayer>
    </InteractionLayer>
  );
};