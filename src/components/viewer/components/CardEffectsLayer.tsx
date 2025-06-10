
import React from 'react';
import type { MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { EnhancedInteractiveLightingLayer } from './EnhancedInteractiveLightingLayer';
import { GoldEffect } from './effects/GoldEffect';
import { AuroraEffect } from './effects/AuroraEffect';
import { CrystalEffect } from './effects/CrystalEffect';
import { VintageEffect } from './effects/VintageEffect';
import { MetallicEffects } from './effects/MetallicEffects';
import { PrismaticEffects } from './effects/PrismaticEffects';
import { FoilSprayEffect } from './effects/FoilSprayEffect';
import { IceEffect } from './effects/IceEffect';
import { LunarEffect } from './effects/LunarEffect';
import { WavesEffect } from './effects/WavesEffect';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  materialSettings?: MaterialSettings;
  interactiveLighting?: boolean;
  effectValues?: EffectValues;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  mousePosition,
  physicalEffectStyles,
  materialSettings,
  interactiveLighting = false,
  effectValues
}) => {
  if (!showEffects || !effectValues) return null;

  // Get individual effect intensities from effectValues (simple numbers)
  const holographicIntensity = effectValues.holographic || 0;
  const chromeIntensity = effectValues.chrome || 0;
  const brushedmetalIntensity = effectValues.brushedmetal || 0;
  const crystalIntensity = effectValues.crystal || 0;
  const vintageIntensity = effectValues.vintage || 0;
  const interferenceIntensity = effectValues.interference || 0;
  const prizemIntensity = effectValues.prizm || 0;
  const foilsprayIntensity = effectValues.foilspray || 0;
  const goldIntensity = effectValues.gold || 0;
  const auroraIntensity = effectValues.aurora || 0;
  const wavesIntensity = effectValues.waves || 0;
  
  return (
    <>
      {/* Enhanced Interactive Lighting Layer */}
      {interactiveLighting && (
        <EnhancedInteractiveLightingLayer
          effectValues={effectValues}
          mousePosition={mousePosition}
          isHovering={isHovering}
          interactiveLightingEnabled={interactiveLighting}
        />
      )}

      {/* Waves Effect - Base layer for movement and wobble */}
      <WavesEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Gold Effect */}
      <GoldEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Aurora Effect - Enhanced with wave movement */}
      <AuroraEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Crystal Effect - Enhanced with Diamond Glitter */}
      <CrystalEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Vintage Effect - Realistic Cardstock Paper */}
      <VintageEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Chrome & Brushed Metal Effects */}
      <MetallicEffects
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Prismatic Effects (Holographic, Interference, Prizm) */}
      <PrismaticEffects
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Foil Spray Effect */}
      <FoilSprayEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Ice Effect - Natural ice with scratches */}
      <IceEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Lunar Effect - Moon dust and retro space aesthetic */}
      <LunarEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Calculate overall intensity for edge enhancement */}
      {(() => {
        const totalIntensity = holographicIntensity + chromeIntensity + brushedmetalIntensity + 
                              crystalIntensity + vintageIntensity + interferenceIntensity + 
                              prizemIntensity + foilsprayIntensity + goldIntensity + auroraIntensity + wavesIntensity;
        const normalizedIntensity = Math.min(totalIntensity / 100, 1);
        
        return totalIntensity > 0 ? (
          <div
            className="absolute inset-0 z-26 rounded-xl"
            style={{
              boxShadow: `
                inset 0 0 15px rgba(255, 255, 255, ${normalizedIntensity * 0.05}),
                inset 0 0 5px rgba(255, 255, 255, ${normalizedIntensity * 0.1})
              `,
              opacity: 0.3
            }}
          />
        ) : null;
      })()}
    </>
  );
};
