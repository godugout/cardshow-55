
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardEffectsLayer } from './CardEffectsLayer';
import { EnhancedCardBack } from './EnhancedCardBack';

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
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number;
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
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = 100,
}) => {
  // SurfaceTexture is never rendered on the back. Add a debug warning ONLY if present.
  if (SurfaceTexture) {
    console.warn('[CardBackContainer] SurfaceTexture was passed to the back, which is unintended. Back ignores images.');
  }

  console.log('🔮 CardBackContainer: Enhanced effects active:', Object.keys(effectValues));

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        opacity: 1,
        zIndex: 15,
        backfaceVisibility: 'hidden',
        ...frameStyles,
        pointerEvents: 'auto',
      }}
      data-visibility={'visible'}
      data-back-rotation={rotation.y.toFixed(1)}
    >
      {/* Enhanced CRD Card Back with Studio Effects */}
      <EnhancedCardBack
        effectValues={effectValues}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
        mousePosition={mousePosition}
        isHovering={isHovering}
        rotation={rotation}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
      />

      {/* Additional Effects Layer */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={[overallBrightness]}
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effectValues}
        interactiveLighting={interactiveLighting}
      />
    </div>
  );
};
