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
    const pulse = Math.sin(animPhase * 0.05) * 0.2 + 0.8; // Subtle pulse
    const glow = Math.sin(animPhase * 0.03) * 2 + 6; // Gentle glow
    return {
      color: '#00ff00',
      textShadow: `
        0 0 ${glow}px #00ff00,
        0 0 ${glow * 1.5}px #00dd00,
        0 0 ${glow * 2}px rgba(0, 255, 0, 0.2)
      `,
      filter: `brightness(${pulse}) contrast(1.05)`,
      transform: `scale(${0.98 + pulse * 0.01})`,
    };
  };

  // Variation 2: Cyberpunk Neon - Slow color breathing
  const cyberpunkStyle = () => {
    const breathe = Math.sin(animPhase * 0.04) * 0.15 + 0.85; // Subtle breathing
    const hue = (animPhase * 0.5) % 360; // Slower color cycling
    const saturation = 85 + Math.sin(animPhase * 0.06) * 8; // Gentle saturation
    return {
      color: `hsl(${hue}, ${saturation}%, 70%)`,
      textShadow: `
        0 0 ${4 + breathe * 3}px hsl(${hue}, 100%, 50%),
        0 0 ${8 + breathe * 4}px hsl(${(hue + 30) % 360}, 80%, 60%),
        0 0 ${12 + breathe * 6}px rgba(255, 255, 255, 0.1)
      `,
      filter: `saturate(${1.1 + breathe * 0.2}) brightness(${0.9 + breathe * 0.15})`,
      transform: `scale(${0.99 + breathe * 0.005})`,
    };
  };

  // Variation 3: Holographic Rainbow - Gentle shimmer
  const holographicStyle = () => {
    const shimmer = Math.sin(animPhase * 0.08) * 0.3 + 0.7; // Gentle shimmer
    const shift = Math.sin(animPhase * 0.02) * 0.5; // Subtle shift
    return {
      color: '#ffffff',
      textShadow: `
        ${shift}px 0 0 rgba(255, 0, 0, ${0.6 + shimmer * 0.2}),
        ${shift * 1.2}px 0 0 rgba(255, 119, 0, ${0.5 + shimmer * 0.15}),
        ${shift * 1.5}px 0 0 rgba(255, 255, 0, ${0.4 + shimmer * 0.2}),
        ${shift * 1.8}px 0 0 rgba(0, 255, 0, ${0.3 + shimmer * 0.15}),
        ${shift * 2}px 0 0 rgba(0, 119, 255, ${0.4 + shimmer * 0.2}),
        ${shift * 2.2}px 0 0 rgba(136, 0, 255, ${0.3 + shimmer * 0.15}),
        0 0 ${6 + shimmer * 3}px rgba(255, 255, 255, 0.5)
      `,
      filter: `brightness(${1.05 + shimmer * 0.1}) contrast(1.02)`,
      transform: `translateX(${shift * 0.3}px)`,
    };
  };

  // Variation 4: VHS Static - Gentle vibration
  const vhsStyle = () => {
    const vibration = Math.sin(animPhase * 0.3) * 0.3; // Gentle vibration
    const glitch = Math.sin(animPhase * 0.1) * 0.2 + 0.8; // Soft glitch
    const chromatic = Math.sin(animPhase * 0.07) * 0.5; // Subtle chromatic aberration
    return {
      color: '#ffffff',
      textShadow: `
        ${chromatic}px 0 0 rgba(255, 0, 64, ${0.5 + glitch * 0.15}),
        ${-chromatic * 0.5}px 0 0 rgba(0, 255, 255, ${0.4 + glitch * 0.15}),
        0 0 ${4 + glitch * 2}px rgba(255, 255, 255, 0.7)
      `,
      filter: `
        contrast(${1.05 + glitch * 0.1}) 
        brightness(${0.95 + glitch * 0.08})
        saturate(${0.9 + glitch * 0.15})
      `,
      transform: `
        translateX(${vibration * 0.5}px)
        translateY(${vibration * 0.2}px)
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