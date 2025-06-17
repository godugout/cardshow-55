
import React from 'react';
import type { EnvironmentScene } from '../types';

interface BackgroundRendererProps {
  selectedScene: EnvironmentScene;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
  selectedScene,
  mousePosition,
  isHovering
}) => {
  // Calculate subtle parallax offset (much smaller than before)
  const parallaxX = (mousePosition.x - 0.5) * 10; // Reduced from larger values
  const parallaxY = (mousePosition.y - 0.5) * 10; // Reduced from larger values

  return (
    <div className="fixed inset-0 z-0">
      {/* Main background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
        style={{
          backgroundImage: selectedScene.backgroundImage || selectedScene.gradient,
          transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px) scale(1.05)`,
        }}
      />
      
      {/* Subtle blurred overlay for depth effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out opacity-30"
        style={{
          backgroundImage: selectedScene.backgroundImage || selectedScene.gradient,
          transform: `translate(${parallaxX * -0.2}px, ${parallaxY * -0.2}px) scale(1.02)`,
          filter: 'blur(8px) brightness(0.7)',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Dark overlay for better card visibility */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
          opacity: isHovering ? 0.8 : 0.9,
        }}
      />
    </div>
  );
};
