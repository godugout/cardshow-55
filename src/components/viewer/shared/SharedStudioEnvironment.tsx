import React, { useRef, useCallback } from 'react';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { EnvironmentSphere } from '../components/EnvironmentSphere';
import { StudioCardManager } from './StudioCardManager';
import { SharedCameraController } from './SharedCameraController';
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
  onCameraChange?: (position: { x: number; y: number; z: number }, rotation: { x: number; y: number }) => void;
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
  onCardInteraction,
  onCameraChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [cameraPosition, setCameraPosition] = React.useState({ x: 0, y: 0, z: 8 });
  const [cameraRotation, setCameraRotation] = React.useState({ x: 0, y: 0 });

  // Handle mouse movement for interactive lighting and parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  }, []);

  // Handle camera updates
  const handleCameraUpdate = useCallback((position: { x: number; y: number; z: number }, rotation: { x: number; y: number }) => {
    setCameraPosition(position);
    setCameraRotation(rotation);
    onCameraChange?.(position, rotation);
  }, [onCameraChange]);

  // Calculate immersive field of view based on scene
  const immersiveFOV = selectedScene.depth?.fieldOfView || 75;
  
  // Enhanced parallax for 360° photography feel
  const parallaxOffset = {
    x: (mousePosition.x - 0.5) * (environmentControls.parallaxIntensity * 50),
    y: (mousePosition.y - 0.5) * (environmentControls.parallaxIntensity * 25)
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
      {/* Shared Environment Background with 360° Support */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `
            perspective(${immersiveFOV * 20}px) 
            rotateX(${cameraRotation.x * 0.1}deg) 
            rotateY(${cameraRotation.y * 0.1}deg)
            translateX(${parallaxOffset.x}px) 
            translateY(${parallaxOffset.y}px)
            scale(${1 + zoom * 0.1})
          `,
          transformOrigin: 'center center',
          transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
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
          transform: `
            perspective(${immersiveFOV * 15}px)
            translateZ(${cameraPosition.z * 10}px)
            rotateX(${cameraRotation.x}deg)
            rotateY(${cameraRotation.y}deg)
          `,
          transformStyle: 'preserve-3d',
          transition: autoRotate ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
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

      {/* Shared Camera Controller */}
      <SharedCameraController
        allowRotation={allowRotation}
        autoRotate={autoRotate}
        mousePosition={mousePosition}
        containerRef={containerRef}
        onCameraUpdate={handleCameraUpdate}
        environmentControls={environmentControls}
        immersive360Mode={selectedScene.type === '360'}
      />

      {/* Depth of Field Effect */}
      {environmentControls.depthOfField > 1 && (
        <div 
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              transparent 30%, 
              rgba(0,0,0,${(environmentControls.depthOfField - 1) * 0.3}) 100%
            )`,
            filter: `blur(${(environmentControls.depthOfField - 1) * 2}px)`
          }}
        />
      )}
    </div>
  );
};