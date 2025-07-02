
import React from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { Card3DTransform } from './Card3DTransform';
import { useCachedCardEffects } from '../hooks/useCachedCardEffects';

interface EnhancedCardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  showBackgroundInfo?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (event: React.MouseEvent) => void;
  environmentControls?: EnvironmentControls;
  solidCardTransition?: boolean;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = [100],
  showBackgroundInfo = true,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  },
  solidCardTransition
}) => {
  // Use cached effects for better performance only when all required props are available
  const cachedEffects = selectedScene && selectedLighting && materialSettings ? useCachedCardEffects({
    card,
    effectValues,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering
  }) : null;

  // Use cached styles if available, otherwise fall back to provided styles
  const effectiveFrameStyles = cachedEffects?.frameStyles || frameStyles;
  const effectiveEnhancedEffectStyles = cachedEffects?.enhancedEffectStyles || enhancedEffectStyles;
  const effectiveSurfaceTextureFront = cachedEffects?.SurfaceTexture || SurfaceTexture;
  const effectiveSurfaceTextureBack = undefined;

  // Calculate the final rotation - normalize Y rotation to determine which face to show
  const normalizedY = ((rotation.y % 360) + 360) % 360; // Ensure positive 0-360 range
  const showBack = isFlipped || (normalizedY > 90 && normalizedY < 270);
  
  const finalRotation = {
    x: rotation.x,
    y: rotation.y + (isFlipped ? 180 : 0),
  };

  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: `brightness(${interactiveLighting && isHovering ? 1.3 : 1.2}) contrast(1.1)`
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* 3D Card with Realistic Thickness */}
      <div
        className="relative"
        style={{
          width: '400px',
          height: '560px',
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Card Container with 3D Transform */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${finalRotation.x}deg) rotateY(${finalRotation.y}deg)`,
            filter: `drop-shadow(0 25px 50px rgba(0,0,0,${interactiveLighting && isHovering ? 0.9 : 0.8}))`
          }}
        >
          {/* CARD FRONT - Original Image Side */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(1px)', // Slightly forward to avoid z-fighting
              zIndex: showBack ? 5 : 15,
              background: '#ffffff',
              opacity: showBack ? 0 : 1,
              pointerEvents: showBack ? 'none' : 'auto'
            }}
          >
            <CardFrontContainer
              card={card}
              rotation={finalRotation}
              isHovering={isHovering}
              showEffects={showEffects}
              effectValues={effectValues}
              mousePosition={mousePosition}
              frameStyles={effectiveFrameStyles}
              enhancedEffectStyles={effectiveEnhancedEffectStyles}
              SurfaceTexture={effectiveSurfaceTextureFront}
              interactiveLighting={interactiveLighting}
            />
          </div>

          {/* CARD BACK - CRD Logo Side */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(1px)', // Back face flipped 180°, slightly forward
              zIndex: showBack ? 15 : 5,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
              opacity: showBack ? 1 : 0,
              pointerEvents: showBack ? 'auto' : 'none'
            }}
          >
            <CardBackContainer
              rotation={finalRotation}
              isHovering={isHovering}
              showEffects={false} // Never show effects on back
              effectValues={effectValues}
              mousePosition={mousePosition}
              frameStyles={effectiveFrameStyles}
              enhancedEffectStyles={effectiveEnhancedEffectStyles}
              SurfaceTexture={undefined} // No texture on back
              interactiveLighting={interactiveLighting}
            />
          </div>

          {/* Card Thickness/Edges - Create 3D depth */}
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Top Edge */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
                transform: 'rotateX(90deg) translateZ(2px)',
                transformOrigin: 'top',
                zIndex: 5
              }}
            />
            {/* Bottom Edge */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                transform: 'rotateX(-90deg) translateZ(2px)',
                transformOrigin: 'bottom',
                zIndex: 5
              }}
            />
            {/* Left Edge */}
            <div
              className="absolute top-0 bottom-0 left-0 w-1"
              style={{
                background: 'linear-gradient(180deg, #2a2a2a 0%, #404040 50%, #1a1a1a 100%)',
                transform: 'rotateY(-90deg) translateZ(2px)',
                transformOrigin: 'left',
                zIndex: 5
              }}
            />
            {/* Right Edge */}
            <div
              className="absolute top-0 bottom-0 right-0 w-1"
              style={{
                background: 'linear-gradient(180deg, #2a2a2a 0%, #404040 50%, #1a1a1a 100%)',
                transform: 'rotateY(90deg) translateZ(2px)',
                transformOrigin: 'right',
                zIndex: 5
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

EnhancedCardContainer.displayName = 'EnhancedCardContainer';
