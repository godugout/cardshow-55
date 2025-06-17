
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
  // Much more subtle parallax offset
  const parallaxX = (mousePosition.x - 0.5) * 3; // Reduced from 10
  const parallaxY = (mousePosition.y - 0.5) * 3; // Reduced from 10

  // Ensure we have a valid background
  const backgroundStyle = selectedScene.backgroundImage || selectedScene.gradient || 
    'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';

  return (
    <div className="fixed inset-0 z-0">
      {/* Main background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: backgroundStyle,
          transform: `translate(${parallaxX * 0.1}px, ${parallaxY * 0.1}px) scale(1.02)`,
        }}
      />
      
      {/* Much more subtle blurred overlay for depth - heavily blurred and transparent */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-15"
        style={{
          backgroundImage: backgroundStyle,
          transform: `translate(${parallaxX * -0.05}px, ${parallaxY * -0.05}px) scale(1.01)`,
          filter: 'blur(20px) brightness(0.5)',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Dark overlay for better card visibility - adjusted for better contrast */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          opacity: isHovering ? 0.85 : 0.9,
        }}
      />
    </div>
  );
};
