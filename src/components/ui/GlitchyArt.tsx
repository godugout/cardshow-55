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
    color: '#00ff00',
    textShadow: `
      ${animPhase % 2 === 0 ? '2px' : '-1px'} 0 0 #00ff00,
      ${animPhase % 3 === 0 ? '-1px' : '2px'} 0 0 #008800,
      0 0 ${10 + (animPhase % 5) * 2}px #00ff00
    `,
    filter: `contrast(1.3) brightness(${0.8 + (animPhase % 10) * 0.04})`,
    transform: `translateX(${animPhase % 7 === 0 ? (animPhase % 2 === 0 ? '2px' : '-2px') : '0'})`,
  });

  // Variation 2: Cyberpunk Neon
  const cyberpunkStyle = () => {
    const hue = (animPhase * 3) % 360;
    return {
      color: `hsl(${hue}, 90%, 70%)`,
      textShadow: `
        0 0 ${5 + (animPhase % 3)}px hsl(${hue}, 100%, 50%),
        0 0 ${10 + (animPhase % 5)}px hsl(${hue + 60}, 100%, 60%),
        0 0 ${15 + (animPhase % 4)}px hsl(${hue + 120}, 100%, 70%)
      `,
      filter: 'contrast(1.2)',
      transform: `scale(${1 + (animPhase % 8 === 0 ? 0.02 : 0)})`,
    };
  };

  // Variation 3: Holographic Rainbow
  const holographicStyle = () => ({
    color: '#ffffff',
    textShadow: `
      1px 1px 0 #ff0080,
      -1px -1px 0 #0080ff,
      2px 0 0 #ff8000,
      -2px 0 0 #8000ff,
      0 2px 0 #00ff80,
      0 -2px 0 #ff0040
    `,
    filter: `hue-rotate(${animPhase * 5}deg) saturate(1.2)`,
    transform: `skew(${animPhase % 6 === 0 ? (animPhase % 2 === 0 ? '1deg' : '-1deg') : '0'})`,
  });

  // Variation 4: VHS Static
  const vhsStyle = () => ({
    color: '#ffffff',
    textShadow: `
      ${animPhase % 3 === 0 ? '3px' : '1px'} 0 0 #ff0040,
      ${animPhase % 4 === 0 ? '-2px' : '-1px'} 0 0 #00ffff,
      0 0 ${8 + (animPhase % 6)}px rgba(255, 255, 255, 0.8)
    `,
    filter: `contrast(${1.1 + (animPhase % 8) * 0.05}) brightness(${0.9 + (animPhase % 6) * 0.02})`,
    transform: `
      translateY(${animPhase % 12 === 0 ? (animPhase % 2 === 0 ? '1px' : '-1px') : '0'})
      scaleY(${animPhase % 15 === 0 ? '0.98' : '1'})
    `,
  });

  // Variation 5: Pixel Dissolve to Matrix
  const pixelDissolveStyle = () => {
    const dissolvePhase = (animPhase % 50) / 50; // 5 second cycle
    const isDissolving = dissolvePhase < 0.3; // First 1.5 seconds
    const isReforming = dissolvePhase > 0.3 && dissolvePhase < 0.7; // Next 2 seconds
    const isMatrix = dissolvePhase >= 0.7; // Final 1.5 seconds
    
    if (isDissolving) {
      // Dissolve phase - pixelated fade out
      const dissolveAmount = dissolvePhase / 0.3;
      return {
        color: `rgba(255, 255, 255, ${1 - dissolveAmount * 0.8})`,
        textShadow: `
          0 0 ${2 + dissolveAmount * 8}px rgba(255, 255, 255, ${1 - dissolveAmount}),
          ${dissolveAmount * 4}px 0 0 rgba(255, 255, 255, ${0.5 - dissolveAmount * 0.5}),
          ${-dissolveAmount * 3}px 0 0 rgba(255, 255, 255, ${0.3 - dissolveAmount * 0.3})
        `,
        filter: `blur(${dissolveAmount * 2}px) contrast(${1 - dissolveAmount * 0.5})`,
        transform: `scale(${1 + dissolveAmount * 0.2}) translateY(${dissolveAmount * 10}px)`,
      };
    } else if (isReforming) {
      // Reforming phase - vertical streams
      const reformAmount = (dissolvePhase - 0.3) / 0.4;
      const streamOffset = Math.sin(animPhase * 0.3) * 2;
      return {
        color: `rgba(0, 255, 0, ${reformAmount * 0.8})`,
        textShadow: `
          0 ${streamOffset}px 0 rgba(0, 255, 0, ${reformAmount}),
          0 ${streamOffset + 2}px 0 rgba(0, 200, 0, ${reformAmount * 0.8}),
          0 ${streamOffset + 4}px 0 rgba(0, 150, 0, ${reformAmount * 0.6}),
          0 ${streamOffset + 6}px 0 rgba(0, 100, 0, ${reformAmount * 0.4})
        `,
        filter: `contrast(${1 + reformAmount * 0.5}) brightness(${0.8 + reformAmount * 0.4})`,
        transform: `translateY(${-20 + reformAmount * 20}px) scaleY(${0.6 + reformAmount * 0.4})`,
      };
    } else {
      // Matrix phase - full green with vertical effects
      const matrixIntensity = Math.sin(animPhase * 0.2) * 0.5 + 0.5;
      const verticalShift = Math.sin(animPhase * 0.15) * 3;
      return {
        color: '#00ff00',
        textShadow: `
          0 ${verticalShift}px 0 #00ff00,
          0 ${verticalShift + 1}px 0 #00dd00,
          0 ${verticalShift + 2}px 0 #00bb00,
          0 ${verticalShift + 3}px 0 #009900,
          0 0 ${5 + matrixIntensity * 10}px #00ff00
        `,
        filter: `contrast(1.3) brightness(${0.9 + matrixIntensity * 0.2})`,
        transform: `translateY(${verticalShift * 0.5}px) scaleY(${1 + matrixIntensity * 0.05})`,
      };
    }
  };

  const variations = [matrixStyle, cyberpunkStyle, holographicStyle, vhsStyle, pixelDissolveStyle];
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