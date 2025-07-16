
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';

interface ThemedRansomNoteProps {
  children: string;
  theme: 'craft' | 'collect' | 'connect';
  className?: string;
  isPaused?: boolean;
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
  pattern: 'solid' | 'striped' | 'gradient' | 'gold';
  textShadow: string;
  border: string;
  borderRadius: string;
  backgroundColor: string;
  zIndex: number;
}

// Animation frame pool for performance
class AnimationPool {
  private animations = new Map<string, () => void>();
  private rafId: number | null = null;
  
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

const animationPool = new AnimationPool();

export const ThemedRansomNote: React.FC<ThemedRansomNoteProps> = ({ 
  children, 
  theme,
  className = "",
  isPaused = false
}) => {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<string>('');

  // Memoized theme configurations
  const themeConfig = useMemo(() => {
    const configs = {
      craft: {
        colors: ['#ff1744', '#00e676', '#2196f3', '#ffeb3b', '#e91e63', '#9c27b0', '#ff5722', '#009688', '#795548', '#607d8b'],
        patterns: ['solid', 'striped', 'gradient', 'gold'] as const,
        fonts: ['Impact', 'Arial Black', 'Helvetica Bold', 'Bebas Neue', 'Anton', 'Oswald']
      },
      collect: {
        colors: ['#8b4513', '#daa520', '#cd853f', '#d2691e', '#a0522d', '#f4a460', '#deb887', '#d2b48c', '#bc8f8f', '#f5deb3'],
        patterns: ['solid', 'striped', 'gradient'] as const,
        fonts: ['Georgia', 'Times New Roman', 'Garamond', 'Palatino', 'Book Antiqua', 'Crimson Text']
      },
      connect: {
        colors: ['#ff1493', '#00ffff', '#ff00ff', '#39ff14', '#ffff00', '#ff6600', '#8a2be2', '#dc143c', '#00bfff', '#adff2f'],
        patterns: ['solid', 'gradient', 'gold'] as const,
        fonts: ['Courier New', 'Monaco', 'Orbitron', 'Rajdhani', 'Russo One', 'Share Tech Mono']
      }
    };
    return configs[theme];
  }, [theme]);

  // Debounced letter update function
  const debouncedUpdate = useMemo(
    () => {
      let timeoutId: NodeJS.Timeout;
      return (callback: () => void) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, 100);
      };
    },
    []
  );

  // Generate optimized letter state
  const generateLetterState = useCallback((char: string, index: number): LetterState => {
    const animationTypes: ('spell' | 'spin' | 'float' | 'glow' | 'none')[] = ['spell', 'spin', 'float', 'glow', 'none'];
    const randomAnimationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const randomColor = themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)];
    const randomFont = themeConfig.fonts[Math.floor(Math.random() * themeConfig.fonts.length)];
    const randomPattern = themeConfig.patterns[Math.floor(Math.random() * themeConfig.patterns.length)];
    
    return {
      char,
      id: `letter-${index}-${Date.now()}`,
      animationType: randomAnimationType,
      isAnimating: false,
      position: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
      color: randomColor,
      fontSize: `${Math.random() * 0.8 + 1.2}em`,
      fontFamily: randomFont,
      opacity: Math.random() * 0.3 + 0.7,
      transform: `rotate(${(Math.random() - 0.5) * 20}deg) scale(${Math.random() * 0.4 + 0.8})`,
      pattern: randomPattern,
      textShadow: Math.random() > 0.7 ? `2px 2px 4px rgba(0,0,0,0.3)` : 'none',
      border: Math.random() > 0.8 ? `2px solid ${randomColor}` : 'none',
      borderRadius: Math.random() > 0.6 ? `${Math.random() * 10 + 5}px` : '0',
      backgroundColor: Math.random() > 0.8 ? `${randomColor}22` : 'transparent',
      zIndex: Math.floor(Math.random() * 10) + 1
    };
  }, [themeConfig]);

  // Initialize letters
  useEffect(() => {
    const letterArray = children.split('').map((char, index) => generateLetterState(char, index));
    setLetters(letterArray);
  }, [children, generateLetterState]);

  // Animation loop with performance optimizations
  useEffect(() => {
    if (isPaused) return;

    animationIdRef.current = `ransom-note-${Date.now()}`;
    const animationId = animationIdRef.current;
    let startTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      if (currentTime - startTime > 2000) { // Update every 2 seconds
        debouncedUpdate(() => {
          setLetters(prev => prev.map(letter => {
            const shouldAnimate = Math.random() > 0.7;
            if (!shouldAnimate) return letter;

            const animationTypes: ('spell' | 'spin' | 'float' | 'glow' | 'none')[] = ['spell', 'spin', 'float', 'glow', 'none'];
            const newAnimationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
            
            return {
              ...letter,
              animationType: newAnimationType,
              isAnimating: shouldAnimate,
              position: { 
                x: Math.random() * 4 - 2, 
                y: Math.random() * 4 - 2 
              },
              transform: `rotate(${(Math.random() - 0.5) * 30}deg) scale(${Math.random() * 0.5 + 0.75})`,
              opacity: Math.random() * 0.4 + 0.6
            };
          }));
        });
        startTime = currentTime;
      }
    };

    animationPool.add(animationId, animate);

    return () => {
      animationPool.remove(animationId);
    };
  }, [isPaused, debouncedUpdate]);

  // Update animation key when theme changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [theme]);

  const getAnimationClass = (animationType: string) => {
    switch (animationType) {
      case 'spell': return 'animate-bounce';
      case 'spin': return 'animate-spin';
      case 'float': return 'animate-pulse';
      case 'glow': return 'animate-ping';
      default: return '';
    }
  };

  const getPatternStyle = (pattern: string, color: string) => {
    switch (pattern) {
      case 'striped':
        return {
          background: `repeating-linear-gradient(45deg, ${color}, ${color} 10px, transparent 10px, transparent 20px)`
        };
      case 'gradient':
        return {
          background: `linear-gradient(45deg, ${color}, ${color}88, ${color})`
        };
      case 'gold':
        return {
          background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        };
      default:
        return {};
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`inline-block ${className}`}
      style={{ 
        contain: 'layout style paint',
        willChange: isPaused ? 'auto' : 'transform'
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={`${animationKey}-${index}`}
          className={`inline-block transition-all duration-300 ${getAnimationClass(letter.animationType)}`}
          style={{
            color: letter.color,
            fontSize: letter.fontSize,
            fontFamily: letter.fontFamily,
            opacity: letter.opacity,
            textShadow: letter.textShadow,
            border: letter.border,
            borderRadius: letter.borderRadius,
            backgroundColor: letter.backgroundColor,
            zIndex: letter.zIndex,
            padding: '0.1em 0.05em',
            margin: '0 0.02em',
            transformOrigin: 'center',
            // Use transform3d for hardware acceleration
            transform: `translate3d(${letter.position.x}px, ${letter.position.y}px, 0) ${letter.transform}`,
            ...getPatternStyle(letter.pattern, letter.color)
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  );
};
