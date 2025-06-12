
import React, { useEffect, useState } from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface AuroraEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const AuroraEffect: React.FC<AuroraEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const auroraIntensity = getEffectParam('aurora', 'intensity', 0);
  const waveSpeed = getEffectParam('aurora', 'waveSpeed', 80);
  const colorShift = getEffectParam('aurora', 'colorShift', 120);

  // For aurora flare animation
  const [flarePosition, setFlarePosition] = useState({ x: Math.random(), y: Math.random() });
  const [flareActive, setFlareActive] = useState(false);
  const [flareOpacity, setFlareOpacity] = useState(0);
  
  // Trigger aurora flare randomly
  useEffect(() => {
    if (auroraIntensity <= 0) return;
    
    const flareTimer = setInterval(() => {
      if (Math.random() > 0.6) { // More frequent flares
        setFlarePosition({ 
          x: Math.random() * 0.8 + 0.1,
          y: Math.random() * 0.8 + 0.1
        });
        setFlareActive(true);
        setFlareOpacity(0.7 + Math.random() * 0.3); // Brighter flares
        
        setTimeout(() => {
          setFlareActive(false);
        }, 1200 + Math.random() * 1800);
      }
    }, 2500 + Math.random() * 3500);
    
    return () => {
      clearInterval(flareTimer);
    };
  }, [auroraIntensity]);

  if (auroraIntensity <= 0) return null;

  const animationDuration = 8000 / (waveSpeed / 100); // Faster animations

  return (
    <>
      {/* Base Aurora Layer - Enhanced blue-green waves */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(0, 255, 127, ${(auroraIntensity / 100) * 0.5}) 0%,
              rgba(32, 178, 170, ${(auroraIntensity / 100) * 0.55}) 40%,
              rgba(72, 61, 139, ${(auroraIntensity / 100) * 0.4}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.9
        }}
      />
      
      {/* Aurora Waves - More vibrant flowing colors */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${180 + mousePosition.y * 50}deg,
              transparent 0%,
              rgba(0, 255, 255, ${(auroraIntensity / 100) * 0.4}) 15%,
              rgba(50, 205, 50, ${(auroraIntensity / 100) * 0.45}) 35%, 
              rgba(138, 43, 226, ${(auroraIntensity / 100) * 0.4}) 55%,
              rgba(255, 20, 147, ${(auroraIntensity / 100) * 0.35}) 75%,
              transparent 100%
            )
          `,
          backgroundSize: '350% 350%',
          animation: `aurora-flow ${animationDuration * 1.8}ms ease infinite`,
          mixBlendMode: 'screen',
          opacity: 1.0
        }}
      />

      {/* Aurora Flare - Enhanced red/orange flashes */}
      <div
        className="absolute inset-0 z-22 transition-opacity duration-800"
        style={{
          background: `
            radial-gradient(
              circle at ${flarePosition.x * 100}% ${flarePosition.y * 100}%,
              rgba(255, 69, 0, ${flareActive ? flareOpacity : 0}) 0%,
              rgba(255, 140, 0, ${flareActive ? flareOpacity * 0.9 : 0}) 35%,
              rgba(255, 215, 0, ${flareActive ? flareOpacity * 0.6 : 0}) 60%,
              transparent 75%
            )
          `,
          mixBlendMode: 'screen',
          opacity: flareActive ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out'
        }}
      />

      {/* Enhanced shimmer layer for color shift */}
      <div
        className="absolute inset-0 z-23 transition-opacity"
        style={{
          background: `
            linear-gradient(
              ${colorShift + mousePosition.x * 120}deg,
              transparent 0%,
              rgba(0, 255, 127, 0.35) 20%,
              rgba(32, 178, 170, 0.4) 50%,
              rgba(0, 255, 127, 0.35) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.8,
          animation: `aurora-shimmer ${animationDuration * 0.8}ms infinite alternate`
        }}
      />

      {/* NEW: Particle sparkles layer */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 1px, transparent 2px),
            radial-gradient(circle at 60% 70%, rgba(0, 255, 127, 0.4) 1px, transparent 2px),
            radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.3) 1px, transparent 2px),
            radial-gradient(circle at 30% 80%, rgba(255, 69, 0, 0.4) 1px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 120px 120px, 80px 80px, 140px 140px',
          opacity: (auroraIntensity / 100) * 0.6,
          animation: `aurora-sparkle ${animationDuration * 3}ms linear infinite`
        }}
      />

      {/* Enhanced style tag for animations */}
      <style>
        {`
          @keyframes aurora-flow {
            0% { background-position: 0% 0% }
            33% { background-position: 100% 50% }
            66% { background-position: 50% 100% }
            100% { background-position: 0% 0% }
          }
          @keyframes aurora-shimmer {
            0% { opacity: 0.5; transform: translateX(-10px) }
            100% { opacity: 1.0; transform: translateX(10px) }
          }
          @keyframes aurora-sparkle {
            0% { transform: translateY(0px) rotate(0deg) }
            100% { transform: translateY(-20px) rotate(360deg) }
          }
        `}
      </style>
    </>
  );
};
