
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
  
  // Use simplified face visibility
  const faceStyles = getFaceVisibility ? getFaceVisibility(false) : { 
    opacity: isFlipped ? 1 : 0, 
    zIndex: isFlipped ? 30 : 10,
    pointerEvents: (isFlipped ? 'auto' : 'none') as React.CSSProperties['pointerEvents']
  };

  // Enhanced debug logging for back image
  console.log('🖼️ CardBackContainer - ENHANCED Back Logo Debug:', {
    isFlipped,
    faceStyles,
    selectedMaterial: selectedMaterial.name,
    logoImagePath: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    shouldBeVisible: isFlipped ? 'YES - BACK SHOULD SHOW' : 'NO - FRONT SHOULD SHOW'
  });

  // Create dynamic frame styles combining base styles with material properties
  const dynamicFrameStyles = getDynamicFrameStyles(frameStyles, selectedMaterial);

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        ...dynamicFrameStyles,
        ...faceStyles,
        transform: 'rotateY(180deg)', // Back face - 180 degree rotation
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
      data-face="back"
      data-material={selectedMaterial.id}
      data-material-name={selectedMaterial.name}
      data-visibility={faceStyles.opacity}
    >
      {/* Dark Pattern Background Base */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)
          `,
          backgroundColor: '#0a0a0a'
        }}
      />

      {/* Back Effects Layer */}
      <div className="absolute inset-0 z-20">
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
        <div className="relative">
          {SurfaceTexture}
        </div>
      </div>

      {/* Dynamic texture and material overlays */}
      <div className="absolute inset-0 z-30">
        <CardBackOverlays
          selectedMaterial={selectedMaterial}
          interactiveLighting={interactiveLighting}
          isHovering={isHovering}
          mousePosition={mousePosition}
        />
      </div>

      {/* Centered CRD Logo - MAXIMUM Z-INDEX */}
      <div className="absolute inset-0 flex items-center justify-center z-[100]">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
            alt="CRD Logo" 
            className="w-48 h-auto opacity-90"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              pointerEvents: 'none',
              position: 'absolute',
              zIndex: 1000
            }}
            draggable={false}
            onLoad={() => {
              console.log('✅ SUCCESS: CRD logo loaded successfully on card back');
              console.log('✅ Back face should be visible when isFlipped =', isFlipped);
            }}
            onError={(e) => {
              console.error('❌ CRITICAL ERROR: Error loading CRD logo on card back:', e);
            }}
          />
          {/* Debug overlay to confirm back is showing */}
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-[1001]">
            BACK: CRD Logo
          </div>
        </div>
      </div>

      {/* Card Back Content with Enhanced Material Integration */}
      <div className="absolute inset-0 z-40">
        <CardBackContent
          card={card}
          selectedMaterial={selectedMaterial}
        />
      </div>
    </div>
  );
};
