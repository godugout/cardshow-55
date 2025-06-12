
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { SimplifiedCardContainer3D } from './SimplifiedCardContainer3D';

interface CardContainer3DProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting: boolean;
  onClick: () => void;
}

export const CardContainer3D: React.FC<CardContainer3DProps> = (props) => {
  // Remove onClick from props passed to SimplifiedCardContainer3D since it doesn't need it
  const { onClick, ...containerProps } = props;
  
  return <SimplifiedCardContainer3D {...containerProps} />;
};
