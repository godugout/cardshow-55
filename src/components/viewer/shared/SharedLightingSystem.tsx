import React from 'react';
import type { LightingPreset, EnvironmentControls } from '../types';

interface SharedLightingSystemProps {
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  environmentControls: EnvironmentControls;
}

export const SharedLightingSystem: React.FC<SharedLightingSystemProps> = ({
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  mousePosition,
  isHovering,
  environmentControls
}) => {
  // Calculate dynamic lighting based on mouse position
  const lightPosition = {
    x: mousePosition.x * 100,
    y: mousePosition.y * 100
  };

  // Enhanced lighting intensity based on interaction with fallback values
  const lightingIntensity = selectedLighting.intensity || (selectedLighting.brightness / 100);
  const baseIntensity = (overallBrightness[0] / 100) * lightingIntensity;
  const interactiveIntensity = isHovering && interactiveLighting ? baseIntensity * 1.4 : baseIntensity;

  // Create multiple light sources for realistic illumination
  const primaryColor = selectedLighting.color || '#ffffff';
  const fillColor = selectedLighting.fillColor || primaryColor;
  const ambientColor = selectedLighting.ambientColor || '#ffffff';
  
  const lightingSources = [
    {
      type: 'primary',
      position: { x: lightPosition.x, y: lightPosition.y },
      color: primaryColor,
      intensity: interactiveIntensity,
      radius: 60
    },
    {
      type: 'fill',
      position: { x: 100 - lightPosition.x, y: 100 - lightPosition.y },
      color: fillColor,
      intensity: interactiveIntensity * 0.4,
      radius: 80
    },
    {
      type: 'ambient',
      position: { x: 50, y: 20 },
      color: ambientColor,
      intensity: baseIntensity * 0.3,
      radius: 100
    }
  ];

  return (
    <>
      {/* Main Lighting System */}
      {lightingSources.map((light, index) => (
        <div
          key={`${light.type}-${index}`}
          className="absolute inset-0 z-5 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle at ${light.position.x}% ${light.position.y}%, 
              ${light.color}${Math.round(light.intensity * 255 * 0.3).toString(16).padStart(2, '0')} 0%,
              ${light.color}${Math.round(light.intensity * 255 * 0.15).toString(16).padStart(2, '0')} ${light.radius * 0.5}%,
              transparent ${light.radius}%
            )`,
            mixBlendMode: light.type === 'ambient' ? 'overlay' : 'screen',
            opacity: 0.8,
            filter: `blur(${environmentControls.atmosphericDensity * 1.5}px)`,
            transition: interactiveLighting ? 'all 0.3s ease-out' : 'all 0.6s ease-out'
          }}
        />
      ))}

      {/* Interactive Light Rays */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 z-6 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                ${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * 180 / Math.PI + 90}deg,
                transparent 0%,
                ${primaryColor}20 45%,
                ${primaryColor}40 50%,
                ${primaryColor}20 55%,
                transparent 100%
              )
            `,
            mixBlendMode: 'screen',
            opacity: 0.6,
            filter: 'blur(1px)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      )}

      {/* Rim Lighting Effect */}
      <div
        className="absolute inset-0 z-7 pointer-events-none"
        style={{
          background: `
            linear-gradient(45deg, 
              ${primaryColor}30 0%, 
              transparent 20%,
              transparent 80%,
              ${primaryColor}30 100%
            ),
            linear-gradient(-45deg, 
              ${primaryColor}20 0%, 
              transparent 20%,
              transparent 80%,
              ${primaryColor}20 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: interactiveIntensity * 0.5,
          filter: `blur(${2 - environmentControls.atmosphericDensity}px)`
        }}
      />

      {/* God Rays Effect for Dramatic Lighting */}
      {(selectedLighting.dramatic || selectedLighting.id === 'dramatic') && (
        <div
          className="absolute inset-0 z-8 pointer-events-none"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 360}deg at ${lightPosition.x}% ${lightPosition.y}%,
                transparent 0deg,
                ${primaryColor}15 30deg,
                transparent 60deg,
                ${primaryColor}10 90deg,
                transparent 120deg,
                ${primaryColor}15 150deg,
                transparent 180deg,
                ${primaryColor}10 210deg,
                transparent 240deg,
                ${primaryColor}15 270deg,
                transparent 300deg,
                ${primaryColor}10 330deg,
                transparent 360deg
              )
            `,
            mixBlendMode: 'screen',
            opacity: 0.4,
            filter: 'blur(2px)',
            animation: isHovering ? 'rotate 20s linear infinite' : 'none'
          }}
        />
      )}
    </>
  );
};