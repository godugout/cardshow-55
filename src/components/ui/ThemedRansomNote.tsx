
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

  // Generate dramatic letter state with wild animations
  const generateLetterState = useCallback((char: string, index: number): LetterState => {
    const animationTypes: ('spell' | 'spin' | 'float' | 'glow' | 'none')[] = ['spell', 'spin', 'float', 'glow', 'none'];
    const randomAnimationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const randomColor = themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)];
    const randomFont = themeConfig.fonts[Math.floor(Math.random() * themeConfig.fonts.length)];
    const randomPattern = themeConfig.patterns[Math.floor(Math.random() * themeConfig.patterns.length)];
    
    // Dramatic positioning and transforms
    const rotation = Math.random() > 0.9 ? (Math.random() - 0.5) * 720 : (Math.random() - 0.5) * 120; // Occasional full spins
    const scale = Math.random() * 1.2 + 0.6; // Wild scaling from 0.6 to 1.8
    
    return {
      char,
      id: `letter-${index}-${Date.now()}`,
      animationType: randomAnimationType,
      isAnimating: false,
      position: { x: Math.random() * 30 - 15, y: Math.random() * 30 - 15 }, // Dramatic ±15px movement
      color: randomColor,
      fontSize: `${Math.random() * 1.5 + 0.8}em`, // Wider font size range
      fontFamily: randomFont,
      opacity: Math.random() * 0.5 + 0.5,
      transform: `rotate(${rotation}deg) scale(${scale})`,
      pattern: randomPattern,
      textShadow: Math.random() > 0.5 ? `${Math.random() * 4 + 1}px ${Math.random() * 4 + 1}px ${Math.random() * 8 + 2}px rgba(0,0,0,0.4)` : 'none',
      border: Math.random() > 0.7 ? `${Math.random() * 3 + 1}px solid ${randomColor}` : 'none',
      borderRadius: Math.random() > 0.5 ? `${Math.random() * 15 + 2}px` : '0',
      backgroundColor: Math.random() > 0.7 ? `${randomColor}33` : 'transparent',
      zIndex: Math.floor(Math.random() * 20) + 1
    };
  }, [themeConfig]);

  // Initialize letters
  useEffect(() => {
    const letterArray = children.split('').map((char, index) => generateLetterState(char, index));
    setLetters(letterArray);
  }, [children, generateLetterState]);

  // Dramatic animation loop with individual letter timing
  useEffect(() => {
    if (isPaused) return;

    const intervals: NodeJS.Timeout[] = [];

    // Create individual animation intervals for each letter
    letters.forEach((_, index) => {
      const randomInterval = Math.random() * 800 + 200; // 200ms to 1000ms per letter
      
      const interval = setInterval(() => {
        setLetters(prev => prev.map((letter, letterIndex) => {
          if (letterIndex !== index) return letter;
          
          const shouldAnimate = Math.random() > 0.4; // Higher chance of animation
          if (!shouldAnimate) return letter;

          const animationTypes: ('spell' | 'spin' | 'float' | 'glow' | 'none')[] = ['spell', 'spin', 'float', 'glow', 'none'];
          const newAnimationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
          
          // Dramatic transformations
          const rotation = Math.random() > 0.95 ? (Math.random() - 0.5) * 1080 : (Math.random() - 0.5) * 120;
          const scale = Math.random() * 1.2 + 0.6; // 0.6 to 1.8 scale range
          
          return {
            ...letter,
            animationType: newAnimationType,
            isAnimating: shouldAnimate,
            position: { 
              x: Math.random() * 30 - 15, // ±15px dramatic movement
              y: Math.random() * 30 - 15 
            },
            transform: `rotate(${rotation}deg) scale(${scale})`,
            opacity: Math.random() * 0.5 + 0.5,
            color: themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)],
            fontSize: `${Math.random() * 1.5 + 0.8}em`,
            fontFamily: themeConfig.fonts[Math.floor(Math.random() * themeConfig.fonts.length)]
          };
        }));
      }, randomInterval);
      
      intervals.push(interval);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [isPaused, letters.length, themeConfig]);

  // Update animation key when theme changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [theme]);

  const getAnimationClass = (animationType: string) => {
    switch (animationType) {
      case 'spell': return 'animate-bounce ransom-float';
      case 'spin': return 'animate-spin ransom-wiggle';
      case 'float': return 'animate-pulse ransom-shake';
      case 'glow': return 'animate-ping ransom-drift';
      default: return 'ransom-subtle';
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
      <style>
        {`
          @keyframes ransom-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-3px) rotate(1deg); }
            50% { transform: translateY(-6px) rotate(-1deg); }
            75% { transform: translateY(-3px) rotate(2deg); }
          }
          
          @keyframes ransom-wiggle {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(2deg) scale(1.05); }
            50% { transform: rotate(-2deg) scale(0.95); }
            75% { transform: rotate(1deg) scale(1.02); }
          }
          
          @keyframes ransom-shake {
            0%, 100% { transform: translateX(0px); }
            10% { transform: translateX(-2px) rotate(-1deg); }
            20% { transform: translateX(2px) rotate(1deg); }
            30% { transform: translateX(-1px) rotate(-0.5deg); }
            40% { transform: translateX(1px) rotate(0.5deg); }
            50% { transform: translateX(-0.5px) rotate(-0.25deg); }
            60% { transform: translateX(0.5px) rotate(0.25deg); }
          }
          
          @keyframes ransom-drift {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(2px, -2px) scale(1.1); }
            66% { transform: translate(-1px, 2px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          @keyframes ransom-subtle {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(0.5deg); }
          }
          
          .ransom-float { animation: ransom-float 3s ease-in-out infinite; }
          .ransom-wiggle { animation: ransom-wiggle 2s ease-in-out infinite; }
          .ransom-shake { animation: ransom-shake 1.5s ease-in-out infinite; }
          .ransom-drift { animation: ransom-drift 4s ease-in-out infinite; }
          .ransom-subtle { animation: ransom-subtle 6s ease-in-out infinite; }
        `}
      </style>
      {letters.map((letter, index) => (
        <span
          key={`${animationKey}-${index}`}
          className={`inline-block transition-all duration-500 ${getAnimationClass(letter.animationType)}`}
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
            // Use transform3d for hardware acceleration with dramatic effects
            transform: `translate3d(${letter.position.x}px, ${letter.position.y}px, 0) ${letter.transform}`,
            animationDelay: `${index * 50}ms`, // Stagger letter animations
            ...getPatternStyle(letter.pattern, letter.color)
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  );
};
