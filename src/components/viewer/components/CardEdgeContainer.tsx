
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { calculateEdgeVisibility } from './edge/EdgeVisibilityCalculator';
import { getGasColor } from './edge/EdgeGasColorManager';
import { EdgeGlowRenderer } from './edge/EdgeGlowRenderer';
import { EdgeAnimations } from './edge/EdgeAnimations';

interface CardEdgeContainerProps {
  rotation: { x: number; y: number };
  isHovering: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  interactiveLighting?: boolean;
  zoom: number;
}

export const CardEdgeContainer: React.FC<CardEdgeContainerProps> = ({
  rotation,
  isHovering,
  effectValues,
  mousePosition,
  interactiveLighting = false,
  zoom
}) => {
  const { rightOpacity, leftOpacity, isVisible } = calculateEdgeVisibility(rotation);
  
  if (!isVisible) {
    return null;
  }

  const gasColor = getGasColor(effectValues);
  const intensity = isHovering && interactiveLighting ? 1.3 : 1;
  const edgeThickness = Math.max(4, 8 * zoom);

  return (
    <>
      {/* Right Edge Glow */}
      {rightOpacity > 0.1 && (
        <EdgeGlowRenderer
          side="right"
          opacity={rightOpacity}
          gasColor={gasColor}
          intensity={intensity}
          edgeThickness={edgeThickness}
          effectValues={effectValues}
          isHovering={isHovering}
        />
      )}

      {/* Left Edge Glow */}
      {leftOpacity > 0.1 && (
        <EdgeGlowRenderer
          side="left"
          opacity={leftOpacity}
          gasColor={gasColor}
          intensity={intensity}
          edgeThickness={edgeThickness}
          effectValues={effectValues}
          isHovering={isHovering}
        />
      )}

      <EdgeAnimations />
    </>
  );
};
