
import React, { useMemo, useRef, useEffect, useState } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { Card3DTransform } from './Card3DTransform';
import { useCachedCardEffects } from '../hooks/useCachedCardEffects';

interface UnifiedCardRendererProps {
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

export const UnifiedCardRenderer: React.FC<UnifiedCardRendererProps> = ({
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
  solidCardTransition = true // Enable solid transitions for smoother flipping
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Pre-load card image to eliminate loading delay
  useEffect(() => {
    if (card.image_url) {
      const img = new Image();
      img.onload = () => setIsPreloaded(true);
      img.src = card.image_url;
    } else {
      setIsPreloaded(true);
    }
  }, [card.image_url]);

  // Use cached effects for better performance
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
  const effectiveSurfaceTexture = cachedEffects?.SurfaceTexture || SurfaceTexture;

  // Calculate the final rotation including the flip - NO LONGER ADDING 180 degrees here
  // The flip is now handled by the visibility managers
  const finalRotation = {
    x: rotation.x,
    y: rotation.y, // Remove the automatic flip offset
  };

  // Optimize container styles with hardware acceleration
  const containerStyles = useMemo(() => ({
    transform: `scale(${zoom})`,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    filter: `brightness(${interactiveLighting && isHovering ? 1.3 : 1.2}) contrast(1.1)`,
    willChange: isDragging ? 'transform' : 'auto',
    backfaceVisibility: 'hidden' as const,
    transformStyle: 'preserve-3d' as const
  }), [zoom, isDragging, interactiveLighting, isHovering]);

  // Show loading state if image isn't preloaded yet
  if (!isPreloaded) {
    return (
      <div 
        className="relative z-20 flex items-center justify-center w-[300px] h-[420px] bg-gray-900 rounded-xl border border-gray-600"
        style={containerStyles}
      >
        <div className="text-white/60 text-sm">Loading card...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={containerStyles}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Card3DTransform
        rotation={finalRotation}
        mousePosition={mousePosition}
        isDragging={isDragging}
        interactiveLighting={interactiveLighting}
        isHovering={isHovering}
      >
        {/* Front of Card */}
        <CardFrontContainer
          card={card}
          rotation={finalRotation}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={effectiveFrameStyles}
          enhancedEffectStyles={effectiveEnhancedEffectStyles}
          SurfaceTexture={effectiveSurfaceTexture}
          interactiveLighting={interactiveLighting}
          solidCardTransition={solidCardTransition}
        />

        {/* Back of Card */}
        <CardBackContainer
          rotation={finalRotation}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={effectiveFrameStyles}
          enhancedEffectStyles={effectiveEnhancedEffectStyles}
          SurfaceTexture={effectiveSurfaceTexture}
          interactiveLighting={interactiveLighting}
          solidCardTransition={solidCardTransition}
        />
      </Card3DTransform>
    </div>
  );
};

UnifiedCardRenderer.displayName = 'UnifiedCardRenderer';
