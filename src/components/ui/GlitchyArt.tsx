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
      setCurrentVariation(prev => (prev + 1) % 5);
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

  // Variation 1: Matrix Green Glitch
  const matrixStyle = () => ({
    textShadow: `
      ${animPhase % 2 === 0 ? '2px' : '-1px'} 0 0 #00ff00,
      ${animPhase % 3 === 0 ? '-1px' : '2px'} 0 0 #008800,
      0 0 ${10 + (animPhase % 5) * 2}px #00ff00
    `,
    background: 'linear-gradient(45deg, #00ff00, #00aa00, #004400)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: `contrast(1.3) brightness(${0.8 + (animPhase % 10) * 0.04})`,
    transform: `translateX(${animPhase % 7 === 0 ? (animPhase % 2 === 0 ? '2px' : '-2px') : '0'})`,
  });

  // Variation 2: Cyberpunk Neon
  const cyberpunkStyle = () => {
    const hue = (animPhase * 3) % 360;
    return {
      textShadow: `
        0 0 ${5 + (animPhase % 3)}px hsl(${hue}, 100%, 50%),
        0 0 ${10 + (animPhase % 5)}px hsl(${hue + 60}, 100%, 60%),
        0 0 ${15 + (animPhase % 4)}px hsl(${hue + 120}, 100%, 70%)
      `,
      background: `linear-gradient(90deg, hsl(${hue}, 90%, 60%), hsl(${hue + 60}, 80%, 70%), hsl(${hue + 120}, 90%, 60%))`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'contrast(1.2)',
      transform: `scale(${1 + (animPhase % 8 === 0 ? 0.02 : 0)})`,
    };
  };

  // Variation 3: Holographic Rainbow
  const holographicStyle = () => ({
    textShadow: `
      1px 1px 0 #ff0080,
      -1px -1px 0 #0080ff,
      2px 0 0 #ff8000,
      -2px 0 0 #8000ff,
      0 2px 0 #00ff80,
      0 -2px 0 #ff0040
    `,
    background: `
      linear-gradient(
        ${(animPhase * 2) % 360}deg, 
        #ff0080, #0080ff, #ff8000, #8000ff, #00ff80, #ff0040, #ff0080
      )
    `,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: `hue-rotate(${animPhase * 5}deg) saturate(1.2)`,
    transform: `skew(${animPhase % 6 === 0 ? (animPhase % 2 === 0 ? '1deg' : '-1deg') : '0'})`,
  });

  // Variation 4: VHS Static
  const vhsStyle = () => ({
    textShadow: `
      ${animPhase % 3 === 0 ? '3px' : '1px'} 0 0 #ff0040,
      ${animPhase % 4 === 0 ? '-2px' : '-1px'} 0 0 #00ffff,
      0 0 ${8 + (animPhase % 6)}px rgba(255, 255, 255, 0.8)
    `,
    background: 'linear-gradient(45deg, #ff0040, #ffffff, #00ffff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: `contrast(${1.1 + (animPhase % 8) * 0.05}) brightness(${0.9 + (animPhase % 6) * 0.02})`,
    transform: `
      translateY(${animPhase % 12 === 0 ? (animPhase % 2 === 0 ? '1px' : '-1px') : '0'})
      scaleY(${animPhase % 15 === 0 ? '0.98' : '1'})
    `,
  });

  // Variation 5: Digital Corruption
  const corruptionStyle = () => {
    const glitchIntensity = animPhase % 20 === 0 ? 1 : 0.3;
    return {
      textShadow: `
        ${glitchIntensity * 4}px 0 0 #ff00ff,
        ${glitchIntensity * -3}px 0 0 #00ffff,
        0 0 ${5 + glitchIntensity * 10}px #ffffff
      `,
      background: 'linear-gradient(135deg, #ff00ff, #00ffff, #ffff00, #ff00ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: `
        contrast(${1.2 + glitchIntensity * 0.3}) 
        brightness(${0.8 + glitchIntensity * 0.4})
        blur(${glitchIntensity * 0.5}px)
      `,
      transform: `
        translateX(${glitchIntensity * (animPhase % 2 === 0 ? 3 : -3)}px)
        scaleX(${1 + glitchIntensity * 0.1})
      `,
    };
  };

  const variations = [matrixStyle, cyberpunkStyle, holographicStyle, vhsStyle, corruptionStyle];
  const currentStyle = variations[currentVariation]();

  return (
    <span 
      className={`relative inline-block font-mono tracking-wider font-bold transition-all duration-100 ${className}`}
      style={{
        ...currentStyle,
        transitionProperty: 'transform, filter',
      }}
    >
      {children}
    </span>
  );
};