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
  shape: 'square' | 'wide' | 'tall' | 'skew';
  size: 'small' | 'medium' | 'large' | 'extra-large';
  isThemeWord: boolean;
  isTransparent: boolean;
  letterType: 'card' | 'transparent' | 'jersey';
  backgroundOffset: number;
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
            '#ffd700', '#ff6b35', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#a55eea',
            '#2ed573', '#ff4757', '#3742fa', '#2f3542', '#57606f', '#ffffff'
          ],
          backgrounds: [
            { background: '#ff1744', pattern: 'electric-red' },
            { background: '#00e676', pattern: 'neon-green' },
            { background: '#2196f3', pattern: 'electric-blue' },
            { background: '#ffeb3b', pattern: 'neon-yellow' },
            { background: '#e91e63', pattern: 'hot-pink' },
            { background: '#ffd700', pattern: 'gold' },
            { background: '#ff6b35', pattern: 'orange' },
            { background: '#4ecdc4', pattern: 'turquoise' },
            { background: '#ffffff', pattern: 'white' },
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
            '#39ff14', '#ff073a', '#9400d3', '#00ced1', '#ff1493',
            '#ff6600', '#33cc33', '#0099ff', '#cc0099', '#ffff00'
          ],
          backgrounds: [
            // Pixel/block aesthetics mixed with cyber
            { background: '#00ffff', pattern: 'cyber-cyan' },
            { background: '#ff00ff', pattern: 'digital-magenta' },
            { background: '#39ff14', pattern: 'neon-green' },
            { background: '#000000', pattern: 'digital-black' },
            { background: '#ffffff', pattern: 'pixel-white' },
            // Block patterns using CSS
            { background: 'repeating-conic-gradient(from 0deg at 50% 50%, #00ffff 0deg 90deg, #000000 90deg 180deg)', pattern: 'pixel-blocks' },
            { background: 'repeating-linear-gradient(90deg, #ff00ff 0px, #ff00ff 8px, #000000 8px, #000000 16px)', pattern: 'pixel-stripes' },
            { background: 'repeating-linear-gradient(45deg, #39ff14 0px, #39ff14 4px, #000000 4px, #000000 8px)', pattern: 'diagonal-pixels' },
            // Solid blocks
            { background: '#2a2a2a', pattern: 'dark-block' },
            { background: '#404040', pattern: 'grey-block' },
            { background: '#1a1a2e', pattern: 'navy-block' },
            { background: '#0f3460', pattern: 'blue-block' },
            // Minimal gradients for variety
            { background: 'linear-gradient(90deg, #000000 0%, #404040 100%)', pattern: 'subtle-fade' }
          ],
          jerseyPatterns: [
            // Basketball textures
            { background: 'radial-gradient(circle at 30% 30%, #ff6600 2px, transparent 2px), radial-gradient(circle at 70% 70%, #ff6600 2px, transparent 2px)', pattern: 'basketball-dimples', color: '#ff6600' },
            // Football leather texture
            { background: 'repeating-linear-gradient(45deg, #8b4513 0px, #8b4513 2px, #a0522d 2px, #a0522d 4px)', pattern: 'football-leather', color: '#8b4513' },
            // Soccer ball hexagon pattern
            { background: 'repeating-conic-gradient(from 0deg, #000000 0deg 60deg, #ffffff 60deg 120deg)', pattern: 'soccer-hexagon', color: '#000000' },
            // Jersey mesh texture
            { background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)', pattern: 'jersey-mesh', color: '#00ffff' },
            // Team stripes
            { background: 'repeating-linear-gradient(90deg, #0099ff 0px, #0099ff 10px, #ffffff 10px, #ffffff 20px)', pattern: 'team-stripes', color: '#0099ff' },
            // Athletic fabric
            { background: 'linear-gradient(45deg, #39ff14 25%, transparent 25%), linear-gradient(-45deg, #39ff14 25%, transparent 25%)', pattern: 'athletic-fabric', color: '#39ff14' }
          ],
          fonts: [
            'Courier New', 'Monaco', 'Consolas', 'Lucida Console', 'Menlo',
            'Orbitron', 'Rajdhani', 'Russo One', 'Quantico', 'Michroma',
            'Impact', 'Arial Black', 'Bebas Neue'
          ]
        };
    }
  };

  const themeConfig = getThemeConfig(theme);

  // Generate letter shape
  const generateLetterShape = (): 'square' | 'wide' | 'tall' | 'skew' => {
    const shapes = ['square', 'wide', 'tall', 'skew'] as const;
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  // Generate transparency pattern - 2-3 letters per word
  const generateTransparencyPattern = (text: string): boolean[] => {
    const words = text.split(' ');
    const pattern: boolean[] = [];
    
    words.forEach(word => {
      const wordLength = word.length;
      const transparentCount = Math.min(3, Math.max(2, Math.floor(wordLength * 0.3)));
      const transparentIndices = new Set<number>();
      
      // Select random positions for transparent letters
      while (transparentIndices.size < transparentCount && transparentIndices.size < wordLength) {
        transparentIndices.add(Math.floor(Math.random() * wordLength));
      }
      
      for (let i = 0; i < wordLength; i++) {
        pattern.push(transparentIndices.has(i));
      }
      
      // Add space
      if (word !== words[words.length - 1]) {
        pattern.push(false);
      }
    });
    
    return pattern;
  };

  // Generate letter type (card, transparent, jersey)
  const generateLetterType = (index: number, isTransparent: boolean): 'card' | 'transparent' | 'jersey' => {
    if (isTransparent) return 'transparent';
    
    // For connect theme, add jersey materials
    if (theme === 'connect' && Math.random() < 0.25) {
      return 'jersey';
    }
    
    return 'card';
  };

  // Generate background vertical offset for card positioning
  const generateBackgroundOffset = (): number => {
    const random = Math.random();
    // Random vertical offset for card backgrounds: -0.3em to 0.3em
    if (random < 0.2) return -0.3; // top
    if (random < 0.4) return -0.15; // slightly above
    if (random < 0.6) return 0; // middle
    if (random < 0.8) return 0.15; // slightly below
    return 0.3; // bottom
  };

  // Generate letter size with mixed distribution
  const generateLetterSize = (index: number, totalLetters: number): 'small' | 'medium' | 'large' | 'extra-large' => {
    // Limit extra-large letters to 1-2 per word
    const extraLargeChance = Math.random() < 0.15 && index % 3 === 0 ? 'extra-large' : null;
    if (extraLargeChance) return 'extra-large';
    
    const sizes = ['small', 'medium', 'large'] as const;
    const weights = [0.3, 0.5, 0.2]; // More medium, some small, fewer large
    const random = Math.random();
    
    if (random < weights[0]) return 'small';
    if (random < weights[0] + weights[1]) return 'medium';
    return 'large';
  };

  // Detect theme words for special highlighting
  const detectThemeWord = (text: string, index: number): boolean => {
    const lowerText = text.toLowerCase();
    const themeWords = {
      craft: ['craft', 'reality'],
      collect: ['collect', 'memories'],
      connect: ['connect', 'creators']
    };
    
    const targetWords = themeWords[theme];
    for (const word of targetWords) {
      const wordIndex = lowerText.indexOf(word);
      if (wordIndex !== -1 && index >= wordIndex && index < wordIndex + word.length) {
        return true;
      }
    }
    return false;
  };

  // Get theme-specific highlight color for special words
  const getThemeHighlightColor = (): string => {
    switch (theme) {
      case 'craft':
        return ['#ff1744', '#00e676', '#2196f3'][Math.floor(Math.random() * 3)];
      case 'collect':
        return ['#daa520', '#8b4513', '#cd853f'][Math.floor(Math.random() * 3)];
      case 'connect':
        return ['#00ffff', '#ff00ff', '#39ff14'][Math.floor(Math.random() * 3)];
    }
  };

  // Use colored letters directly instead of just black/white
  const getRandomColor = (): string => {
    return themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)];
  };

  const getContrastingColor = (bgColor: string): string => {
    // 60% chance to use colored letters, 40% chance for contrast
    if (Math.random() < 0.6) {
      return getRandomColor();
    }
    
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

  const generateLetterStyle = (letterType: 'card' | 'transparent' | 'jersey' = 'card'): LetterStyle => {
    let bgStyle, textColor;
    
    if (letterType === 'transparent') {
      // Transparent letters have no background
      bgStyle = { background: 'transparent', pattern: 'transparent' };
      textColor = getRandomColor();
    } else if (letterType === 'jersey' && theme === 'connect' && themeConfig.jerseyPatterns) {
      // Jersey patterns for connect theme
      bgStyle = themeConfig.jerseyPatterns[Math.floor(Math.random() * themeConfig.jerseyPatterns.length)];
      textColor = getContrastingColor(bgStyle.background);
    } else {
      // Regular card backgrounds
      bgStyle = themeConfig.backgrounds[Math.floor(Math.random() * themeConfig.backgrounds.length)];
      textColor = getContrastingColor(bgStyle.background);
    }
    
    // Enhanced shadow effects with depth layering
    const getTextShadowForType = (type: 'card' | 'transparent' | 'jersey') => {
      if (type === 'transparent') {
        // Layered shadows for transparent letters to create depth
        return [
          '2px 2px 4px rgba(0,0,0,0.8), 4px 4px 8px rgba(0,0,0,0.6), 6px 6px 12px rgba(0,0,0,0.4)',
          '1px 1px 3px rgba(0,0,0,0.9), 3px 3px 6px rgba(0,0,0,0.7), 5px 5px 10px rgba(0,0,0,0.5)',
          '3px 3px 0px rgba(0,0,0,0.8), 6px 6px 8px rgba(0,0,0,0.6), 9px 9px 15px rgba(0,0,0,0.4)'
        ];
      }
      
      return [
        'none',
        '2px 2px 4px rgba(0,0,0,0.3)',
        '1px 1px 2px rgba(255,255,255,0.8)',
        '0 0 3px rgba(0,0,0,0.5)',
        'inset 0 1px 0 rgba(255,255,255,0.2)',
        '3px 3px 0px rgba(0,0,0,0.4), 6px 6px 8px rgba(0,0,0,0.2)',
        '2px 2px 0px rgba(255,255,255,0.3), 4px 4px 6px rgba(0,0,0,0.3)',
        '1px 1px 0px rgba(0,0,0,0.5), 2px 2px 0px rgba(0,0,0,0.3), 3px 3px 0px rgba(0,0,0,0.2)',
      ];
    };

    const shadowOptions = getTextShadowForType(letterType);

    return {
      color: textColor,
      fontFamily: themeConfig.fonts[Math.floor(Math.random() * themeConfig.fonts.length)],
      fontSize: `${1.0 + Math.random() * 0.5}em`,
      backgroundColor: bgStyle.background,
      textShadow: shadowOptions[Math.floor(Math.random() * shadowOptions.length)]
    };
  };

  useEffect(() => {
    const initializeLetters = () => {
      // Make letters case agnostic - randomly mix uppercase and lowercase
      const processedText = children.split('').map(char => {
        if (char === ' ') return char;
        return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
      }).join('');
      
      // Generate transparency pattern
      const transparencyPattern = generateTransparencyPattern(children);
      
      // Only allow 1-2 letters to have sharp angles (>10 degrees)
      const totalLetters = processedText.length;
      const sharpAngleIndices = new Set<number>();
      const numSharpAngles = Math.min(2, Math.max(1, Math.floor(totalLetters * 0.2))); // 1-2 letters
      
      while (sharpAngleIndices.size < numSharpAngles) {
        const randomIndex = Math.floor(Math.random() * totalLetters);
        if (processedText[randomIndex] !== ' ') {
          sharpAngleIndices.add(randomIndex);
        }
      }
      
      const newLetters = processedText.split('').map((char, index) => {
        const hasSharpAngle = sharpAngleIndices.has(index);
        const isThemeWord = detectThemeWord(children, index);
        const isTransparent = transparencyPattern[index] || false;
        const letterType = generateLetterType(index, isTransparent);
        
        return {
          char,
          isAnimating: false,
          animationType: 'float' as const,
          animationProgress: 0,
          rotation: hasSharpAngle ? (Math.random() * 30 - 15) : (Math.random() * 6 - 3), // Sharp: ±15°, Normal: ±3°
          float: Math.random() * 2,
          lean: hasSharpAngle ? (Math.random() * 12 - 6) : (Math.random() * 4 - 2), // Controlled lean
          glowIntensity: 0.5 + Math.random() * 0.5,
          style: generateLetterStyle(letterType),
          shape: generateLetterShape(),
          size: generateLetterSize(index, totalLetters),
          isThemeWord,
          isTransparent,
          letterType,
          backgroundOffset: char === ' ' ? 0 : generateBackgroundOffset()
        };
      });
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
          style: generateLetterStyle(letter.letterType),
          backgroundOffset: letter.char === ' ' ? 0 : (Math.random() < 0.3 ? generateBackgroundOffset() : letter.backgroundOffset)
        })));
      } else {
        setAnimationKey(prev => prev + 1);
        setActiveAnimations([]);
        setIsSpellingOut(false);
        
        setLetters(prev => prev.map(letter => ({
          ...letter,
          style: generateLetterStyle(letter.letterType),
          backgroundOffset: letter.char === ' ' ? 0 : (Math.random() < 0.3 ? generateBackgroundOffset() : letter.backgroundOffset)
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
        rotation: letter.rotation + (Math.sin(animPhase * 0.015 + index) * 0.2), // Gentler rotation changes
        float: 0.5 + Math.sin(animPhase * 0.02 + index * 0.5) * 1.5, // Smaller float range
        lean: Math.sin(animPhase * 0.018 + index * 0.3) * 2, // Much smaller lean movement
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
                ? { 
                    ...letter, 
                    style: generateLetterStyle(letter.letterType),
                    backgroundOffset: letter.char === ' ' ? 0 : (Math.random() < 0.4 ? generateBackgroundOffset() : letter.backgroundOffset)
                  }
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
    
    // Get size-based scaling
    const getSizeScale = (size: string): number => {
      switch (size) {
        case 'small': return 0.8;
        case 'medium': return 1.0;
        case 'large': return 1.3;
        case 'extra-large': return 1.6;
        default: return 1.0;
      }
    };
    
    // Get shape-specific styles
    const getShapeStyles = (shape: string) => {
      switch (shape) {
        case 'square':
          return {
            aspectRatio: '1',
            borderRadius: '6px',
            clipPath: 'none'
          };
        case 'wide':
          return {
            width: '1.4em',
            height: '1em',
            borderRadius: '4px',
            clipPath: 'none'
          };
        case 'tall':
          return {
            width: '0.8em',
            height: '1.3em',
            borderRadius: '8px',
            clipPath: 'none'
          };
        case 'skew':
          return {
            borderRadius: '4px',
            clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)'
          };
        default:
          return {
            borderRadius: '4px',
            clipPath: 'none'
          };
      }
    };
    
    const shapeStyles = getShapeStyles(letter.shape);
    const sizeScale = getSizeScale(letter.size);
    
    // Theme word highlighting and transparent letter handling
    const isThemeWord = letter.isThemeWord;
    const isTransparent = letter.isTransparent;
    const themeColor = isThemeWord ? getThemeHighlightColor() : letter.style.color;
    const themeWeight = isThemeWord ? 'bold' : (Math.random() > 0.4 ? 'bold' : Math.random() > 0.7 ? '900' : 'normal');
    
    // Enhanced styles for transparent letters
    const transparentStyles = isTransparent ? {
      background: 'transparent',
      fontSize: `${parseFloat(letter.style.fontSize) * sizeScale * 1.1}em`, // Slightly larger
      zIndex: 10,
      textShadow: isThemeWord 
        ? `0 0 8px ${themeColor}, 0 0 16px ${themeColor}, ${letter.style.textShadow}`
        : letter.style.textShadow
    } : {};
    
    // Pre-calculated stable values to prevent layout shifts
    const stableOffsets = {
      rotation: letter.rotation,
      float: -letter.float + letter.backgroundOffset,
      lean: letter.lean,
      padding: letter.char === ' ' ? '0' : '5px 6px',
      margin: letter.char === ' ' ? '0 0.3em' : '0 2px'
    };
    
    return {
      color: themeColor,
      fontFamily: letter.style.fontFamily,
      fontSize: transparentStyles.fontSize || `${parseFloat(letter.style.fontSize) * sizeScale}em`,
      background: transparentStyles.background || letter.style.backgroundColor,
      textShadow: isActive ? `
        ${letter.style.textShadow},
        0 0 ${15 * specialEffectMultiplier}px currentColor,
        0 0 ${25 * specialEffectMultiplier}px currentColor
      ` : (transparentStyles.textShadow || letter.style.textShadow),
      zIndex: transparentStyles.zIndex || 'auto',
      // Use transforms only - no layout-affecting properties
      transform: `
        translateX(0px) translateY(${stableOffsets.float}px)
        rotateZ(${stableOffsets.rotation}deg)
        rotateX(${stableOffsets.lean}deg)
        ${isFlipping ? `rotateY(${Math.sin(animPhase * 0.05) * 180}deg)` : ''}
        ${isActive ? `rotateY(${Math.sin(animPhase * 0.05 + index) * 45}deg)` : ''}
        ${isActive ? `rotateZ(${Math.sin(animPhase * 0.04 + index) * 15}deg)` : ''}
        ${isActive ? `scale(${1 + Math.sin(animPhase * 0.03 + index) * 0.2})` : ''}
        ${isSpellingOut && index === spellIndex - 1 ? 'scale(1.2)' : ''}
      `,
      filter: `brightness(${1 + (isActive ? 0.5 : 0) * Math.sin(animPhase * 0.06 + index)})`,
      padding: stableOffsets.padding,
      margin: stableOffsets.margin,
      border: 'none',
      boxShadow: 'none',
      opacity: isVisible ? (letter.char === ' ' ? 1 : 0.9) : 0,
      display: letter.char === ' ' ? 'inline' : 'inline-block',
      fontWeight: themeWeight,
      fontStyle: Math.random() > 0.8 ? 'italic' : 'normal',
      textDecoration: Math.random() > 0.85 ? (Math.random() > 0.5 ? 'underline' : 'overline') : 'none',
      letterSpacing: Math.random() > 0.7 ? '0.1em' : 'normal',
      // Apply shape styles
      ...shapeStyles,
      // Layout containment to prevent shifts
      contain: 'layout style',
      willChange: 'transform',
      transition: isSpellingOut ? 'opacity 0.2s ease-in-out, transform 0.3s ease-out' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transformOrigin: 'center center',
    };
  };

  return (
    <div className={`inline-block mt-4 ${className}`} style={{ 
      letterSpacing: '0.05em', 
      transform: 'scale(0.95)',
      lineHeight: '1.5',
      contain: 'layout'
    }}>
      {letters.map((letter, index) => (
        <span
          key={`${index}-${animationKey}-${theme}`}
          className="inline-block"
          style={{
            position: 'relative',
            minWidth: letter.char === ' ' ? '0.4em' : '1.2em',
            minHeight: '1.4em',
            verticalAlign: 'middle',
            contain: 'layout style',
            ...getLetterStyle(letter, index)
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  );
};