
import React, { useEffect, useState } from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface GoldEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const GoldEffect: React.FC<GoldEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const goldIntensity = getEffectParam('gold', 'intensity', 0);
  const goldTone = getEffectParam('gold', 'goldTone', 'rich');
  const shimmerSpeed = getEffectParam('gold', 'shimmerSpeed', 80);
  const colorEnhancement = getEffectParam('gold', 'colorEnhancement', true);

  // For solar flare animation
  const [flarePosition, setFlarePosition] = useState({ x: Math.random(), y: Math.random() });
  const [flareActive, setFlareActive] = useState(false);
  const [flareOpacity, setFlareOpacity] = useState(0);
  
  // Trigger solar flare randomly
  useEffect(() => {
    if (goldIntensity <= 0 || goldTone !== 'solar') return;
    
    // Random flare timer
    const flareTimer = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to create a flare
        setFlarePosition({ 
          x: Math.random() * 0.8 + 0.1, // Keep away from extreme edges
          y: Math.random() * 0.8 + 0.1
        });
        setFlareActive(true);
        setFlareOpacity(0.6 + Math.random() * 0.3); // Random opacity between 0.6-0.9
        
        // Fade out flare
        setTimeout(() => {
          setFlareActive(false);
        }, 1500 + Math.random() * 2000);
      }
    }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds
    
    return () => {
      clearInterval(flareTimer);
    };
  }, [goldIntensity, goldTone]);

  if (goldIntensity <= 0) return null;

  // New color and styling logic based on goldTone
  let mainColors, accentColors, blendMode;
  
  if (goldTone === 'solar') {
    // Aurora-like colors (blues and greens with subtle purples)
    mainColors = {
      primary: `rgba(40, 170, 255, ${(goldIntensity / 100) * 0.25})`,
      secondary: `rgba(30, 210, 140, ${(goldIntensity / 100) * 0.3})`,
      tertiary: `rgba(120, 140, 255, ${(goldIntensity / 100) * 0.2})`,
      accent: `rgba(80, 200, 170, ${(goldIntensity / 100) * 0.25})`
    };
    accentColors = {
      flare1: `rgba(255, 100, 50, ${flareActive ? flareOpacity : 0})`,
      flare2: `rgba(255, 180, 50, ${flareActive ? flareOpacity * 0.7 : 0})`
    };
    blendMode = 'screen';
  } else {
    // Traditional gold colors
    mainColors = {
      primary: `rgba(255, 215, 0, ${(goldIntensity / 100) * 0.25})`,
      secondary: `rgba(255, 165, 0, ${(goldIntensity / 100) * 0.15})`,
      tertiary: `rgba(184, 134, 11, ${(goldIntensity / 100) * 0.1})`,
      accent: `rgba(255, 235, 122, ${(goldIntensity / 100) * 0.2})`
    };
    accentColors = {
      flare1: 'transparent',
      flare2: 'transparent'
    };
    blendMode = 'screen';
  }

  const animationDuration = 10000 / (shimmerSpeed / 100);

  return (
    <>
      {/* Base layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: goldTone === 'solar' ? 
            // Aurora base effect
            `radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${mainColors.primary} 0%,
              ${mainColors.secondary} 50%,
              ${mainColors.tertiary} 80%,
              transparent 100%
            )` :
            // Gold base effect
            `radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${mainColors.primary} 0%,
              ${mainColors.secondary} 40%,
              ${mainColors.tertiary} 70%,
              transparent 100%
            )`,
          mixBlendMode: blendMode,
          opacity: goldTone === 'solar' ? 0.75 : 0.6
        }}
      />
      
      {/* Shimmer layer */}
      <div
        className="absolute inset-0 z-21 transition-opacity"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              transparent 0%,
              ${mainColors.accent} 20%,
              ${goldTone === 'solar' ? 'rgba(120, 255, 200, 0.35)' : 'rgba(255, 215, 0, 0.2)'} 50%,
              ${mainColors.accent} 80%,
              transparent 100%
            )
          `,
          mixBlendMode: goldTone === 'solar' ? 'overlay' : 'overlay',
          opacity: 0.4,
          animation: colorEnhancement ? `pulse ${animationDuration}ms infinite alternate` : 'none'
        }}
      />

      {/* Aurora waves for solar mode */}
      {goldTone === 'solar' && (
        <div
          className="absolute inset-0 z-22"
          style={{
            background: `
              linear-gradient(
                ${180 + mousePosition.y * 40}deg,
                transparent 0%,
                rgba(20, 175, 240, ${(goldIntensity / 100) * 0.15}) 20%,
                rgba(70, 230, 180, ${(goldIntensity / 100) * 0.2}) 40%, 
                rgba(40, 130, 255, ${(goldIntensity / 100) * 0.15}) 60%,
                rgba(100, 210, 160, ${(goldIntensity / 100) * 0.2}) 80%,
                transparent 100%
              )
            `,
            backgroundSize: '400% 400%',
            animation: `aurora ${animationDuration * 2}ms ease infinite`,
            mixBlendMode: 'screen',
            opacity: 0.8
          }}
        />
      )}

      {/* Solar flare effect */}
      {goldTone === 'solar' && (
        <div
          className="absolute inset-0 z-23 transition-opacity duration-1000"
          style={{
            background: `
              radial-gradient(
                circle at ${flarePosition.x * 100}% ${flarePosition.y * 100}%,
                ${accentColors.flare1} 0%,
                ${accentColors.flare2} 30%,
                transparent 70%
              )
            `,
            mixBlendMode: 'screen',
            opacity: flareActive ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out'
          }}
        />
      )}

      {/* Add a style tag for animations */}
      <style jsx>{`
        @keyframes aurora {
          0% { background-position: 0% 0% }
          50% { background-position: 100% 100% }
          100% { background-position: 0% 0% }
        }
        @keyframes pulse {
          0% { opacity: 0.3 }
          100% { opacity: 0.6 }
        }
      `}</style>
    </>
  );
};
