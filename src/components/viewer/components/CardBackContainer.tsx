
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';

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
  interactiveLighting = false
}) => {
  // Get dynamic material based on current effects
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);
  
  // Simplified visibility calculation with better angle ranges
  const getVisibility = () => {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((rotation.y % 360) + 360) % 360;
    
    // Back is visible from 135° to 225° (centered at 180°)
    const isBackVisible = normalizedRotation >= 135 && normalizedRotation <= 225;
    
    // Debug logging
    console.log('🔄 Card Back - Rotation:', normalizedRotation.toFixed(1), 'Visible:', isBackVisible);
    
    if (!isBackVisible) {
      return { opacity: 0, zIndex: 5, display: 'none' as const };
    }
    
    // Calculate smooth opacity transitions at edges
    let opacity = 1;
    const fadeRange = 15; // 15 degrees fade at each edge
    
    if (normalizedRotation >= 135 && normalizedRotation <= 135 + fadeRange) {
      // Fade in from 135° to 150°
      opacity = (normalizedRotation - 135) / fadeRange;
    } else if (normalizedRotation >= 225 - fadeRange && normalizedRotation <= 225) {
      // Fade out from 210° to 225°
      opacity = (225 - normalizedRotation) / fadeRange;
    }
    
    return { 
      opacity: Math.max(0.1, opacity),
      zIndex: opacity > 0.5 ? 25 : 15, // Higher z-index when more visible
      display: 'block' as const
    };
  };

  const { opacity: backOpacity, zIndex: backZIndex, display } = getVisibility();
  
  // Don't render at all if not visible
  if (display === 'none') {
    return null;
  }
  
  // Enhanced logo effects based on mouse position, lighting, and material
  const getLogoEffects = () => {
    const baseTreatment = selectedMaterial.logoTreatment;
    
    if (!interactiveLighting || !isHovering) {
      return {
        filter: baseTreatment.filter,
        transform: baseTreatment.transform,
        opacity: baseTreatment.opacity,
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as const,
        pointerEvents: 'none' as const
      };
    }

    const intensity = Math.sqrt(
      Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)
    );
    
    return {
      filter: `
        ${baseTreatment.filter}
        drop-shadow(0 0 ${20 + intensity * 30}px rgba(255, 215, 0, ${0.3 + intensity * 0.4}))
        drop-shadow(0 0 ${40 + intensity * 60}px rgba(59, 130, 246, ${0.2 + intensity * 0.3}))
        brightness(${1 + intensity * 0.3})
        contrast(${1.1 + intensity * 0.2})
      `,
      transform: `${baseTreatment.transform} scale(${1 + intensity * 0.05})`,
      opacity: baseTreatment.opacity + intensity * 0.1,
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const,
      pointerEvents: 'none' as const
    };
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
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `
      0 0 30px ${selectedMaterial.borderColor},
      inset 0 0 20px rgba(255, 255, 255, 0.1)
    `
  };

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        opacity: backOpacity,
        zIndex: backZIndex,
        transition: 'opacity 0.3s ease, z-index 0.1s ease',
        backfaceVisibility: 'hidden',
        ...dynamicFrameStyles
      }}
      data-material={selectedMaterial.id}
      data-material-name={selectedMaterial.name}
      data-visibility={backOpacity > 0.1 ? 'visible' : 'hidden'}
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

      {/* Enhanced dynamic texture overlay */}
      {selectedMaterial.texture === 'noise' && (
        <div 
          className="absolute inset-0 z-25 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            animation: 'noise-shift 8s ease-in-out infinite alternate',
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
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
          pointerEvents: 'none',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Enhanced CRD Logo with Dynamic Material Treatment */}
      <div 
        className="relative h-full flex items-center justify-center z-30"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none',
          backfaceVisibility: 'hidden'
        }}
      >
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-64 h-auto relative z-10 transition-all duration-700 ease-out"
          style={{
            ...getLogoEffects(),
            imageRendering: 'crisp-edges',
            objectFit: 'contain',
            animation: interactiveLighting && isHovering ? 'logo-glow-pulse 4s ease-in-out infinite' : 'none',
            backfaceVisibility: 'hidden'
          }}
          onLoad={() => console.log('✅ Enhanced CRD logo loaded successfully')}
          onError={() => console.log('❌ Error loading enhanced CRD logo')}
          draggable={false}
        />
      </div>

      {/* Enhanced Interactive Lighting with Material Awareness */}
      {interactiveLighting && isHovering && (
        <div className="absolute inset-0 pointer-events-none z-40" style={{ backfaceVisibility: 'hidden' }}>
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
              transition: 'opacity 0.2s ease',
              backfaceVisibility: 'hidden'
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
