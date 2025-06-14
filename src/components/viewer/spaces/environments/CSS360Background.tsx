
import React, { useRef, useEffect, useState } from 'react';
import type { Panoramic360Environment } from './Panoramic360Library';

interface CSS360BackgroundProps {
  environment: Panoramic360Environment;
  mousePosition: { x: number; y: number };
  autoRotate?: boolean;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export const CSS360Background: React.FC<CSS360BackgroundProps> = ({
  environment,
  mousePosition,
  autoRotate = false,
  onLoadComplete,
  onLoadError
}) => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const rotationRef = useRef(0);

  console.log('🌍 CSS360Background rendering:', environment.name);

  // Load image and handle errors
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ 360° background loaded:', environment.name);
      setIsLoaded(true);
      setLoadError(null);
      onLoadComplete?.();
    };
    
    img.onerror = () => {
      const error = new Error(`Failed to load 360° background: ${environment.name}`);
      console.error('❌ 360° background failed:', error);
      setLoadError(error);
      onLoadError?.(error);
    };
    
    img.src = environment.imageUrl;
  }, [environment.imageUrl, environment.name, onLoadComplete, onLoadError]);

  // Mouse parallax effect
  useEffect(() => {
    if (!backgroundRef.current || !isLoaded) return;

    const parallaxX = (mousePosition.x - 0.5) * environment.effects.parallaxStrength * 20;
    const parallaxY = (mousePosition.y - 0.5) * environment.effects.parallaxStrength * 10;
    
    backgroundRef.current.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(1.1)`;
  }, [mousePosition, environment.effects.parallaxStrength, isLoaded]);

  // Auto rotation
  useEffect(() => {
    if (!autoRotate || !backgroundRef.current) return;

    const interval = setInterval(() => {
      rotationRef.current += environment.camera.autoRotateSpeed;
      if (backgroundRef.current) {
        const parallaxX = (mousePosition.x - 0.5) * environment.effects.parallaxStrength * 20;
        const parallaxY = (mousePosition.y - 0.5) * environment.effects.parallaxStrength * 10;
        
        backgroundRef.current.style.transform = 
          `translate3d(${parallaxX}px, ${parallaxY}px, 0) rotateZ(${rotationRef.current}deg) scale(1.1)`;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate, environment.camera.autoRotateSpeed, environment.effects.parallaxStrength, mousePosition]);

  if (loadError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main 360° Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-[-10%] transition-transform duration-100 ease-out"
        style={{
          backgroundImage: `url(${environment.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: `brightness(${environment.lighting.brightness}) contrast(${environment.lighting.contrast})`,
          willChange: 'transform'
        }}
      />

      {/* Depth Layers */}
      {environment.effects.depthLayers && (
        <>
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                rgba(255,255,255,0.1) 0%, transparent 50%)`
            }}
          />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(${mousePosition.x * 360}deg, 
                rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`
            }}
          />
        </>
      )}

      {/* Ambient Particles */}
      {environment.effects.ambientParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Lighting Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: environment.lighting.warmth > 0.5 
            ? `linear-gradient(135deg, rgba(255,200,100,${environment.lighting.warmth * 0.1}) 0%, transparent 50%)`
            : `linear-gradient(135deg, rgba(100,200,255,${(1 - environment.lighting.warmth) * 0.1}) 0%, transparent 50%)`
        }}
      />
    </div>
  );
};
