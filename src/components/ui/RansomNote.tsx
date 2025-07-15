import React, { useEffect, useState } from 'react';

interface RansomNoteProps {
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
  style: LetterStyle;
}

interface LetterStyle {
  color: string;
  fontFamily: string;
  fontSize: string;
  backgroundColor: string;
  textShadow: string;
}

export const RansomNote: React.FC<RansomNoteProps> = ({ 
  children, 
  className = "" 
}) => {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [animPhase, setAnimPhase] = useState(0);
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  // Text colors with good contrast
  const textColors = [
    '#ffffff', '#000000', '#1a1a1a', '#f5f5f5', '#2d2d2d', '#e8e8e8'
  ];

  // Diverse font families for variety
  const fontFamilies = [
    'Arial Black', 'Impact', 'Georgia', 'Times New Roman', 'Courier New',
    'Helvetica Neue', 'Verdana', 'Trebuchet MS', 'Comic Sans MS', 'Palatino',
    'Futura', 'Monaco', 'Garamond', 'Rockwell', 'Franklin Gothic Medium'
  ];

  // Background patterns and textures
  const backgroundStyles = [
    // Solid colors
    { background: 'hsl(var(--crd-green))', pattern: 'solid' },
    { background: 'hsl(var(--crd-blue))', pattern: 'solid' },
    { background: 'hsl(var(--crd-purple))', pattern: 'solid' },
    { background: 'hsl(var(--crd-orange))', pattern: 'solid' },
    { background: '#ff6b6b', pattern: 'solid' },
    { background: '#4ecdc4', pattern: 'solid' },
    { background: '#45b7d1', pattern: 'solid' },
    { background: '#f9ca24', pattern: 'solid' },
    { background: '#f0932b', pattern: 'solid' },
    { background: '#eb4d4b', pattern: 'solid' },
    { background: '#6c5ce7', pattern: 'solid' },
    
    // Striped patterns
    { background: 'repeating-linear-gradient(45deg, #ff6b6b, #ff6b6b 10px, #ffffff 10px, #ffffff 20px)', pattern: 'stripes' },
    { background: 'repeating-linear-gradient(0deg, #4ecdc4, #4ecdc4 8px, #ffffff 8px, #ffffff 16px)', pattern: 'stripes' },
    { background: 'repeating-linear-gradient(90deg, #45b7d1, #45b7d1 12px, #f8f9fa 12px, #f8f9fa 24px)', pattern: 'stripes' },
    
    // Dotted patterns
    { background: 'radial-gradient(circle at 20% 50%, #f9ca24 20%, transparent 50%), radial-gradient(circle at 70% 50%, #f9ca24 20%, transparent 50%), #ffffff', pattern: 'dots' },
    { background: 'radial-gradient(circle at 25% 25%, #6c5ce7 25%, transparent 50%), #f8f9fa', pattern: 'dots' },
    
    // Gradients
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'gradient' },
    { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', pattern: 'gradient' },
    { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', pattern: 'gradient' },
    
    // Newspaper/magazine textures
    { background: '#f5f5dc', pattern: 'newspaper' },
    { background: '#faf0e6', pattern: 'magazine' },
    { background: '#fff8dc', pattern: 'vintage' }
  ];

  // Enhanced contrast checking function
  const getContrastingColor = (bgColor: string): string => {
    // For dark backgrounds, use light text
    const darkBgs = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#6c5ce7', '#eb4d4b', '#f0932b'];
    const lightBgs = ['#f9ca24', '#f5f5dc', '#faf0e6', '#fff8dc', '#ffffff', '#f8f9fa'];
    
    if (bgColor.includes('gradient') || bgColor.includes('repeating')) {
      return Math.random() > 0.5 ? '#ffffff' : '#000000';
    }
    
    const isDark = darkBgs.some(color => bgColor.includes(color)) || 
                   bgColor.includes('--crd-') || 
                   (bgColor.includes('#') && !lightBgs.some(color => bgColor.includes(color)));
    
    return isDark ? '#ffffff' : '#000000';
  };

  const generateLetterStyle = (): LetterStyle => {
    const bgStyle = backgroundStyles[Math.floor(Math.random() * backgroundStyles.length)];
    const textColor = getContrastingColor(bgStyle.background);
    
    // Enhanced decorative effects
    const decorations = [
      'none',
      '2px 2px 4px rgba(0,0,0,0.3)',
      '1px 1px 2px rgba(255,255,255,0.8)',
      '0 0 3px rgba(0,0,0,0.5)',
      'inset 0 1px 0 rgba(255,255,255,0.2)',
    ];

    return {
      color: textColor,
      fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
      fontSize: `${0.7 + Math.random() * 0.6}em`, // 0.7em to 1.3em for more height variation
      backgroundColor: bgStyle.background,
      textShadow: decorations[Math.floor(Math.random() * decorations.length)]
    };
  };

  useEffect(() => {
    // Initialize letters with animation states
    const initializeLetters = () => {
      const newLetters = children.split('').map(char => ({
        char,
        isAnimating: false,
        animationType: 'float' as const,
        animationProgress: 0,
        rotation: Math.random() * 10 - 5,
        float: Math.random() * 2,
        lean: Math.random() * 5 - 2.5,
        glowIntensity: 0.5 + Math.random() * 0.5,
        style: generateLetterStyle()
      }));
      setLetters(newLetters);
    };

    initializeLetters();
  }, [children]);

  useEffect(() => {
    // Switch variations every 5 seconds
    const variationInterval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
      // Reset letter animations for new variation
      setActiveAnimations([]);
      // Regenerate all letter styles
      setLetters(prev => prev.map(letter => ({
        ...letter,
        style: generateLetterStyle()
      })));
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

  const getLetterStyle = (letter: LetterState, index: number) => {
    const isActive = activeAnimations.includes(index);
    const specialEffectMultiplier = isActive ? letter.glowIntensity * 2 : 1;
    
    // Enhanced styling for each letter
    const randomBorder = Math.random() > 0.7 ? 
      `${Math.floor(Math.random() * 2) + 1}px ${Math.random() > 0.5 ? 'solid' : 'dashed'} rgba(0,0,0,0.3)` : 
      'none';
    const randomRadius = Math.random() > 0.6 ? 
      `${Math.floor(Math.random() * 8) + 2}px` : 
      `${Math.floor(Math.random() * 3)}px`;
    const randomShadow = Math.random() > 0.7 ? 
      `${Math.floor(Math.random() * 3) + 1}px ${Math.floor(Math.random() * 3) + 1}px ${Math.floor(Math.random() * 5) + 2}px rgba(0,0,0,0.4)` : 
      'none';
    
    return {
      color: letter.style.color,
      fontFamily: letter.style.fontFamily,
      fontSize: letter.style.fontSize,
      background: letter.style.backgroundColor,
      textShadow: isActive ? `
        ${letter.style.textShadow},
        0 0 ${15 * specialEffectMultiplier}px currentColor,
        0 0 ${25 * specialEffectMultiplier}px currentColor
      ` : letter.style.textShadow,
      transform: `
        rotateZ(${letter.rotation}deg)
        rotateX(${letter.lean}deg)
        translateY(${-letter.float}px)
        ${isActive ? `rotateY(${Math.sin(animPhase * 0.1 + index) * 20}deg)` : ''}
        ${isActive ? `scale(${1 + Math.sin(animPhase * 0.08 + index) * 0.1})` : ''}
      `,
      filter: `brightness(${1 + (isActive ? 0.5 : 0) * Math.sin(animPhase * 0.06 + index)})`,
      padding: letter.char === ' ' ? '0' : `${4 + Math.floor(Math.random() * 4)}px ${6 + Math.floor(Math.random() * 4)}px`,
      margin: letter.char === ' ' ? '0 0.4em' : `0 ${2 + Math.floor(Math.random() * 3)}px`,
      borderRadius: randomRadius,
      border: randomBorder,
      boxShadow: randomShadow,
      opacity: letter.char === ' ' ? 1 : 0.9,
      display: letter.char === ' ' ? 'inline' : 'inline-block',
      fontWeight: Math.random() > 0.4 ? 'bold' : Math.random() > 0.7 ? '900' : 'normal',
      fontStyle: Math.random() > 0.8 ? 'italic' : 'normal',
      textDecoration: Math.random() > 0.85 ? (Math.random() > 0.5 ? 'underline' : 'overline') : 'none',
      position: 'relative' as const,
      top: `${(Math.random() - 0.5) * 6}px`,
      left: `${(Math.random() - 0.5) * 2}px`,
      zIndex: Math.floor(Math.random() * 3) + 1,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transformOrigin: 'center center',
    };
  };

  return (
    <span className={`inline-block mt-8 ${className}`} style={{ letterSpacing: '0.1em' }}>
      {letters.map((letter, index) => (
        <span
          key={`${index}-${animationKey}`}
          className="inline-block transition-all duration-1000 ease-in-out"
          style={getLetterStyle(letter, index)}
        >
          {letter.char}
        </span>
      ))}
    </span>
  );
};