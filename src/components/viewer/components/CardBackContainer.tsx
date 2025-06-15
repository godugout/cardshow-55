
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';
import { CardBackVisibilityManager } from './CardBackVisibilityManager';
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
  solidCardTransition?: boolean;
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
  solidCardTransition = false,
}) => {
  // Get dynamic material based on current effects
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);
  
  console.log('🎨 Card Back - Material:', selectedMaterial.name);

  return (
    <CardBackVisibilityManager rotation={rotation} solidCardTransition={solidCardTransition}>
      {({ opacity, zIndex }) => (
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            opacity,
            zIndex,
            transition: 'opacity 0.3s ease, z-index 0.1s ease',
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
            ...frameStyles
          }}
          data-material={selectedMaterial.id}
          data-material-name={selectedMaterial.name}
          data-visibility={opacity > 0.1 ? 'visible' : 'hidden'}
          data-back-rotation={rotation.y.toFixed(1)}
        >
          {/* Back Effects Layer */}
          <CardEffectsLayer
            showEffects={showEffects}
            isHovering={isHovering}
            effectIntensity={[50]} // Keep for backward compatibility
            mousePosition={mousePosition}
            physicalEffectStyles={enhancedEffectStyles}
            effectValues={effectValues}
            interactiveLighting={interactiveLighting}
          />

          {/* Surface Texture on Back */}
          <div className="relative z-20" style={{ backfaceVisibility: 'hidden' }}>
            {SurfaceTexture}
          </div>

          {/* Material Overlays */}
          <CardBackMaterialOverlay selectedMaterial={selectedMaterial} />

          {/* Enhanced CRD Logo */}
          <CardBackLogo
            selectedMaterial={selectedMaterial}
            isHovering={isHovering}
            mousePosition={mousePosition}
            interactiveLighting={interactiveLighting}
          />

          {/* Interactive Lighting */}
          <CardBackInteractiveLighting
            selectedMaterial={selectedMaterial}
            mousePosition={mousePosition}
            isHovering={isHovering}
            interactiveLighting={interactiveLighting}
          />
        </div>
      )}
    </CardBackVisibilityManager>
  );
};
