
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { InteractiveLogo } from './InteractiveLogo';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';

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
  card?: {
    title: string;
    rarity?: string;
    description?: string;
    creator_attribution?: {
      creator_name: string;
    };
  };
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
  
  // Use physics-based visibility when available, otherwise use simple transform
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

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        ...dynamicFrameStyles,
        ...faceStyles,
        transform: getFaceVisibility ? 'rotateY(180deg)' : 'rotateY(180deg)',
        transformStyle: 'preserve-3d',
        transition: getFaceVisibility ? 'opacity 0.1s ease' : 'transform 0.3s ease'
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

      {/* Card Back Content */}
      <div className="relative h-full flex flex-col justify-between p-6 z-30">
        {/* Top Section - Card Info */}
        <div className="text-center">
          <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-4 text-white">
            <h3 className="text-lg font-bold mb-2">Card Details</h3>
            {card && (
              <>
                <p className="text-sm mb-1">Title: {card.title}</p>
                {card.rarity && (
                  <p className="text-sm mb-1">Rarity: <span className="uppercase tracking-wide">{card.rarity}</span></p>
                )}
                {card.creator_attribution?.creator_name && (
                  <p className="text-xs opacity-75">Created by: {card.creator_attribution.creator_name}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Center Section - CRD Logo */}
        <div className="flex-1 flex items-center justify-center">
          <InteractiveLogo
            logoUrl="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png"
            alt="CRD Logo"
            onLogoClick={handleLogoClick}
          />
        </div>

        {/* Bottom Section - Additional Info */}
        <div className="text-center">
          <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-3 text-white">
            <p className="text-xs opacity-75">Collectible Trading Card</p>
            <p className="text-xs opacity-60">CRD Platform © 2024</p>
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
        `}
      </style>
    </div>
  );
};
