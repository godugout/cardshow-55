import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPixelTextProps {
  text: string;
  className?: string;
}

const COLORS = [
  'hsl(var(--crd-orange))',
  'hsl(var(--crd-green))',
  'hsl(var(--crd-blue))',
  'hsl(var(--crd-purple))',
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];
const getRandomDelay = () => Math.random() * 2;

interface PixelProps {
  delay: number;
  color: string;
  isActive: boolean;
}

const Pixel: React.FC<PixelProps> = ({ delay, color, isActive }) => {
  const [currentColor, setCurrentColor] = useState(color);
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCurrentColor(getRandomColor());
      }, 500 + Math.random() * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div
      className={cn(
        "w-1 h-1 transition-all duration-300 will-change-transform",
        isActive ? "animate-pixel-pulse" : "animate-pixel-shimmer"
      )}
      style={{
        backgroundColor: currentColor,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

export const AnimatedPixelText: React.FC<AnimatedPixelTextProps> = ({ 
  text, 
  className 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pixels] = useState(() => {
    // Generate a grid of pixels for the text
    const pixelArray = [];
    const rows = 24; // Adjusted for 3x scale
    const cols = text.length * 16; // Adjusted for 3x scale
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        pixelArray.push({
          delay: (row * 0.05) + (col * 0.02),
          color: getRandomColor(),
        });
      }
    }
    return pixelArray;
  });

  return (
    <span
      className={cn(
        "inline-block relative cursor-pointer align-baseline",
        // Make it 3x larger than normal display text but keep inline
        "text-[15rem] md:text-[18rem] lg:text-[21rem] xl:text-[24rem] font-extrabold leading-[0.8] tracking-[-1.28px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ verticalAlign: 'baseline' }}
    >
      {/* Invisible text for layout */}
      <span className="text-transparent relative z-10">
        {text}
      </span>
      
      {/* Pixel overlay with text mask */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          WebkitMask: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${text.length * 120} 160'>
              <text x='0' y='120' font-family='DM Sans, system-ui, -apple-system, sans-serif' font-weight='800' font-size='120' fill='black'>${text}</text>
            </svg>
          `)}")`,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      >
        <div 
          className="grid gap-[1px] w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${text.length * 16}, minmax(0, 1fr))`,
            gridTemplateRows: 'repeat(24, minmax(0, 1fr))',
          }}
        >
          {pixels.map((pixel, index) => (
            <Pixel
              key={index}
              delay={pixel.delay}
              color={pixel.color}
              isActive={isHovered}
            />
          ))}
        </div>
      </div>
      
      {/* Floating particles effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 animate-pixel-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: getRandomColor(),
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
    </span>
  );
};
