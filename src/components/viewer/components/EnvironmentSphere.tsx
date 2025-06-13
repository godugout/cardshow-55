
import React, { useMemo } from 'react';
import type { EnvironmentScene } from '../types';

interface EnvironmentSphereProps {
  scene: EnvironmentScene;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const EnvironmentSphere: React.FC<EnvironmentSphereProps> = ({
  scene,
  mousePosition,
  isHovering
}) => {
  // Use the scene's configured background image directly
  const environmentImage = scene.backgroundImage || scene.panoramicUrl;
  
  // Calculate subtle parallax movement without rotation
  const parallaxOffset = useMemo(() => ({
    x: (mousePosition.x - 0.5) * 8, // Reduced further
    y: (mousePosition.y - 0.5) * 4   // Reduced further
  }), [mousePosition]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main Environment - Single layer with subtle parallax */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${environmentImage})`,
          backgroundSize: '110% 110%', // Reduced from 120%
          backgroundPosition: `${50 + parallaxOffset.x * 0.2}% ${50 + parallaxOffset.y * 0.15}%`,
          backgroundRepeat: 'no-repeat',
          transform: `scale(${isHovering ? 1.02 : 1})`, // Only subtle scaling
          filter: `brightness(${scene.lighting.intensity}) contrast(1.1) saturate(1.2)`,
          opacity: 0.95
        }}
      />

      {/* Depth effect using gradient overlays instead of duplicate images */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              transparent 20%, 
              rgba(0,0,0,0.1) 60%,
              rgba(0,0,0,0.2) 90%)
          `,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Atmospheric lighting overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            ${scene.lighting.color}15 0%, 
            ${scene.lighting.color}08 40%,
            transparent 80%)`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Scene-specific environmental effects - static */}
      {scene.id === 'cyberpunk-city' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(45deg, transparent 70%, #ff008020 80%, transparent 90%),
              linear-gradient(-45deg, transparent 70%, #0080ff20 80%, transparent 90%)
            `,
            animation: 'pulse 4s ease-in-out infinite',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {scene.id === 'mountain' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 80% 20%, #ffa50030 0%, transparent 50%)`,
            filter: 'blur(40px)',
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {scene.id === 'crystal-cave' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, #4a5ee810 0%, transparent 30%),
              radial-gradient(ellipse at 50% 100%, #2c3e5020 0%, transparent 60%)
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Gentle ambient glow for depth perception */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-8 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,0.12) 0%, 
              rgba(255,255,255,0.06) 30%,
              transparent 60%)
          `,
          opacity: isHovering ? 0.12 : 0.06
        }}
      />

      {/* Subtle vignette for focus */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.1) 80%)`,
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
};
