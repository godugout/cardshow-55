
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardBackMaterialOverlay } from './CardBackMaterialOverlay';
import { CardBackLogo } from './CardBackLogo';
import { CardBackInteractiveLighting } from './CardBackInteractiveLighting';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';

interface EnhancedCardBackProps {
  effectValues: EffectValues;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  rotation: { x: number; y: number };
  overallBrightness?: number;
  interactiveLighting?: boolean;
}

export const EnhancedCardBack: React.FC<EnhancedCardBackProps> = ({
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  mousePosition,
  isHovering,
  rotation,
  overallBrightness = 100,
  interactiveLighting = true
}) => {
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);

  // Calculate dynamic background based on scene and effects
  const getDynamicBackground = () => {
    if (selectedScene) {
      const baseGradient = selectedScene.gradient;
      const brightness = overallBrightness / 100;
      
      return `linear-gradient(135deg, 
        color-mix(in srgb, ${selectedMaterial.borderColor} ${brightness * 30}%, transparent),
        color-mix(in srgb, ${selectedMaterial.borderColor} ${brightness * 20}%, transparent)
      ), ${selectedMaterial.background}`;
    }
    return selectedMaterial.background;
  };

  // Generate effect-based patterns
  const getEffectPatterns = () => {
    const patterns = [];
    
    if (effectValues.holographic?.enabled) {
      patterns.push(
        <div
          key="holo-pattern"
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(138, 43, 226, 0.3) 0%, 
                transparent 50%
              ),
              linear-gradient(45deg, 
                transparent 30%, 
                rgba(255, 0, 255, 0.1) 50%, 
                transparent 70%
              )
            `,
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      );
    }

    if (effectValues.crystal?.enabled) {
      patterns.push(
        <div
          key="crystal-pattern"
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              conic-gradient(from 0deg at 50% 50%, 
                transparent, 
                rgba(148, 163, 184, 0.2), 
                transparent, 
                rgba(203, 213, 225, 0.3), 
                transparent
              )
            `,
            transform: `rotate(${rotation.y * 0.5}deg)`
          }}
        />
      );
    }

    if (effectValues.gold?.enabled) {
      patterns.push(
        <div
          key="gold-pattern"  
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse at center, 
                rgba(255, 215, 0, 0.2) 0%, 
                rgba(255, 193, 7, 0.1) 40%, 
                transparent 70%
              )
            `,
            filter: 'blur(1px)'
          }}
        />
      );
    }

    return patterns;
  };

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        background: getDynamicBackground(),
        border: `2px solid ${selectedMaterial.borderColor}`,
        boxShadow: `
          0 0 30px ${selectedMaterial.borderColor},
          inset 0 0 20px rgba(255, 255, 255, 0.1),
          inset 0 0 40px color-mix(in srgb, ${selectedMaterial.borderColor} 20%, transparent)
        `,
        backdropFilter: `blur(${selectedMaterial.blur || 2}px)`,
        transform: `perspective(1000px) rotateX(${rotation.x * 0.1}deg) rotateY(${rotation.y * 0.1}deg)`,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Effect Patterns */}
      {getEffectPatterns()}

      {/* CRD Branding Elements */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Large CRD Logo */}
        <div 
          className="text-6xl font-bold mb-8 select-none"
          style={{
            background: `linear-gradient(135deg, ${selectedMaterial.borderColor}, color-mix(in srgb, ${selectedMaterial.borderColor} 80%, white))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: selectedMaterial.logoTreatment.filter,
            opacity: selectedMaterial.logoTreatment.opacity,
            transform: `${selectedMaterial.logoTreatment.transform} perspective(500px) rotateX(${rotation.x * 0.05}deg)`,
            textShadow: `0 4px 20px color-mix(in srgb, ${selectedMaterial.borderColor} 50%, transparent)`
          }}
        >
          CRD
        </div>

        {/* Effect Status Indicators */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {Object.entries(effectValues).map(([effectKey, effect]) => {
            if (!effect || !effect.enabled || (effect.intensity || 0) < 10) return null;
            
            return (
              <div
                key={effectKey}
                className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                style={{
                  backgroundColor: `color-mix(in srgb, ${selectedMaterial.borderColor} 20%, rgba(0,0,0,0.5))`,
                  color: selectedMaterial.borderColor,
                  border: `1px solid color-mix(in srgb, ${selectedMaterial.borderColor} 40%, transparent)`,
                  boxShadow: `0 2px 10px color-mix(in srgb, ${selectedMaterial.borderColor} 30%, transparent)`
                }}
              >
                {effectKey.toUpperCase()} {effect.intensity}%
              </div>
            );
          })}
        </div>

        {/* Scene Indicator */}
        {selectedScene && (
          <div 
            className="text-sm font-medium opacity-75"
            style={{ color: selectedMaterial.borderColor }}
          >
            {selectedScene.icon} {selectedScene.name}
          </div>
        )}
      </div>

      {/* Enhanced Material Overlay */}
      <CardBackMaterialOverlay selectedMaterial={selectedMaterial} />

      {/* Enhanced Logo */}
      <CardBackLogo
        selectedMaterial={selectedMaterial}
        isHovering={isHovering}
        mousePosition={mousePosition}
        interactiveLighting={interactiveLighting}
      />

      {/* Enhanced Interactive Lighting */}
      <CardBackInteractiveLighting
        selectedMaterial={selectedMaterial}
        mousePosition={mousePosition}
        isHovering={isHovering}
        interactiveLighting={interactiveLighting}
      />

      {/* Animated Border Glow */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: `1px solid ${selectedMaterial.borderColor}`,
          opacity: isHovering ? 0.8 : 0.4,
          boxShadow: `
            inset 0 0 20px color-mix(in srgb, ${selectedMaterial.borderColor} 30%, transparent),
            0 0 40px color-mix(in srgb, ${selectedMaterial.borderColor} 20%, transparent)
          `,
          animation: interactiveLighting ? 'pulse 4s ease-in-out infinite' : 'none',
          transition: 'all 0.3s ease'
        }}
      />
    </div>
  );
};
