
import React, { useMemo } from 'react';
import type { EnvironmentScene, LightingPreset } from '../types';

interface SceneBackgroundProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  environmentControls?: {
    depthOfField: number;
    parallaxIntensity: number;
    fieldOfView: number;
    atmosphericDensity: number;
  };
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  selectedScene,
  selectedLighting,
  mousePosition,
  isHovering,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  }
}) => {
  console.log('🖼️ SceneBackground rendering with controls:', environmentControls);

  const enhancedStyles = useMemo(() => {
    const baseGradient = selectedScene.gradient;
    const parallaxOffset = isHovering ? 
      `${(mousePosition.x - 0.5) * environmentControls.parallaxIntensity * 20}px ${(mousePosition.y - 0.5) * environmentControls.parallaxIntensity * 20}px` : 
      '0px 0px';
    
    return {
      background: `linear-gradient(135deg, ${baseGradient})`,
      backgroundSize: `${100 + environmentControls.parallaxIntensity * 10}% ${100 + environmentControls.parallaxIntensity * 10}%`,
      backgroundPosition: parallaxOffset,
      filter: `
        blur(${environmentControls.depthOfField * 2}px) 
        brightness(${selectedLighting.brightness}) 
        contrast(${selectedLighting.contrast}) 
        saturate(${selectedLighting.saturation})
        opacity(${environmentControls.atmosphericDensity})
      `,
      transition: 'all 0.3s ease-out'
    };
  }, [selectedScene, selectedLighting, mousePosition, isHovering, environmentControls]);

  const overlayStyles = useMemo(() => ({
    background: selectedLighting.ambientColor ? 
      `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${selectedLighting.ambientColor}40 0%, transparent 70%)` : 
      'none',
    opacity: isHovering ? 0.8 : 0.4,
    filter: `blur(${environmentControls.depthOfField}px)`,
    transition: 'all 0.3s ease-out'
  }), [selectedLighting, mousePosition, isHovering, environmentControls]);

  return (
    <>
      {/* Main background with enhanced controls */}
      <div 
        className="fixed inset-0 -z-10"
        style={enhancedStyles}
      />
      
      {/* Dynamic lighting overlay */}
      <div 
        className="fixed inset-0 -z-5 pointer-events-none"
        style={overlayStyles}
      />
      
      {/* Atmospheric density overlay */}
      {environmentControls.atmosphericDensity !== 1 && (
        <div 
          className="fixed inset-0 -z-5 pointer-events-none"
          style={{
            background: environmentControls.atmosphericDensity > 1 ? 
              `rgba(255, 255, 255, ${(environmentControls.atmosphericDensity - 1) * 0.2})` :
              `rgba(0, 0, 0, ${(1 - environmentControls.atmosphericDensity) * 0.3})`,
            transition: 'all 0.3s ease-out'
          }}
        />
      )}
    </>
  );
};
