
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

  // Enhanced debugging for card back rendering
  console.log('🃏 CardBackContainer: Rendering with:', {
    showEffects,
    effectValues,
    selectedMaterial: selectedMaterial.name,
    materialBackground: selectedMaterial.background,
    materialBorder: selectedMaterial.borderColor,
    rotationY: rotation.y.toFixed(1),
    isVisible: rotation.y > 90 && rotation.y < 270
  });

  // SurfaceTexture is never rendered on the back. Add a debug warning ONLY if present.
  if (SurfaceTexture) {
    console.warn('[CardBackContainer] SurfaceTexture was passed to the back, which is unintended. Back ignores images.');
  }

  // Count active effects for debugging
  const activeEffectsCount = Object.values(effectValues || {}).filter(effect => {
    const intensity = effect.intensity;
    return typeof intensity === 'number' && intensity > 0;
  }).length;

  console.log('🃏 CardBackContainer: Active effects count:', activeEffectsCount);

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        opacity: 1,
        zIndex: 15,
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
      }}
      data-material={selectedMaterial.id}
      data-material-name={selectedMaterial.name}
      data-visibility={'visible'}
      data-back-rotation={rotation.y.toFixed(1)}
      data-active-effects={activeEffectsCount}
    >
      {/* Effects, overlays, and logo only! */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={[50]}
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effectValues}
        interactiveLighting={interactiveLighting}
      />

      <CardBackMaterialOverlay selectedMaterial={selectedMaterial} />

      <CardBackLogo
        selectedMaterial={selectedMaterial}
        isHovering={isHovering}
        mousePosition={mousePosition}
        interactiveLighting={interactiveLighting}
      />

      <CardBackInteractiveLighting
        selectedMaterial={selectedMaterial}
        mousePosition={mousePosition}
        isHovering={isHovering}
        interactiveLighting={interactiveLighting}
      />

      {/* Debug indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-1 rounded pointer-events-none">
          {selectedMaterial.name} | Effects: {activeEffectsCount}
        </div>
      )}
    </div>
  );
};
