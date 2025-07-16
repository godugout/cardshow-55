import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';

interface ThemedRansomNoteProps {
  children: string;
  theme: 'craft' | 'collect' | 'connect';
  className?: string;
  isPaused?: boolean;
}

interface LetterState {
  char: string;
  isAnimating: boolean;
  style: LetterStyle;
  transform: string;
}

interface LetterStyle {
  color: string;
  backgroundColor: string;
  fontSize: string;
  fontFamily: string;
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

export const ThemedRansomNoteOptimized: React.FC<ThemedRansomNoteProps> = ({ 
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
        colors: ['#ff1744', '#00e676', '#2196f3', '#ffeb3b', '#e91e63', '#9c27b0'],
        backgrounds: ['#ff1744', '#00e676', '#2196f3', '#ffeb3b', '#e91e63', '#ffd700'],
        fonts: ['Impact', 'Arial Black', 'Helvetica Bold', 'Bebas Neue', 'Anton']
      },
      collect: {
        colors: ['#8b4513', '#daa520', '#cd853f', '#d2691e', '#a0522d', '#f4a460'],
        backgrounds: ['#f5f5dc', '#faebd7', '#daa520', '#cd853f', '#8b4513'],
        fonts: ['Georgia', 'Times New Roman', 'Garamond', 'Palatino', 'Book Antiqua']
      },
      connect: {
        colors: ['#ff1493', '#00ffff', '#ff00ff', '#39ff14', '#ffff00', '#ff6600'],
        backgrounds: ['#ff1493', '#00ffff', '#39ff14', '#ff00ff', '#ffff00'],
        fonts: ['Courier New', 'Monaco', 'Orbitron', 'Rajdhani', 'Russo One']
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
  const generateLetterState = useCallback((char: string): LetterState => {
    const randomColor = themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)];
    const randomBg = themeConfig.backgrounds[Math.floor(Math.random() * themeConfig.backgrounds.length)];
    const randomFont = themeConfig.fonts[Math.floor(Math.random() * themeConfig.fonts.length)];
    
    return {
      char,
      isAnimating: false,
      style: {
        color: randomColor,
        backgroundColor: randomBg,
        fontSize: `${Math.random() * 0.5 + 1.2}em`,
        fontFamily: randomFont
      },
      transform: `rotate(${(Math.random() - 0.5) * 10}deg) scale(${Math.random() * 0.2 + 0.9})`
    };
  }, [themeConfig]);

  // Initialize letters
  useEffect(() => {
    const letterArray = children.split('').map(generateLetterState);
    setLetters(letterArray);
  }, [children, generateLetterState]);

  // Animation loop
  useEffect(() => {
    if (isPaused) return;

    animationIdRef.current = `ransom-note-${Date.now()}`;
    const animationId = animationIdRef.current;

    const animate = () => {
      if (!isPaused) {
        debouncedUpdate(() => {
          setLetters(prev => prev.map(letter => ({
            ...letter,
            transform: `rotate(${(Math.random() - 0.5) * 10}deg) scale(${Math.random() * 0.2 + 0.9})`
          })));
        });
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
          className="letter-transition inline-block"
          style={{
            ...letter.style,
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            padding: '0.2em 0.1em',
            margin: '0 0.05em',
            borderRadius: '4px',
            transformOrigin: 'center',
            // Use transform3d for hardware acceleration
            transform: `translate3d(0, 0, 0) ${letter.transform}`
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  );
};