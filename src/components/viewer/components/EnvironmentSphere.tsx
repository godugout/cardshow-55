
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
    x: (mousePosition.x - 0.5) * 15, // Reduced from 30
    y: (mousePosition.y - 0.5) * 8   // Reduced from 15
  }), [mousePosition]);

  // Create depth layers for immersion without rotation
  const depthLayers = useMemo(() => [
    { depth: 0, opacity: 0.4, scale: 1.1, blur: 2 },
    { depth: 0, opacity: 0.6, scale: 1.05, blur: 1 },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main Environment - Static with subtle parallax */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${environmentImage})`,
          backgroundSize: '120% 100%', // Reduced from 200%
          backgroundPosition: `${50 + parallaxOffset.x * 0.3}% ${50 + parallaxOffset.y * 0.2}%`,
          backgroundRepeat: 'no-repeat',
          // REMOVED: All rotation transforms that caused dizziness
          transform: `scale(${isHovering ? 1.02 : 1})`, // Only subtle scaling
          filter: `brightness(${scene.lighting.intensity}) contrast(1.1) saturate(1.2)`,
          opacity: 0.9
        }}
      />

      {/* Static depth layers without rotation */}
      {depthLayers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${environmentImage})`,
            backgroundSize: `${120 * layer.scale}% ${100 * layer.scale}%`,
            // REMOVED: Rotating parallax, now only subtle position shifts
            backgroundPosition: `${50 + parallaxOffset.x * (0.1 + index * 0.05)}% ${50 + parallaxOffset.y * (0.1 + index * 0.03)}%`,
            backgroundRepeat: 'no-repeat',
            // REMOVED: All rotation and translateZ transforms
            opacity: layer.opacity * (isHovering ? 1.1 : 1),
            filter: `blur(${layer.blur}px) brightness(${scene.lighting.intensity * 0.8})`,
            mixBlendMode: 'screen'
          }}
        />
      ))}

      {/* Static atmospheric overlay */}
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
              linear-gradient(45deg, transparent 40%, #ff008030 45%, transparent 50%),
              linear-gradient(-45deg, transparent 60%, #0080ff30 65%, transparent 70%)
            `,
            animation: 'pulse 4s ease-in-out infinite', // Kept gentle pulse
            mixBlendMode: 'screen'
          }}
        />
      )}

      {scene.id === 'mountain' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 80% 20%, #ffa50040 0%, transparent 50%)`,
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
              linear-gradient(180deg, #4a5ee815 0%, transparent 30%),
              radial-gradient(ellipse at 50% 100%, #2c3e5030 0%, transparent 60%)
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Gentle ambient glow without movement */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(255,255,255,0.15) 0%, transparent 40%)`,
          opacity: isHovering ? 0.15 : 0.08
        }}
      />
    </div>
  );
};
