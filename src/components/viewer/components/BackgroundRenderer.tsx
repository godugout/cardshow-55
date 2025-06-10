
import React from 'react';
import { SpaceRenderer3D } from '../spaces/SpaceRenderer3D';
import type { EnvironmentScene, BackgroundType } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';

interface BackgroundRendererProps {
  backgroundType: BackgroundType;
  selectedSpace: SpaceEnvironment | null;
  spaceControls: SpaceControls;
  adaptedCard: any;
  onCardClick: () => void;
  onCameraReset: () => void;
  selectedScene: EnvironmentScene;
  selectedLighting: any;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
  backgroundType,
  selectedSpace,
  spaceControls,
  adaptedCard,
  onCardClick,
  onCameraReset,
  selectedScene,
  selectedLighting,
  mousePosition,
  isHovering
}) => {
  return (
    <>
      {/* Emergency Fallback Background - Always renders first */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darker" />

      {/* Background Renderer - 2D or 3D */}
      <div className="absolute inset-0 z-10">
        {backgroundType === '3dSpace' && selectedSpace ? (
          <SpaceRenderer3D
            card={adaptedCard}
            environment={selectedSpace}
            controls={spaceControls}
            onCardClick={onCardClick}
            onCameraReset={onCameraReset}
          />
        ) : (
          <>
            {/* 2D Scene Background */}
            <div 
              className="absolute inset-0"
              style={{
                background: selectedScene.backgroundImage || selectedScene.gradient || 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                filter: `brightness(${selectedLighting.brightness}%)`,
                transition: 'all 0.5s ease'
              }}
            />
            
            {/* Depth layers without jarring parallax */}
            <div className="absolute inset-0">
              {/* Static depth layer 1 - Far background */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url(${selectedScene.backgroundImage || selectedScene.panoramicUrl})`,
                  backgroundSize: '130% 130%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'blur(8px) brightness(0.7)',
                  transform: 'scale(1.1) translateZ(-200px)',
                  mixBlendMode: 'multiply'
                }}
              />
              
              {/* Static depth layer 2 - Mid background */}
              <div 
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage: `url(${selectedScene.backgroundImage || selectedScene.panoramicUrl})`,
                  backgroundSize: '115% 115%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'blur(4px) brightness(0.8)',
                  transform: 'scale(1.05) translateZ(-100px)',
                  mixBlendMode: 'overlay'
                }}
              />
              
              {/* Main background layer with subtle breathing animation */}
              <div 
                className="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
                style={{
                  backgroundImage: `url(${selectedScene.backgroundImage || selectedScene.panoramicUrl})`,
                  backgroundSize: '120% 120%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: `scale(${1 + Math.sin(Date.now() * 0.0008) * 0.01})`,
                  filter: `brightness(${selectedScene.lighting.intensity}) contrast(1.1) saturate(1.2)`,
                  opacity: 0.9
                }}
              />
            </div>
            
            {/* Dynamic lighting that follows mouse */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                  ${selectedScene.lighting.color}40 0%, 
                  ${selectedScene.lighting.color}20 30%,
                  transparent 70%)`,
                mixBlendMode: 'overlay'
              }}
            />
            
            {/* Atmospheric particles */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    transform: `translateY(${Math.sin(Date.now() * 0.001 * (i + 1)) * 15}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              ))}
            </div>
            
            {/* Enhanced Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />
          </>
        )}
      </div>

      {/* Subtle Ambient Background Effect (only for 2D scenes) */}
      {backgroundType === 'scene' && (
        <div 
          className="absolute inset-0 opacity-20 z-15 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              ${selectedScene.lighting.color} 0%, transparent 40%)`,
            mixBlendMode: 'screen',
            opacity: isHovering ? 0.3 : 0.2
          }}
        />
      )}
    </>
  );
};
