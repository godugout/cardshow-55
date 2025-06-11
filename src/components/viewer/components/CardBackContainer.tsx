
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { InteractiveLogo } from './InteractiveLogo';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';
import type { CardData } from '@/hooks/useCardEditor';

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
  
  // Use physics-based visibility when available
  const faceStyles = getFaceVisibility ? getFaceVisibility(false) : {};

  const handleLogoClick = () => {
    console.log('🎉 Logo clicked! Adding some magic...');
  };

  // Create dynamic frame styles combining base styles with material properties
  const dynamicFrameStyles = {
    ...frameStyles,
    background: selectedMaterial.background,
    border: `2px solid ${selectedMaterial.borderColor}`,
    opacity: selectedMaterial.opacity,
    ...(selectedMaterial.blur && {
      backdropFilter: `blur(${selectedMaterial.blur}px)`
    }),
    boxShadow: `
      0 0 30px ${selectedMaterial.borderColor},
      inset 0 0 20px rgba(255, 255, 255, 0.1)
    `
  };

  // Material-aware text styling
  const getTextStyles = (materialId: string) => {
    switch (materialId) {
      case 'chrome':
      case 'gold':
        // Etched/embossed metallic effect
        return {
          textShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 1px 2px rgba(0, 0, 0, 0.8),
            0 0 5px rgba(0, 0, 0, 0.5)
          `,
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: '600',
          letterSpacing: '0.5px'
        };
      
      case 'vintage':
        // Stamped/pressed paper effect
        return {
          textShadow: `
            0 1px 0 rgba(0, 0, 0, 0.9),
            0 2px 4px rgba(0, 0, 0, 0.6)
          `,
          color: 'rgba(188, 170, 164, 0.8)',
          fontWeight: '500',
          letterSpacing: '0.3px'
        };
      
      case 'crystal':
      case 'ice':
        // Glass/crystal with holographic overlay
        return {
          textShadow: `
            0 0 10px rgba(148, 163, 184, 0.6),
            0 1px 2px rgba(0, 0, 0, 0.4)
          `,
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: '400',
          letterSpacing: '0.8px'
        };
      
      default:
        // Default subtle styling
        return {
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: '500'
        };
    }
  };

  const textStyles = getTextStyles(selectedMaterial.id);

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        ...dynamicFrameStyles,
        ...faceStyles,
        transform: 'rotateY(180deg)',
        transformStyle: 'preserve-3d'
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

      {/* Enhanced dynamic texture overlay */}
      {selectedMaterial.texture === 'noise' && (
        <div 
          className="absolute inset-0 z-25 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            animation: 'noise-shift 8s ease-in-out infinite alternate',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Material-specific accent overlay */}
      <div 
        className="absolute inset-0 z-26"
        style={{
          background: `radial-gradient(
            circle at 30% 30%, 
            ${selectedMaterial.borderColor} 0%, 
            transparent 40%
          ), radial-gradient(
            circle at 70% 70%, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 30%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.6,
          pointerEvents: 'none'
        }}
      />

      {/* Card Back Content with Material-Aware Styling */}
      <div className="relative h-full flex flex-col justify-between p-6 z-30">
        {/* Top Section - Card Info with Material Integration */}
        <div className="text-center">
          <div 
            className="bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-10"
            style={{
              background: selectedMaterial.id === 'crystal' || selectedMaterial.id === 'ice' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.2)'
            }}
          >
            <h3 
              className="text-sm font-semibold mb-2 opacity-60"
              style={textStyles}
            >
              Card Details
            </h3>
            {card && (
              <>
                <p 
                  className="text-xs mb-1 opacity-50"
                  style={{...textStyles, fontSize: '0.7rem'}}
                >
                  {card.title}
                </p>
                {card.rarity && (
                  <p 
                    className="text-xs mb-1 uppercase tracking-wide opacity-40"
                    style={{...textStyles, fontSize: '0.65rem'}}
                  >
                    {card.rarity}
                  </p>
                )}
                {card.creator_attribution?.creator_name && (
                  <p 
                    className="text-xs opacity-30"
                    style={{...textStyles, fontSize: '0.6rem'}}
                  >
                    Created by: {card.creator_attribution.creator_name}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Holographic sticker overlay for crystal/glass materials */}
          {(selectedMaterial.id === 'crystal' || selectedMaterial.id === 'ice') && (
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: `
                  linear-gradient(45deg, 
                    rgba(255, 107, 107, 0.1) 0%, 
                    rgba(78, 205, 196, 0.1) 25%, 
                    rgba(69, 183, 209, 0.1) 50%, 
                    rgba(150, 206, 180, 0.1) 75%, 
                    rgba(255, 234, 167, 0.1) 100%
                  )
                `,
                animation: 'holographic-shift 4s ease-in-out infinite',
                mixBlendMode: 'overlay'
              }}
            />
          )}
        </div>

        {/* Center Section - CRD Logo (Primary Focus) */}
        <div className="flex-1 flex items-center justify-center">
          <InteractiveLogo
            logoUrl="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png"
            alt="CRD Logo"
            onLogoClick={handleLogoClick}
          />
        </div>

        {/* Bottom Section - Minimal Additional Info */}
        <div className="text-center">
          <div 
            className="bg-black bg-opacity-15 backdrop-blur-sm rounded-lg p-2 border border-white border-opacity-5"
            style={{
              background: selectedMaterial.id === 'crystal' || selectedMaterial.id === 'ice' 
                ? 'rgba(255, 255, 255, 0.03)' 
                : 'rgba(0, 0, 0, 0.15)'
            }}
          >
            <p 
              className="text-xs opacity-30"
              style={{...textStyles, fontSize: '0.6rem'}}
            >
              Collectible Trading Card
            </p>
            <p 
              className="text-xs opacity-20"
              style={{...textStyles, fontSize: '0.55rem'}}
            >
              CRD Platform © 2024
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Interactive Lighting with Material Awareness */}
      {interactiveLighting && isHovering && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  ${selectedMaterial.borderColor.replace(')', ', 0.08)')} 0%,
                  rgba(255, 255, 255, 0.03) 30%,
                  transparent 70%
                )
              `,
              mixBlendMode: 'overlay',
              transition: 'opacity 0.2s ease'
            }}
          />
        </div>
      )}

      {/* CSS animations */}
      <style>
        {`
          @keyframes noise-shift {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-20px, -20px); }
          }

          @keyframes holographic-shift {
            0%, 100% { 
              background-position: 0% 0%;
              opacity: 0.3;
            }
            50% { 
              background-position: 100% 100%;
              opacity: 0.6;
            }
          }
        `}
      </style>
    </div>
  );
};
