import React, { useEffect, useState } from 'react';

interface GlitchyArtProps {
  children: string;
  className?: string;
}

interface LetterState {
  char: string;
  isAnimating: boolean;
  animationType: 'spell' | 'spin' | 'float' | 'glow';
  animationProgress: number;
  rotation: number;
  float: number;
  lean: number;
  glowIntensity: number;
}

export const GlitchyArt: React.FC<GlitchyArtProps> = ({ 
  children, 
  className = "" 
}) => {
  const [currentVariation, setCurrentVariation] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);
  const [letters, setLetters] = useState<LetterState[]>(() => 
    children.split('').map(char => ({
      char,
      isAnimating: false,
      animationType: 'float' as const,
      animationProgress: 0,
      rotation: Math.random() * 10 - 5,
      float: Math.random() * 2,
      lean: Math.random() * 5 - 2.5,
      glowIntensity: 0.5 + Math.random() * 0.5
    }))
  );
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);

  useEffect(() => {
    // Switch variations every 5 seconds
    const variationInterval = setInterval(() => {
      setCurrentVariation(prev => (prev + 1) % 4);
      // Reset letter animations for new variation
      setActiveAnimations([]);
    }, 5000);

    // Fast animation phases for effects
    const phaseInterval = setInterval(() => {
      setAnimPhase(prev => prev + 1);
    }, 100);

    return () => {
      clearInterval(variationInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  // Manage individual letter animations
  useEffect(() => {
    const letterInterval = setInterval(() => {
      setLetters(prev => prev.map((letter, index) => ({
        ...letter,
        rotation: letter.rotation + (Math.sin(animPhase * 0.02 + index) * 0.3),
        float: 2 + Math.sin(animPhase * 0.03 + index * 0.5) * 1.5,
        lean: Math.sin(animPhase * 0.025 + index * 0.3) * 3,
        glowIntensity: 0.5 + Math.sin(animPhase * 0.04 + index * 0.7) * 0.4
      })));

      // Randomly activate 2-3 letters for special animations
      if (Math.random() < 0.3) {
        const availableLetters = letters.map((_, i) => i).filter(i => !activeAnimations.includes(i));
        if (availableLetters.length > 0) {
          const numToAnimate = Math.min(2 + Math.floor(Math.random() * 2), availableLetters.length);
          const newActive = [];
          for (let i = 0; i < numToAnimate; i++) {
            const randomIndex = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            newActive.push(randomIndex);
            availableLetters.splice(availableLetters.indexOf(randomIndex), 1);
          }
          setActiveAnimations(newActive);
          
          // Clear animations after 2-3 seconds
          setTimeout(() => {
            setActiveAnimations(prev => prev.filter(i => !newActive.includes(i)));
          }, 2000 + Math.random() * 1000);
        }
      }
    }, 150);

    return () => clearInterval(letterInterval);
  }, [animPhase, activeAnimations, letters]);

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
  const baseStyle = variations[currentVariation]();

  const getLetterStyle = (letter: LetterState, index: number) => {
    const isActive = activeAnimations.includes(index);
    const specialEffectMultiplier = isActive ? letter.glowIntensity * 2 : 1;
    
    return {
      display: 'inline-block',
      transform: `
        rotateZ(${letter.rotation}deg)
        rotateX(${letter.lean}deg)
        translateY(${-letter.float}px)
        ${isActive ? `rotateY(${Math.sin(animPhase * 0.1 + index) * 20}deg)` : ''}
        ${isActive ? `scale(${1 + Math.sin(animPhase * 0.08 + index) * 0.1})` : ''}
      `,
      filter: `brightness(${1 + (isActive ? 0.5 : 0) * Math.sin(animPhase * 0.06 + index)})`,
      textShadow: isActive ? `
        ${baseStyle.textShadow},
        0 0 ${15 * specialEffectMultiplier}px currentColor,
        0 0 ${25 * specialEffectMultiplier}px currentColor
      ` : baseStyle.textShadow,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transformOrigin: 'center center',
    };
  };

  return (
    <span 
      className={`relative inline-block font-mono tracking-wider font-bold ${className}`}
      style={{
        color: baseStyle.color,
        filter: baseStyle.filter,
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          style={getLetterStyle(letter, index)}
        >
          {letter.char}
        </span>
      ))}
    </span>
  );
};