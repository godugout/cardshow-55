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
    const pulse = Math.sin(animPhase * 0.05) * 0.05 + 0.95; // Reduced pulse
    const glow = Math.sin(animPhase * 0.03) * 1 + 4; // Reduced glow
    return {
      color: '#00ff00',
      fontFamily: "'JetBrains Mono', monospace",
      textShadow: `
        0 0 ${glow}px #00ff00,
        0 0 ${glow * 1.5}px #00dd00,
        0 0 ${glow * 2}px rgba(0, 255, 0, 0.2)
      `,
      filter: `brightness(${pulse}) contrast(1.02)`,
      transform: `scale(${pulse})`,
      transformOrigin: 'center',
    };
  };

  // Variation 2: Cyberpunk Neon - Slow color breathing
  const cyberpunkStyle = () => {
    const breathe = Math.sin(animPhase * 0.04) * 0.15 + 0.85; // Subtle breathing
    const hue = (animPhase * 0.5) % 360; // Slower color cycling
    const saturation = 85 + Math.sin(animPhase * 0.06) * 8; // Gentle saturation
    return {
      color: `hsl(${hue}, ${saturation}%, 70%)`,
      fontFamily: "'Exo 2', sans-serif",
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
      fontFamily: "'Audiowide', cursive",
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
    const vibration = Math.sin(animPhase * 0.3) * 0.1; // Reduced vibration
    const glitch = Math.sin(animPhase * 0.1) * 0.05 + 0.95; // Reduced glitch
    const chromatic = Math.sin(animPhase * 0.07) * 0.2; // Reduced chromatic aberration
    return {
      color: '#ffffff',
      fontFamily: "'Source Code Pro', monospace",
      textShadow: `
        ${chromatic}px 0 0 rgba(255, 0, 64, ${0.4 + glitch * 0.1}),
        ${-chromatic * 0.5}px 0 0 rgba(0, 255, 255, ${0.3 + glitch * 0.1}),
        0 0 ${3 + glitch * 1}px rgba(255, 255, 255, 0.6)
      `,
      filter: `
        contrast(${glitch * 0.05 + 1}) 
        brightness(${glitch})
        saturate(${0.95 + glitch * 0.05})
      `,
      transform: `
        translateX(${vibration}px)
        translateY(${vibration * 0.5}px)
        scale(${glitch})
      `,
      transformOrigin: 'center',
    };
  };

  const variations = [matrixStyle, cyberpunkStyle, holographicStyle, vhsStyle];
  const currentStyle = variations[currentVariation]();

  return (
    <span 
      className={`relative inline-block tracking-wider font-bold transition-all duration-300 ${className}`}
      style={{
        ...currentStyle,
        transitionProperty: 'color, text-shadow, filter, transform',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        lineHeight: '1.2',
        verticalAlign: 'baseline',
        display: 'inline-block',
        minHeight: '1.2em',
        overflow: 'hidden',
      }}
    >
      {children}
    </span>
  );
};