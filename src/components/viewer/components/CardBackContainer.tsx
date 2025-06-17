
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
    >
      {/* IMPORTANT: No card image on the back - only effects and logo */}
      
      {/* Effects Layer */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={[50]}
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effectValues}
        interactiveLighting={interactiveLighting}
      />

      {/* Material Overlay */}
      <CardBackMaterialOverlay selectedMaterial={selectedMaterial} />

      {/* CRD Logo - Center of back */}
      <div className="absolute inset-0 flex items-center justify-center z-40">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-48 h-auto opacity-90"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
        />
      </div>

      {/* Interactive Lighting */}
      <CardBackInteractiveLighting
        selectedMaterial={selectedMaterial}
        mousePosition={mousePosition}
        isHovering={isHovering}
        interactiveLighting={interactiveLighting}
      />
    </div>
  );
};
