
import React, { useMemo } from 'react';
import type { EnvironmentScene, EnvironmentControls } from '../types';

interface EnhancedEnvironmentSphereProps {
  scene: EnvironmentScene;
  controls: EnvironmentControls;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const EnhancedEnvironmentSphere: React.FC<EnhancedEnvironmentSphereProps> = ({
  scene,
  controls,
  mousePosition,
  isHovering
}) => {
  // Calculate enhanced parallax with depth layers
  const parallaxLayers = useMemo(() => {
    const layers = [];
    const baseParallax = controls.parallaxIntensity * 20;
    
    for (let i = 0; i < scene.depth.layers; i++) {
      const layerDepth = -50 - (i * 30);
      const layerScale = 1 + (i * 0.05);
      const layerSpeed = 1 + (i * 0.2);
      
      layers.push({
        depth: layerDepth,
        scale: layerScale,
        parallaxX: (mousePosition.x - 0.5) * baseParallax * layerSpeed,
        parallaxY: (mousePosition.y - 0.5) * baseParallax * layerSpeed * 0.5,
        opacity: 0.3 + (i * 0.1),
        blur: Math.max(0, i - 1)
      });
    }
    
    return layers;
  }, [scene.depth.layers, controls.parallaxIntensity, mousePosition]);

  // Field of view transform
  const fovTransform = useMemo(() => {
    const fovScale = 1 + (controls.fieldOfView - 75) * 0.01;
    return `scale(${fovScale})`;
  }, [controls.fieldOfView]);

  // Atmospheric effects
  const atmosphericStyle = useMemo(() => {
    if (!scene.atmosphere.fog) return {};
    
    return {
      background: `
        radial-gradient(
          ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
          ${scene.atmosphere.fogColor}${Math.floor(scene.atmosphere.fogDensity * controls.atmosphericDensity * 255).toString(16).padStart(2, '0')} 0%, 
          transparent 60%
        )
      `,
      mixBlendMode: 'multiply' as const
    };
  }, [scene.atmosphere, mousePosition, controls.atmosphericDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main Panoramic Environment */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${scene.panoramicUrl})`,
          backgroundSize: `${200 + (controls.fieldOfView - 75)}% 100%`,
          backgroundPosition: `${50 + (mousePosition.x - 0.5) * controls.parallaxIntensity * 10}% ${50 + (mousePosition.y - 0.5) * controls.parallaxIntensity * 5}%`,
          backgroundRepeat: 'no-repeat',
          transform: `${fovTransform} perspective(1000px) rotateY(${(mousePosition.x - 0.5) * controls.parallaxIntensity * 2}deg) rotateX(${(mousePosition.y - 0.5) * controls.parallaxIntensity * 1}deg)`,
          filter: `brightness(${scene.lighting.intensity}) contrast(1.1) saturate(1.2) blur(${controls.depthOfField * 0.5}px)`,
          opacity: 0.9
        }}
      />

      {/* Depth Layers for 3D Diorama Effect */}
      {parallaxLayers.map((layer, index) => (
        <div
          key={`depth-layer-${index}`}
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            backgroundImage: `url(${scene.panoramicUrl})`,
            backgroundSize: `${200 * layer.scale}% ${100 * layer.scale}%`,
            backgroundPosition: `${50 + layer.parallaxX}% ${50 + layer.parallaxY}%`,
            backgroundRepeat: 'no-repeat',
            transform: `translateZ(${layer.depth}px) scale(${layer.scale})`,
            opacity: layer.opacity * (isHovering ? 1.2 : 1),
            filter: `blur(${layer.blur + controls.depthOfField}px) brightness(${scene.lighting.intensity * 0.7})`,
            mixBlendMode: index % 2 === 0 ? 'screen' : 'overlay'
          }}
        />
      ))}

      {/* Atmospheric Fog Layer */}
      {scene.atmosphere.fog && (
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={atmosphericStyle}
        />
      )}

      {/* Particle Effects */}
      {scene.atmosphere.particles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `translateX(${(mousePosition.x - 0.5) * (i + 1) * 2}px) translateY(${(mousePosition.y - 0.5) * (i + 1) * 1}px)`
              }}
            />
          ))}
        </div>
      )}

      {/* Scene-specific Environmental Effects */}
      {scene.category === 'fantasy' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, ${scene.lighting.color}40 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${scene.lighting.color}30 0%, transparent 40%)
            `,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {scene.category === 'futuristic' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(45deg, transparent 30%, ${scene.lighting.color}30 35%, transparent 40%),
              linear-gradient(-45deg, transparent 60%, ${scene.lighting.color}20 65%, transparent 70%)
            `,
            animation: 'pulse 4s ease-in-out infinite',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {scene.category === 'natural' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${scene.lighting.color}20 0%, transparent 70%)`,
            filter: 'blur(30px)',
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Interactive Light Rays */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            transparent 0deg, 
            ${scene.lighting.color} 10deg, 
            transparent 20deg, 
            ${scene.lighting.color} 170deg, 
            transparent 180deg)`,
          transform: `translateX(${(mousePosition.x - 0.5) * controls.parallaxIntensity * 5}px) translateY(${(mousePosition.y - 0.5) * controls.parallaxIntensity * 2}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />
    </div>
  );
};
