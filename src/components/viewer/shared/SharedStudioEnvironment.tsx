import React, { useRef, useCallback } from 'react';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { EnvironmentSphere } from '../components/EnvironmentSphere';
import { StudioCardManager } from './StudioCardManager';

import { SharedLightingSystem } from './SharedLightingSystem';

interface SharedStudioEnvironmentProps {
  cards: CardData[];
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  environmentControls: EnvironmentControls;
  overallBrightness: number[];
  interactiveLighting: boolean;
  effectValues: EffectValues;
  cardSpacing: number;
  allowRotation: boolean;
  autoRotate: boolean;
  zoom: number;
  onCardInteraction?: (cardIndex: number, event: React.MouseEvent) => void;
}

export const SharedStudioEnvironment: React.FC<SharedStudioEnvironmentProps> = ({
  cards,
  selectedScene,
  selectedLighting,
  materialSettings,
  environmentControls,
  overallBrightness,
  interactiveLighting,
  effectValues,
  cardSpacing,
  allowRotation,
  autoRotate,
  zoom,
  onCardInteraction
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = React.useState(false);

  // Handle mouse movement for interactive lighting and parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  }, []);


  // Simple static parallax for background only (no camera rotation coupling)
  const staticParallaxOffset = {
    x: (mousePosition.x - 0.5) * 20, // Much reduced parallax
    y: (mousePosition.y - 0.5) * 10
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        perspective: `${1000 / environmentControls.fieldOfView * 75}px`,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Static Environment Background - NO rotation coupling */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `
            translateX(${staticParallaxOffset.x}px) 
            translateY(${staticParallaxOffset.y}px)
          `,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out'
        }}
      >
        <EnvironmentSphere
          scene={selectedScene}
          mousePosition={mousePosition}
          isHovering={isHovering}
        />
      </div>

      {/* Shared Lighting System */}
      <SharedLightingSystem
        selectedLighting={selectedLighting}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        mousePosition={mousePosition}
        isHovering={isHovering}
        environmentControls={environmentControls}
      />

      {/* Shared Atmospheric Effects */}
      {selectedScene.atmosphere?.fog && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              transparent 0%, 
              ${selectedScene.atmosphere.fogColor}${Math.round(selectedScene.atmosphere.fogDensity * 255).toString(16)} 100%
            )`,
            filter: `blur(${environmentControls.atmosphericDensity * 2}px)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* 3D Cards Manager */}
      <div 
        className="relative z-20"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        <StudioCardManager
          cards={cards}
          cardSpacing={cardSpacing}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          mousePosition={mousePosition}
          isHovering={isHovering}
          zoom={zoom}
          autoRotate={autoRotate}
          allowRotation={allowRotation}
          onCardInteraction={onCardInteraction}
        />
      </div>


    </div>
  );
};