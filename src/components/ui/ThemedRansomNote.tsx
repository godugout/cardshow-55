import React, { useEffect, useState } from 'react';

interface ThemedRansomNoteProps {
  children: string;
  theme: 'craft' | 'collect' | 'connect';
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

export const ThemedRansomNote: React.FC<ThemedRansomNoteProps> = ({ 
  children, 
  theme,
  className = "" 
}) => {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [animPhase, setAnimPhase] = useState(0);
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSpellingOut, setIsSpellingOut] = useState(false);
  const [spellIndex, setSpellIndex] = useState(0);
  const [flippingLetters, setFlippingLetters] = useState<number[]>([]);

  // Theme-specific configurations
  const getThemeConfig = (theme: 'craft' | 'collect' | 'connect') => {
    switch (theme) {
      case 'craft':
        return {
          colors: [
            '#ff1744', '#00e676', '#2196f3', '#ffeb3b', '#e91e63', '#9c27b0',
            '#ff5722', '#00bcd4', '#ff0080', '#00ff80', '#8000ff', '#ff4000',
            '#ffffff', '#000000'
          ],
          backgrounds: [
            { background: '#ff1744', pattern: 'electric-red' },
            { background: '#00e676', pattern: 'neon-green' },
            { background: '#2196f3', pattern: 'electric-blue' },
            { background: '#ffeb3b', pattern: 'neon-yellow' },
            { background: '#e91e63', pattern: 'hot-pink' },
            { background: 'linear-gradient(45deg, #ff6b6b 0%, #ff8e53 100%)', pattern: 'vibrant-1' },
            { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'electric-purple' },
            { background: 'linear-gradient(45deg, #fa709a 0%, #fee140 100%)', pattern: 'sunset' }
          ],
          fonts: [
            'Impact', 'Arial Black', 'Helvetica Bold', 'Bebas Neue', 'Anton',
            'Oswald', 'Squada One', 'Russo One', 'Exo 2', 'Orbitron'
          ]
        };
      
      case 'collect':
        return {
          colors: [
            '#8b4513', '#daa520', '#cd853f', '#d2691e', '#a0522d', '#f4a460',
            '#000000', '#1a1a1a', '#333333', '#4a4a4a', '#696969', '#ffffff',
            '#f5f5dc', '#faebd7', '#fff8dc'
          ],
          backgrounds: [
            { background: '#f5f5dc', pattern: 'vintage-paper' },
            { background: '#faebd7', pattern: 'antique-white' },
            { background: '#daa520', pattern: 'golden' },
            { background: '#cd853f', pattern: 'peru' },
            { background: '#8b4513', pattern: 'saddle-brown' },
            { background: 'linear-gradient(45deg, #f5f5dc 0%, #f0f0f0 25%, #f5f5dc 50%, #e8e8e8 75%, #f5f5dc 100%)', pattern: 'newspaper' },
            { background: 'linear-gradient(90deg, #fff8dc 0%, #faebd7 50%, #fff8dc 100%)', pattern: 'vintage-paper' },
            { background: 'linear-gradient(180deg, #fffacd 0%, #f0e68c 100%)', pattern: 'aged-paper' },
            { background: '#2f2f2f', pattern: 'dark-vintage' },
            { background: '#1a1a1a', pattern: 'old-black' }
          ],
          fonts: [
            'Georgia', 'Times New Roman', 'Garamond', 'Palatino', 'Book Antiqua',
            'Courier New', 'Monaco', 'Rockwell', 'Century', 'Minion Pro'
          ]
        };
      
      case 'connect':
        return {
          colors: [
            '#00ffff', '#ff00ff', '#00ff00', '#0080ff', '#ff0080', '#80ff00',
            '#ffffff', '#000000', '#c0c0c0', '#808080', '#404040',
            '#39ff14', '#ff073a', '#9400d3', '#00ced1', '#ff1493'
          ],
          backgrounds: [
            { background: '#00ffff', pattern: 'cyber-cyan' },
            { background: '#ff00ff', pattern: 'digital-magenta' },
            { background: '#39ff14', pattern: 'neon-green' },
            { background: '#0080ff', pattern: 'electric-blue' },
            { background: 'linear-gradient(45deg, #00ffff 0%, #ff00ff 100%)', pattern: 'cyber-gradient' },
            { background: 'linear-gradient(90deg, #39ff14 0%, #0080ff 100%)', pattern: 'matrix-gradient' },
            { background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #39ff14 100%)', pattern: 'rgb-shift' },
            { background: '#000000', pattern: 'digital-black' },
            { background: '#1a1a1a', pattern: 'cyber-dark' },
            { background: 'repeating-linear-gradient(45deg, #00ffff, #00ffff 8px, #000000 8px, #000000 16px)', pattern: 'digital-stripes' }
          ],
          fonts: [
            'Courier New', 'Monaco', 'Consolas', 'Lucida Console', 'Menlo',
            'Orbitron', 'Rajdhani', 'Russo One', 'Quantico', 'Michroma'
          ]
        };
    }
  };

  const themeConfig = getThemeConfig(theme);

  const getContrastingColor = (bgColor: string): string => {
    if (bgColor.includes('gradient') || bgColor.includes('repeating')) {
      return Math.random() > 0.5 ? '#ffffff' : '#000000';
    }
    
    // Theme-specific contrast logic
    if (theme === 'collect') {
      const lightBgs = ['#f5f5dc', '#faebd7', '#fff8dc', '#fffacd', '#f0e68c'];
      const isDark = !lightBgs.some(color => bgColor.includes(color));
      return isDark ? '#ffffff' : '#000000';
    }
    
    if (theme === 'connect') {
      const darkBgs = ['#000000', '#1a1a1a', '#404040'];
      const isDark = darkBgs.some(color => bgColor.includes(color));
      return isDark ? '#00ffff' : '#000000';
    }
    
    // Default craft theme
    return Math.random() > 0.5 ? '#ffffff' : '#000000';
  };

  const generateLetterStyle = (): LetterStyle => {
    const bgStyle = themeConfig.backgrounds[Math.floor(Math.random() * themeConfig.backgrounds.length)];
    const textColor = getContrastingColor(bgStyle.background);
    
    const decorations = [
      'none',
      '2px 2px 4px rgba(0,0,0,0.3)',
      '1px 1px 2px rgba(255,255,255,0.8)',
      '0 0 3px rgba(0,0,0,0.5)',
      'inset 0 1px 0 rgba(255,255,255,0.2)',
    ];

    return {
      color: textColor,
      fontFamily: themeConfig.fonts[Math.floor(Math.random() * themeConfig.fonts.length)],
      fontSize: `${1.2 + Math.random() * 1.0}em`,
      backgroundColor: bgStyle.background,
      textShadow: decorations[Math.floor(Math.random() * decorations.length)]
    };
  };

  useEffect(() => {
    const initializeLetters = () => {
      const newLetters = children.split('').map(char => ({
        char,
        isAnimating: false,
        animationType: 'float' as const,
        animationProgress: 0,
        rotation: Math.random() * 40 - 20,
        float: Math.random() * 4,
        lean: Math.random() * 20 - 10,
        glowIntensity: 0.5 + Math.random() * 0.5,
        style: generateLetterStyle()
      }));
      setLetters(newLetters);
    };

    initializeLetters();
  }, [children, theme]);

  useEffect(() => {
    const variationInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        setIsSpellingOut(true);
        setSpellIndex(0);
        setActiveAnimations([]);
        
        setLetters(prev => prev.map(letter => ({
          ...letter,
          style: generateLetterStyle()
        })));
      } else {
        setAnimationKey(prev => prev + 1);
        setActiveAnimations([]);
        setIsSpellingOut(false);
        
        setLetters(prev => prev.map(letter => ({
          ...letter,
          style: generateLetterStyle()
        })));
      }
    }, 8000);

