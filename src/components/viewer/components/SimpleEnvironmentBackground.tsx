
import React from 'react';
import type { EnvironmentScene } from '../types';

interface SimpleEnvironmentBackgroundProps {
  scene: EnvironmentScene;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const SimpleEnvironmentBackground: React.FC<SimpleEnvironmentBackgroundProps> = ({
  scene,
  mousePosition,
  isHovering
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: scene.backgroundImage ? `url(${scene.backgroundImage})` : undefined,
          background: scene.backgroundImage ? undefined : scene.gradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: `brightness(${scene.lighting.intensity}) contrast(1.1)`,
          opacity: 0.8
        }}
      />

      {/* Simple Lighting Overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            ${scene.lighting.color}20 0%, transparent 60%)`,
          opacity: isHovering ? 0.6 : 0.4
        }}
      />

      {/* Category-specific Simple Effects */}
      {scene.category === 'fantasy' && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, ${scene.lighting.color}30 0%, transparent 50%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {scene.category === 'futuristic' && (
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            background: `linear-gradient(0deg, ${scene.lighting.color}40 0%, transparent 100%)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}
    </div>
  );
};
