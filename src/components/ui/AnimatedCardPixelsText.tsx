
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CardPixel {
  id: number;
  x: number;
  y: number;
  color: string;
  animationType: 'float' | 'spiral' | 'shimmer' | 'teleport';
  speed: number;
  delay: number;
  opacity: number;
}

interface AnimatedCardPixelsTextProps {
  text: string;
  className?: string;
}

export const AnimatedCardPixelsText: React.FC<AnimatedCardPixelsTextProps> = ({ 
  text, 
  className 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenTextRef = useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = useState<CardPixel[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 120 }); // Better default dimensions
  const animationRef = useRef<number>();

  // Card rarity colors
  const cardColors = [
    '#9CA3AF', // common - gray
    '#22C55E', // uncommon - green
    '#3B82F6', // rare - blue
    '#8B5CF6', // epic - purple
    '#F59E0B', // legendary - gold
    '#EF4444', // mythic - red
  ];

  // Generate random pixels within text bounds
  const generatePixels = (textWidth: number, textHeight: number) => {
    const pixelCount = Math.floor((textWidth * textHeight) / 600); // Adjusted density
    const newPixels: CardPixel[] = [];

    for (let i = 0; i < pixelCount; i++) {
      const animationTypes: CardPixel['animationType'][] = ['float', 'spiral', 'shimmer', 'teleport'];
      
      newPixels.push({
        id: i,
        x: Math.random() * textWidth,
        y: Math.random() * textHeight,
        color: cardColors[Math.floor(Math.random() * cardColors.length)],
        animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)],
        speed: 0.5 + Math.random() * 2,
        delay: Math.random() * 5000,
        opacity: 0.6 + Math.random() * 0.4,
      });
    }

    setPixels(newPixels);
  };

  // Animation loop
  useEffect(() => {
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      setPixels(prevPixels => 
        prevPixels.map(pixel => {
          const pixelTime = elapsed - pixel.delay;
          if (pixelTime < 0) return pixel;

          let newX = pixel.x;
          let newY = pixel.y;
          let newOpacity = pixel.opacity;

          switch (pixel.animationType) {
            case 'float':
              newY = pixel.y + Math.sin(pixelTime * 0.001 * pixel.speed) * 3;
              newX = pixel.x + Math.cos(pixelTime * 0.0005 * pixel.speed) * 2;
              break;
            
            case 'spiral':
              const spiralRadius = 4;
              const spiralSpeed = pixelTime * 0.002 * pixel.speed;
              newX = pixel.x + Math.cos(spiralSpeed) * spiralRadius;
              newY = pixel.y + Math.sin(spiralSpeed) * spiralRadius;
              break;
            
            case 'shimmer':
              newOpacity = pixel.opacity + Math.sin(pixelTime * 0.003 * pixel.speed) * 0.3;
              break;
            
            case 'teleport':
              if (pixelTime % 3000 < 100) { // Teleport every 3 seconds for 100ms
                newX = Math.random() * dimensions.width;
                newY = Math.random() * dimensions.height;
              }
              break;
          }

          // Keep pixels within bounds
          newX = Math.max(0, Math.min(dimensions.width, newX));
          newY = Math.max(0, Math.min(dimensions.height, newY));
          newOpacity = Math.max(0.2, Math.min(1, newOpacity));

          return {
            ...pixel,
            x: newX,
            y: newY,
            opacity: newOpacity,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    if (pixels.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, pixels.length > 0]);

  // Measure text dimensions and generate pixels
  useEffect(() => {
    const measureText = () => {
      if (hiddenTextRef.current) {
        const rect = hiddenTextRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const newDimensions = { 
            width: Math.max(rect.width, 400), 
            height: Math.max(rect.height, 80) 
          };
          setDimensions(newDimensions);
          generatePixels(newDimensions.width, newDimensions.height);
        }
      }
    };

    // Measure immediately and after a short delay for font loading
    measureText();
    const timeoutId = setTimeout(measureText, 100);

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Hidden text for measurement - using proper hero sizing */}
      <div 
        ref={hiddenTextRef}
        className="absolute top-0 left-0 opacity-0 pointer-events-none text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-extrabold whitespace-nowrap"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
        aria-hidden="true"
      >
        {text}
      </div>

      {/* SVG with animated pixels */}
      <div className="relative">
        <svg
          className="block"
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          <defs>
            <mask id={`textMask-${text.replace(/\s+/g, '-')}`}>
              <rect width="100%" height="100%" fill="black" />
              <text
                x="0"
                y="75%"
                fill="white"
                className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-extrabold"
                style={{ 
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: `${Math.min(dimensions.height * 0.7, 60)}px`
                }}
              >
                {text}
              </text>
            </mask>
          </defs>

          {/* Animated card pixels */}
          <g mask={`url(#textMask-${text.replace(/\s+/g, '-')})`}>
            {pixels.map(pixel => (
              <rect
                key={pixel.id}
                x={pixel.x}
                y={pixel.y}
                width="3"
                height="4"
                rx="0.5"
                ry="0.5"
                fill={pixel.color}
                opacity={pixel.opacity}
                style={{
                  filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
                }}
              />
            ))}
          </g>
        </svg>

        {/* Fallback text that's visible during loading */}
        <div 
          className="absolute top-0 left-0 text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-crd-blue to-crd-purple"
          style={{ 
            fontFamily: 'DM Sans, sans-serif',
            opacity: pixels.length === 0 ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
