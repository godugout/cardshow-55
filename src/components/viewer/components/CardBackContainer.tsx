import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';
import { CardBackMaterialOverlay } from './CardBackMaterialOverlay';
import { CardBackLogo } from './CardBackLogo';
import { CardBackInteractiveLighting } from './CardBackInteractiveLighting';

interface CardBackContainerProps {
  rotation: { x: number; y: number };
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
}

export const CardBackContainer: React.FC<CardBackContainerProps> = ({
  rotation,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
}) => {
  // Get dynamic material based on current effects
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);

  // SurfaceTexture is never rendered on the back. Add a debug warning ONLY if present.
  if (SurfaceTexture) {
    console.warn('[CardBackContainer] SurfaceTexture was passed to the back, which is unintended. Back ignores images.');
  }

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        opacity: 1,
        zIndex: 1,
        backfaceVisibility: 'hidden',
        background: selectedMaterial.background,
        border: `2px solid ${selectedMaterial.borderColor}`,
        ...(selectedMaterial.blur && {
          backdropFilter: `blur(${selectedMaterial.blur}px)`
        }),
        boxShadow: `
          0 0 30px ${selectedMaterial.borderColor},
          inset 0 0 20px rgba(255, 255, 255, 0.1)
        `,
        ...frameStyles,
        pointerEvents: 'auto',
        backgroundColor: '#1a1a1a' // Solid dark background
      }}
      data-material={selectedMaterial.id}
      data-material-name={selectedMaterial.name}
      data-visibility={'visible'}
      data-back-rotation={rotation.y.toFixed(1)}
    >
      {/* Card Back Material Overlay (z-10) */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <CardBackMaterialOverlay selectedMaterial={selectedMaterial} />
      </div>

      {/* CRD Logo - Centered (z-20) */}
      <div className="absolute inset-0" style={{ zIndex: 20 }}>
        <CardBackLogo
          selectedMaterial={selectedMaterial}
          isHovering={isHovering}
          mousePosition={mousePosition}
          interactiveLighting={interactiveLighting}
        />
      </div>

      {/* Interactive Lighting for Back (z-30) */}
      <div className="absolute inset-0" style={{ zIndex: 30 }}>
        <CardBackInteractiveLighting
          selectedMaterial={selectedMaterial}
          mousePosition={mousePosition}
          isHovering={isHovering}
          interactiveLighting={interactiveLighting}
        />
      </div>
    </div>
  );
};
