
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';
import type { CardData } from '@/hooks/useCardEditor';
import { CardBackContent } from './card-back/CardBackContent';
import { CardBackOverlays } from './card-back/CardBackOverlays';
import { getDynamicFrameStyles } from './card-back/CardBackMaterialStyles';

interface CardBackContainerProps {
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  getFaceVisibility?: (isFront: boolean) => React.CSSProperties;
  card?: CardData;
}

export const CardBackContainer: React.FC<CardBackContainerProps> = ({
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
  getFaceVisibility,
  card
}) => {
  // Get dynamic material based on current effects
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);
  
  // Use physics-based visibility when available, but ensure back face is properly positioned
  const faceStyles = getFaceVisibility ? getFaceVisibility(false) : { opacity: 1, zIndex: 20 };

  // Debug logging
  console.log('CardBackContainer - isFlipped:', isFlipped, 'faceStyles:', faceStyles);

  // Create dynamic frame styles combining base styles with material properties
  const dynamicFrameStyles = getDynamicFrameStyles(frameStyles, selectedMaterial);

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        ...dynamicFrameStyles,
        ...faceStyles,
        transform: 'rotateY(180deg)',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
      data-face="back"
      data-material={selectedMaterial.id}
      data-material-name={selectedMaterial.name}
    >
      {/* Back Effects Layer */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={[50]}
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effectValues}
        interactiveLighting={interactiveLighting}
      />

      {/* Surface Texture on Back */}
      <div className="relative z-20">
        {SurfaceTexture}
      </div>

      {/* Dynamic texture and material overlays */}
      <CardBackOverlays
        selectedMaterial={selectedMaterial}
        interactiveLighting={interactiveLighting}
        isHovering={isHovering}
        mousePosition={mousePosition}
      />

      {/* Card Back Content with Enhanced Material Integration */}
      <CardBackContent
        card={card}
        selectedMaterial={selectedMaterial}
      />
    </div>
  );
};
