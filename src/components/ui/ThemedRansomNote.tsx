import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';

interface ThemedRansomNoteProps {
  children: string;
  theme: 'craft' | 'collect' | 'connect';
  className?: string;
  isPaused?: boolean;
  showTypographyControls?: boolean;
}

// Animation performance pool for managing all animations in a single RAF loop
class AnimationPool {
  private static instance: AnimationPool;
  private animations = new Map<string, () => void>();
  private rafId: number | null = null;

  static getInstance(): AnimationPool {
    if (!AnimationPool.instance) {
      AnimationPool.instance = new AnimationPool();
    }
    return AnimationPool.instance;
  }

  add(id: string, callback: () => void) {
    this.animations.set(id, callback);
    if (!this.rafId) this.start();
  }

  remove(id: string) {
    this.animations.delete(id);
    if (this.animations.size === 0) this.stop();
  }

  private start = () => {
    this.rafId = requestAnimationFrame(this.animate);
  };

  private stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private animate = () => {
    this.animations.forEach(callback => callback());
    this.rafId = requestAnimationFrame(this.animate);
  };
}

interface LetterState {
  char: string;
  id: string;
  animationType: 'spell' | 'spin' | 'float' | 'glow' | 'none';
  isAnimating: boolean;
  position: { x: number; y: number };
  color: string;
  fontSize: string;
  fontFamily: string;
  opacity: number;
  transform: string;
  pattern: 'solid' | 'transparent' | 'gold';
  jerseyPattern?: string;
  shape?: 'square' | 'wide' | 'tall' | 'skew';
  backgroundStyle?: LetterBackgroundStyle;
  isFlipping?: boolean;
  textShadow?: string;
  zIndex?: number;
}

interface LetterBackgroundStyle {
  background: string;
  border: string;
  borderRadius: string;
  boxShadow: string;
  textShadow: string;
}

