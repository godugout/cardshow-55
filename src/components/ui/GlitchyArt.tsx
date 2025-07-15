import React, { useEffect, useState } from 'react';

interface GlitchyArtProps {
  children: string;
  className?: string;
}

export const GlitchyArt: React.FC<GlitchyArtProps> = ({ 
  children, 
  className = "" 
}) => {
  const [currentVariation, setCurrentVariation] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    // Switch variations every 5 seconds
    const variationInterval = setInterval(() => {
      setCurrentVariation(prev => (prev + 1) % 4);
    }, 5000);

    // Fast animation phases for glitch effects
    const phaseInterval = setInterval(() => {
      setAnimPhase(prev => prev + 1);
    }, 100);

    return () => {
      clearInterval(variationInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  // Variation 1: Matrix Green - Gentle pulse and glow
  const matrixStyle = () => {
    const pulse = Math.sin(animPhase * 0.05) * 0.3 + 0.7; // Slow, gentle pulse
    const glow = Math.sin(animPhase * 0.03) * 3 + 8; // Breathing glow effect
    return {
      color: '#00ff00',
      textShadow: `
        0 0 ${glow}px #00ff00,
        0 0 ${glow * 1.5}px #00dd00,
        0 0 ${glow * 2}px rgba(0, 255, 0, 0.3)
      `,
      filter: `brightness(${pulse}) contrast(1.1)`,
      transform: `scale(${0.98 + pulse * 0.02})`,
    };
  };

  // Variation 2: Cyberpunk Neon - Slow color breathing
  const cyberpunkStyle = () => {
    const breathe = Math.sin(animPhase * 0.04) * 0.2 + 0.8; // Slow breathing effect
    const hue = (animPhase * 0.8) % 360; // Much slower color cycling
    const saturation = 90 + Math.sin(animPhase * 0.06) * 10; // Gentle saturation variance
    return {
      color: `hsl(${hue}, ${saturation}%, 70%)`,
      textShadow: `
        0 0 ${6 + breathe * 4}px hsl(${hue}, 100%, 50%),
        0 0 ${10 + breathe * 6}px hsl(${(hue + 30) % 360}, 80%, 60%),
        0 0 ${14 + breathe * 8}px rgba(255, 255, 255, 0.1)
      `,
      filter: `saturate(${1.2 + breathe * 0.3}) brightness(${0.9 + breathe * 0.2})`,
      transform: `scale(${0.99 + breathe * 0.01})`,
    };
  };

  // Variation 3: Holographic Rainbow - Gentle shimmer
  const holographicStyle = () => {
    const shimmer = Math.sin(animPhase * 0.08) * 0.5 + 0.5; // Gentle shimmer
    const shift = Math.sin(animPhase * 0.02) * 1; // Very subtle shift
    return {
      color: '#ffffff',
      textShadow: `
        ${shift}px 0 0 rgba(255, 0, 0, ${0.7 + shimmer * 0.3}),
        ${shift * 1.5}px 0 0 rgba(255, 119, 0, ${0.6 + shimmer * 0.2}),
        ${shift * 2}px 0 0 rgba(255, 255, 0, ${0.5 + shimmer * 0.3}),
        ${shift * 2.5}px 0 0 rgba(0, 255, 0, ${0.4 + shimmer * 0.2}),
        ${shift * 3}px 0 0 rgba(0, 119, 255, ${0.5 + shimmer * 0.3}),
        ${shift * 3.5}px 0 0 rgba(136, 0, 255, ${0.4 + shimmer * 0.2}),
        0 0 ${8 + shimmer * 4}px rgba(255, 255, 255, 0.6)
      `,
      filter: `brightness(${1.1 + shimmer * 0.2}) contrast(1.05)`,
      transform: `translateX(${shift * 0.5}px)`,
    };
  };

  // Variation 4: VHS Static - Gentle vibration
  const vhsStyle = () => {
    const vibration = Math.sin(animPhase * 0.3) * 0.5; // Gentle vibration
    const glitch = Math.sin(animPhase * 0.1) * 0.3 + 0.7; // Soft glitch intensity
    const chromatic = Math.sin(animPhase * 0.07) * 1; // Subtle chromatic aberration
    return {
      color: '#ffffff',
      textShadow: `
        ${chromatic}px 0 0 rgba(255, 0, 64, ${0.6 + glitch * 0.2}),
        ${-chromatic * 0.7}px 0 0 rgba(0, 255, 255, ${0.5 + glitch * 0.2}),
        0 0 ${5 + glitch * 3}px rgba(255, 255, 255, 0.8)
      `,
      filter: `
        contrast(${1.1 + glitch * 0.2}) 
        brightness(${0.95 + glitch * 0.1})
        saturate(${0.9 + glitch * 0.2})
      `,
      transform: `
        translateX(${vibration}px)
        translateY(${vibration * 0.3}px)
      `,
    };
  };

  const variations = [matrixStyle, cyberpunkStyle, holographicStyle, vhsStyle];
  const currentStyle = variations[currentVariation]();

  return (
    <span 
      className={`relative inline-block font-mono tracking-wider font-bold transition-all duration-300 ${className}`}
      style={{
        ...currentStyle,
        transitionProperty: 'color, text-shadow, filter, transform',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </span>
  );
};