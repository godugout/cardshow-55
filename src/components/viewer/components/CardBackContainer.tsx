
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
  
  // Use physics-based visibility when available, but ensure back face is properly positioned
  const faceStyles = getFaceVisibility ? getFaceVisibility(false) : { opacity: 1, zIndex: 20 };

  const handleLogoClick = () => {
    console.log('🎉 Logo clicked! Adding some magic...');
  };

  // Debug logging
  console.log('CardBackContainer - isFlipped:', isFlipped, 'faceStyles:', faceStyles);

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

  // Material-aware text styling - Enhanced for better blending
  const getTextStyles = (materialId: string) => {
    switch (materialId) {
      case 'chrome':
      case 'gold':
        // Etched/embossed metallic effect - deeper integration
        return {
          textShadow: `
            inset 0 2px 4px rgba(0, 0, 0, 0.8),
            inset 0 -1px 2px rgba(255, 255, 255, 0.1),
            0 1px 0 rgba(255, 255, 255, 0.05)
          `,
          color: 'rgba(255, 255, 255, 0.4)',
          fontWeight: '600',
          letterSpacing: '0.5px',
          filter: 'contrast(0.8) brightness(0.9)'
        };
      
      case 'vintage':
        // Stamped/pressed paper effect - more subtle
        return {
          textShadow: `
            inset 0 1px 3px rgba(0, 0, 0, 0.6),
            0 1px 0 rgba(139, 69, 19, 0.2)
          `,
          color: 'rgba(139, 69, 19, 0.6)',
          fontWeight: '500',
          letterSpacing: '0.3px',
          filter: 'sepia(0.3) contrast(0.9)'
        };
      
      case 'crystal':
      case 'ice':
        // Glass/crystal with holographic overlay - very subtle
        return {
          textShadow: `
            0 0 8px rgba(148, 163, 184, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.1)
          `,
          color: 'rgba(255, 255, 255, 0.3)',
          fontWeight: '400',
          letterSpacing: '0.8px',
          filter: 'blur(0.5px) brightness(1.1)'
        };
      
      default:
        // Default subtle styling
        return {
          textShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
          color: 'rgba(255, 255, 255, 0.5)',
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

      {/* Card Back Content with Enhanced Material Integration */}
      <div className="relative h-full flex flex-col justify-between p-6 z-30">
        {/* Top Section - Very Subtle Card Info */}
        <div className="text-center">
          <div 
            className="rounded-lg p-3 border border-white border-opacity-5"
            style={{
              background: selectedMaterial.id === 'crystal' || selectedMaterial.id === 'ice' 
                ? 'rgba(255, 255, 255, 0.02)' 
                : 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(2px)'
            }}
          >
            <h3 
              className="text-xs font-medium mb-1"
              style={{...textStyles, opacity: 0.4, fontSize: '0.65rem'}}
            >
              Card Details
            </h3>
            {card && (
              <>
                <p 
                  className="text-xs mb-1"
                  style={{...textStyles, fontSize: '0.6rem', opacity: 0.3}}
                >
                  {card.title}
                </p>
                {card.rarity && (
                  <p 
                    className="text-xs uppercase tracking-wide"
                    style={{...textStyles, fontSize: '0.55rem', opacity: 0.25}}
                  >
                    {card.rarity}
                  </p>
                )}
                {card.creator_attribution?.creator_name && (
                  <p 
                    className="text-xs"
                    style={{...textStyles, fontSize: '0.5rem', opacity: 0.2}}
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
                    rgba(255, 107, 107, 0.08) 0%, 
                    rgba(78, 205, 196, 0.08) 25%, 
                    rgba(69, 183, 209, 0.08) 50%, 
                    rgba(150, 206, 180, 0.08) 75%, 
                    rgba(255, 234, 167, 0.08) 100%
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

        {/* Bottom Section - Very Subtle Additional Info */}
        <div className="text-center">
          <div 
            className="rounded-lg p-2 border border-white border-opacity-3"
            style={{
              background: selectedMaterial.id === 'crystal' || selectedMaterial.id === 'ice' 
                ? 'rgba(255, 255, 255, 0.015)' 
                : 'rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(1px)'
            }}
          >
            <p 
              className="text-xs"
              style={{...textStyles, fontSize: '0.55rem', opacity: 0.2}}
            >
              Collectible Trading Card
            </p>
            <p 
              className="text-xs"
              style={{...textStyles, fontSize: '0.5rem', opacity: 0.15}}
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
                  ${selectedMaterial.borderColor.replace(')', ', 0.06)')} 0%,
                  rgba(255, 255, 255, 0.02) 30%,
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