// Debounce utility for performance optimization
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const ThemedRansomNote: React.FC<ThemedRansomNoteProps> = ({ 
  children, 
  theme,
  className = "",
  isPaused = false,
  showTypographyControls = false 
}) => {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState<'spell' | 'spin' | 'float' | 'glow' | 'none'>('none');
  const [isSpellingOut, setIsSpellingOut] = useState(false);
  const [spellIndex, setSpellIndex] = useState(0);
  const [flippingLetters, setFlippingLetters] = useState<number[]>([]);
  const [goldLetterIndex, setGoldLetterIndex] = useState<number>(-1);
  const [isReturningToTypography, setIsReturningToTypography] = useState(false);
  const [typographyTransitionPhase, setTypographyTransitionPhase] = useState<'idle' | 'background-fade' | 'color-transition' | 'font-normalize' | 'typography'>('idle');
  const [typographyProgress, setTypographyProgress] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  
  // Performance optimization refs
  const animationPoolRef = useRef(AnimationPool.getInstance());
  const componentIdRef = useRef(`ransom-note-${Math.random().toString(36).substr(2, 9)}`);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoized theme configuration for performance
  const themeConfig = useMemo(() => {
    const getThemeConfig = (theme: 'craft' | 'collect' | 'connect') => {
      switch (theme) {
        case 'craft':
          return {
            colors: [
              '#ff1744', '#00e676', '#2196f3', '#ffeb3b', '#e91e63', '#9c27b0',
              '#ff5722', '#795548', '#607d8b', '#4caf50', '#ff9800', '#673ab7'
            ],
            fonts: [
              'Impact', 'Arial Black', 'Helvetica Bold', 'Bebas Neue', 'Anton',
              'Oswald', 'Russo One', 'Fjalla One', 'Squada One'
            ],
            jerseyPatterns: [
              'linear-gradient(45deg, #ff1744 25%, transparent 25%, transparent 75%, #ff1744 75%)',
              'radial-gradient(circle, #00e676 30%, transparent 30%)',
              'linear-gradient(90deg, #2196f3 50%, #ffeb3b 50%)',
              'conic-gradient(from 0deg, #e91e63, #9c27b0, #e91e63)',
              'repeating-linear-gradient(45deg, #ff5722, #ff5722 10px, transparent 10px, transparent 20px)'
            ]
          };
        case 'collect':
          return {
            colors: [
              '#8b4513', '#daa520', '#cd853f', '#d2691e', '#a0522d', '#f4a460',
              '#2e8b57', '#dc143c', '#4682b4', '#9932cc', '#ff6347', '#32cd32'
            ],
            fonts: [
              'Georgia', 'Times New Roman', 'Garamond', 'Palatino', 'Book Antiqua',
              'Crimson Text', 'Playfair Display', 'Libre Baskerville'
            ],
            jerseyPatterns: [
              'linear-gradient(135deg, #8b4513 25%, transparent 25%, transparent 75%, #8b4513 75%)',
              'radial-gradient(ellipse, #daa520 40%, transparent 40%)',
              'linear-gradient(45deg, #cd853f 30%, #d2691e 70%)',
              'repeating-radial-gradient(circle, #a0522d, #a0522d 5px, transparent 5px, transparent 10px)'
            ]
          };
        case 'connect':
          return {
            colors: [
              '#ff1493', '#00ffff', '#ff00ff', '#39ff14', '#ffff00', '#ff6600',
              '#00ff7f', '#ff4500', '#da70d6', '#87ceeb', '#ffd700', '#ff69b4'
            ],
            fonts: [
              'Courier New', 'Monaco', 'Orbitron', 'Rajdhani', 'Russo One',
              'Audiowide', 'Exo 2', 'Share Tech Mono', 'Space Mono',
              'Press Start 2P', 'VT323', 'Share Tech Mono'
            ],
            jerseyPatterns: [
              'linear-gradient(45deg, #ff1493 25%, transparent 25%, transparent 75%, #ff1493 75%)',
              'radial-gradient(circle, #00ffff 25%, transparent 25%)',
              'conic-gradient(from 45deg, #ff00ff, #39ff14, #ffff00, #ff6600)',
              'repeating-linear-gradient(90deg, #00ff7f, #00ff7f 5px, transparent 5px, transparent 15px)'
            ]
          };
      }
    };
    return getThemeConfig(theme);
  }, [theme]);

  // Memoized utility functions for performance
  const generateLetterShape = useCallback((): 'square' | 'wide' | 'tall' | 'skew' => {
    const shapes = ['square', 'wide', 'tall', 'skew'] as const;
    return shapes[Math.floor(Math.random() * shapes.length)];
  }, []);

  const generateTransparencyPattern = useCallback((): 'solid' | 'transparent' | 'gold' => {
    const patterns = ['solid', 'transparent'] as const;
    return patterns[Math.floor(Math.random() * patterns.length)];
  }, []);

  // Initialize letters
  useEffect(() => {
    const initialLetters = children.split('').map((char, index) => ({
      char,
      id: `${componentIdRef.current}-letter-${index}`,
      animationType: 'none',
      isAnimating: false,
      position: { x: 0, y: 0 },
      color: themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)],
      fontSize: `${Math.random() * 0.5 + 1.2}em`,
      fontFamily: themeConfig.fonts[Math.floor(Math.random() * themeConfig.fonts.length)],
      opacity: 1,
      transform: `rotate(${(Math.random() - 0.5) * 20}deg) scale(${Math.random() * 0.3 + 0.9})`,
      pattern: generateTransparencyPattern(),
      jerseyPattern: themeConfig.jerseyPatterns
        ? themeConfig.jerseyPatterns[Math.floor(Math.random() * themeConfig.jerseyPatterns.length)]
        : undefined,
      shape: generateLetterShape(),
      backgroundStyle: {
        background: themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)],
        border: `2px solid ${themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)]}`,
        borderRadius: `${Math.random() * 10}px`,
        boxShadow: `2px 2px 5px rgba(0, 0, 0, 0.3)`,
        textShadow: `1px 1px 2px rgba(0, 0, 0, 0.5)`
      },
      isFlipping: false,
      textShadow: `1px 1px 2px rgba(0, 0, 0, 0.5)`,
      zIndex: index
    }));
    setLetters(initialLetters);
  }, [children, themeConfig, generateLetterShape, generateTransparencyPattern]);

  // Animation loop
  useEffect(() => {
    if (isPaused) return;

    const animationId = `${componentIdRef.current}-animation`;

    const animate = () => {
      if (!isPaused) {
        setLetters(prev => prev.map(letter => ({
          ...letter,
          transform: `rotate(${(Math.random() - 0.5) * 20}deg) scale(${Math.random() * 0.3 + 0.9})`,
          color: themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)],
          backgroundStyle: {
            ...letter.backgroundStyle,
            background: themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)]
          }
        })));
      }
    };

    animationPoolRef.current.add(animationId, animate);

    return () => {
      animationPoolRef.current.remove(animationId);
    };
  }, [isPaused, themeConfig]);

  // Update animation key when theme changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [theme]);

  // Spelling animation
  useEffect(() => {
    if (isPaused) return;

    if (currentAnimation === 'spell' && !isSpellingOut) {
      setIsSpellingOut(true);
      setSpellIndex(0);
    }

    if (isSpellingOut) {
      const intervalId = setInterval(() => {
        setLetters(prev => {
          const newLetters = [...prev];
          if (spellIndex < newLetters.length) {
            newLetters[spellIndex] = { ...newLetters[spellIndex], opacity: 1 };
            setSpellIndex(prevIndex => prevIndex + 1);
            return newLetters;
          } else {
            clearInterval(intervalId);
            setIsSpellingOut(false);
            return prev;
          }
        });
      }, 200);

      return () => clearInterval(intervalId);
    }
  }, [currentAnimation, isSpellingOut, spellIndex, isPaused]);

  // Flipping animation
  const startFlipping = useCallback(() => {
    const numberOfLettersToFlip = Math.floor(letters.length * 0.3);
    const lettersToFlip: number[] = [];

    while (lettersToFlip.length < numberOfLettersToFlip) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      if (!lettersToFlip.includes(randomIndex)) {
        lettersToFlip.push(randomIndex);
      }
    }

    setFlippingLetters(lettersToFlip);
  }, [letters.length]);

  useEffect(() => {
    if (currentAnimation === 'spin') {
      startFlipping();
    }
  }, [currentAnimation, startFlipping]);

  useEffect(() => {
    if (flippingLetters.length > 0) {
      const intervalId = setInterval(() => {
        setLetters(prev => {
          const newLetters = prev.map((letter, index) => {
            if (flippingLetters.includes(index)) {
              return { ...letter, isFlipping: !letter.isFlipping };
            }
            return letter;
          });
          return newLetters;
        });
      }, 500);

      return () => clearInterval(intervalId);
    }
  }, [flippingLetters]);

  // Gold letter animation
  const startGoldAnimation = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * letters.length);
    setGoldLetterIndex(randomIndex);
  }, [letters.length]);

  useEffect(() => {
    if (currentAnimation === 'glow') {
      startGoldAnimation();
    }
  }, [currentAnimation, startGoldAnimation]);

  // Typography transition
  const startTypographyTransition = useCallback(() => {
    setIsReturningToTypography(true);
    setTypographyTransitionPhase('background-fade');
    setTypographyProgress(0);
  }, []);

  useEffect(() => {
    if (showTypographyControls && !isReturningToTypography) {
      startTypographyTransition();
    }
  }, [showTypographyControls, isReturningToTypography, startTypographyTransition]);

  useEffect(() => {
    if (isReturningToTypography) {
      let animationFrameId: number;
      const duration = 2000; // 2 seconds for each phase
      const startTime = performance.now();

      const animateTransition = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        let progress = Math.min(elapsedTime / duration, 1);

        setTypographyProgress(progress);

        if (typographyTransitionPhase === 'background-fade') {
          setLetters(prev => prev.map(letter => ({
            ...letter,
            backgroundStyle: {
              ...letter.backgroundStyle,
              background: `rgba(255, 255, 255, ${1 - progress})`
            }
          })));

          if (progress === 1) {
            setTypographyTransitionPhase('color-transition');
            startTime = performance.now();
            progress = 0;
          }
        } else if (typographyTransitionPhase === 'color-transition') {
          setLetters(prev => prev.map(letter => ({
            ...letter,
            color: `rgba(0, 0, 0, ${progress})`
          })));

          if (progress === 1) {
            setTypographyTransitionPhase('font-normalize');
            startTime = performance.now();
            progress = 0;
          }
        } else if (typographyTransitionPhase === 'font-normalize') {
          setLetters(prev => prev.map(letter => ({
            ...letter,
            fontSize: `${1.2 + (1 - progress) * 0.5}em`,
            transform: `rotate(${(Math.random() - 0.5) * 20 * (1 - progress)}deg) scale(${0.9 + (1 - progress) * 0.3})`
          })));

          if (progress === 1) {
            setTypographyTransitionPhase('typography');
            startTime = performance.now();
            progress = 0;
          }
        } else if (typographyTransitionPhase === 'typography') {
          setLetters(prev => prev.map(letter => ({
            ...letter,
            fontFamily: 'Arial',
            shape: 'square'
          })));

          setIsReturningToTypography(false);
          setTypographyTransitionPhase('idle');
        }

        if (isReturningToTypography) {
          animationFrameId = requestAnimationFrame(animateTransition);
        }
      };

      animationFrameId = requestAnimationFrame(animateTransition);

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [isReturningToTypography, typographyTransitionPhase, showTypographyControls]);

  // Sliding animation
  const startSlidingAnimation = useCallback(() => {
    setIsSliding(true);
  }, []);

  useEffect(() => {
    if (currentAnimation === 'float') {
      startSlidingAnimation();
    }
  }, [currentAnimation, startSlidingAnimation]);

  useEffect(() => {
    if (isSliding) {
      const intervalId = setInterval(() => {
        setLetters(prev => {
          return prev.map(letter => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            return {
              ...letter,
              position: { x: randomX, y: randomY }
            };
          });
        });
      }, 300);

      return () => clearInterval(intervalId);
    }
  }, [isSliding]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{
        contain: 'layout style paint',
        willChange: isPaused ? 'auto' : 'transform'
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={`${animationKey}-${index}`}
          className="letter-transition inline-block"
          style={{
            ...letter.backgroundStyle,
            color: letter.pattern === 'gold' && goldLetterIndex === index ? 'gold' : letter.color,
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            padding: '0.2em 0.1em',
            margin: '0 0.05em',
            borderRadius: '4px',
            transformOrigin: 'center',
            opacity: currentAnimation === 'spell' && isSpellingOut ? (index < spellIndex ? 1 : 0) : letter.opacity,
            fontFamily: letter.fontFamily,
            fontSize: letter.fontSize,
            position: 'relative',
            left: isSliding ? `${letter.position.x}px` : '0',
            top: isSliding ? `${letter.position.y}px` : '0',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            transform: `translate3d(0, 0, 0) ${letter.transform} ${letter.isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)'}`,
            textShadow: letter.textShadow,
            zIndex: letter.zIndex
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  );
};