    const phaseInterval = setInterval(() => {
      setAnimPhase(prev => prev + 1);
    }, 200);

    return () => {
      clearInterval(variationInterval);
      clearInterval(phaseInterval);
    };
  }, [theme]);

  useEffect(() => {
    if (isSpellingOut) {
      const spellInterval = setInterval(() => {
        setSpellIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex >= children.length) {
            setIsSpellingOut(false);
            return 0;
          }
          return nextIndex;
        });
      }, 400);

      return () => clearInterval(spellInterval);
    }
  }, [isSpellingOut, children.length]);

  useEffect(() => {
    const letterInterval = setInterval(() => {
      setLetters(prev => prev.map((letter, index) => ({
        ...letter,
        rotation: letter.rotation + (Math.sin(animPhase * 0.02 + index) * 0.5),
        float: 2 + Math.sin(animPhase * 0.025 + index * 0.5) * 4,
        lean: Math.sin(animPhase * 0.018 + index * 0.3) * 8,
        glowIntensity: 0.5 + Math.sin(animPhase * 0.03 + index * 0.7) * 0.5
      })));

      if (Math.random() < 0.4) {
        const availableLetters = letters.map((_, i) => i).filter(i => 
          !activeAnimations.includes(i) && 
          !flippingLetters.includes(i) && 
          letters[i]?.char !== ' '
        );
        
        if (availableLetters.length > 0) {
          const numToFlip = Math.min(1 + Math.floor(Math.random() * 3), availableLetters.length);
          const newFlipping = [];
          
          for (let i = 0; i < numToFlip; i++) {
            const randomIndex = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            newFlipping.push(randomIndex);
            availableLetters.splice(availableLetters.indexOf(randomIndex), 1);
          }
          
          setFlippingLetters(newFlipping);
          
          setTimeout(() => {
            setLetters(prev => prev.map((letter, index) => 
              newFlipping.includes(index) 
                ? { ...letter, style: generateLetterStyle() }
                : letter
            ));
          }, 800);
          
          setTimeout(() => {
            setFlippingLetters(prev => prev.filter(i => !newFlipping.includes(i)));
          }, 1600);
        }
      }

      if (Math.random() < 0.1) {
        const availableLetters = letters.map((_, i) => i).filter(i => 
          !activeAnimations.includes(i) && 
          !flippingLetters.includes(i)
        );
        if (availableLetters.length > 0) {
          const numToAnimate = Math.min(1 + Math.floor(Math.random() * 2), availableLetters.length);
          const newActive = [];
          for (let i = 0; i < numToAnimate; i++) {
            const randomIndex = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            newActive.push(randomIndex);
            availableLetters.splice(availableLetters.indexOf(randomIndex), 1);
          }
          setActiveAnimations(newActive);
          
          setTimeout(() => {
            setActiveAnimations(prev => prev.filter(i => !newActive.includes(i)));
          }, 4000 + Math.random() * 2000);
        }
      }
    }, 300);

    return () => clearInterval(letterInterval);
  }, [animPhase, activeAnimations, letters, flippingLetters, theme]);

  const getLetterStyle = (letter: LetterState, index: number) => {
    const isActive = activeAnimations.includes(index);
    const isFlipping = flippingLetters.includes(index);
    const specialEffectMultiplier = isActive ? letter.glowIntensity * 2 : 1;
    
    const isVisible = !isSpellingOut || index < spellIndex;
    
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
        ${isFlipping ? `rotateY(${Math.sin(animPhase * 0.05) * 180}deg)` : ''}
        ${isActive ? `rotateY(${Math.sin(animPhase * 0.05 + index) * 45}deg)` : ''}
        ${isActive ? `rotateZ(${Math.sin(animPhase * 0.04 + index) * 15}deg)` : ''}
        ${isActive ? `scale(${1 + Math.sin(animPhase * 0.03 + index) * 0.2})` : ''}
        ${isActive ? `translateZ(${Math.sin(animPhase * 0.06 + index) * 10}px)` : ''}
        ${isSpellingOut && index === spellIndex - 1 ? 'scale(1.2)' : ''}
      `,
      filter: `brightness(${1 + (isActive ? 0.5 : 0) * Math.sin(animPhase * 0.06 + index)})`,
      padding: letter.char === ' ' ? '0' : `${4 + Math.floor(Math.random() * 4)}px ${6 + Math.floor(Math.random() * 4)}px`,
      margin: letter.char === ' ' ? '0 0.4em' : `0 ${2 + Math.floor(Math.random() * 3)}px`,
      borderRadius: randomRadius,
      border: randomBorder,
      boxShadow: randomShadow,
      opacity: isVisible ? (letter.char === ' ' ? 1 : 0.9) : 0,
      display: letter.char === ' ' ? 'inline' : 'inline-block',
      fontWeight: Math.random() > 0.4 ? 'bold' : Math.random() > 0.7 ? '900' : 'normal',
      fontStyle: Math.random() > 0.8 ? 'italic' : 'normal',
      textDecoration: Math.random() > 0.85 ? (Math.random() > 0.5 ? 'underline' : 'overline') : 'none',
      position: 'relative' as const,
      top: `${(Math.random() - 0.5) * 6}px`,
      left: `${(Math.random() - 0.5) * 2}px`,
      zIndex: Math.floor(Math.random() * 3) + 1,
      transition: isSpellingOut ? 'opacity 0.2s ease-in-out, transform 0.3s ease-out' : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transformOrigin: 'center center',
    };
  };

  return (
    <span className={`inline-block mt-8 scale-125 ${className}`} style={{ letterSpacing: '0.15em', transform: 'scale(1.3)' }}>
      {letters.map((letter, index) => (
        <span
          key={`${index}-${animationKey}-${theme}`}
          className="inline-block transition-all duration-1000 ease-in-out"
          style={getLetterStyle(letter, index)}
        >
          {letter.char}
        </span>
      ))}
    </span>
  );
};