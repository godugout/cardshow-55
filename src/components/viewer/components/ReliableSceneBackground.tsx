
import React, { useState, useEffect, useMemo } from 'react';
import type { EnvironmentScene, LightingPreset } from '../types';
import { createFallbackBackground, preloadImage } from '../utils/imageUtils';

interface ReliableSceneBackgroundProps {
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

export const ReliableSceneBackground: React.FC<ReliableSceneBackgroundProps> = ({
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  console.log('🖼️ ReliableSceneBackground rendering:', selectedScene.name);

  // Try to preload scene image if it has one
  useEffect(() => {
    if (selectedScene.imageUrl) {
      setImageLoaded(false);
      setImageError(false);
      
      preloadImage(selectedScene.imageUrl)
        .then(() => {
          setImageLoaded(true);
          setImageError(false);
        })
        .catch(() => {
          console.warn('⚠️ Scene image failed, using gradient fallback');
          setImageError(true);
          setImageLoaded(false);
        });
    } else {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [selectedScene.imageUrl]);

  const backgroundStyles = useMemo(() => {
    const parallaxOffset = isHovering ? 
      `${(mousePosition.x - 0.5) * environmentControls.parallaxIntensity * 20}px ${(mousePosition.y - 0.5) * environmentControls.parallaxIntensity * 20}px` : 
      '0px 0px';
    
    // Use image if loaded, otherwise use gradient fallback
    const background = imageLoaded && selectedScene.imageUrl && !imageError
      ? `url(${selectedScene.imageUrl})`
      : createFallbackBackground(selectedScene.id);
    
    return {
      background,
      backgroundSize: selectedScene.imageUrl ? 'cover' : `${100 + environmentControls.parallaxIntensity * 10}% ${100 + environmentControls.parallaxIntensity * 10}%`,
      backgroundPosition: selectedScene.imageUrl ? 'center' : parallaxOffset,
      backgroundRepeat: 'no-repeat',
      filter: `
        blur(${environmentControls.depthOfField * 2}px) 
        brightness(${selectedLighting.brightness / 100}) 
        contrast(${selectedLighting.contrast / 100}) 
        saturate(1)
        opacity(${environmentControls.atmosphericDensity})
      `,
      transition: 'all 0.3s ease-out'
    };
  }, [selectedScene, selectedLighting, mousePosition, isHovering, environmentControls, imageLoaded, imageError]);

  const overlayStyles = useMemo(() => ({
    background: selectedLighting.temperature ? 
      `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${
        selectedLighting.temperature > 5500 ? '#87CEEB' : '#FFA500'
      }40 0%, transparent 70%)` : 
      'none',
    opacity: isHovering ? 0.8 : 0.4,
    filter: `blur(${environmentControls.depthOfField}px)`,
    transition: 'all 0.3s ease-out'
  }), [selectedLighting, mousePosition, isHovering, environmentControls]);

  return (
    <>
      {/* Main background with reliable fallback */}
      <div 
        className="fixed inset-0 -z-10"
        style={backgroundStyles}
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
      
      {/* Loading indicator */}
      {selectedScene.imageUrl && !imageLoaded && !imageError && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
          Loading background...
        </div>
      )}
    </>
  );
};
