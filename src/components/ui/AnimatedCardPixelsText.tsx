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
  const svgRef = useRef<SVGSVGElement>(null);
  const [pixels, setPixels] = useState<CardPixel[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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
    const pixelCount = Math.floor((textWidth * textHeight) / 800); // Adjust density
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

    if (dimensions.width > 0 && dimensions.height > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  // Measure text dimensions and generate pixels
  useEffect(() => {
    if (svgRef.current) {
      const textElement = svgRef.current.querySelector('text');
      if (textElement) {
        const bbox = textElement.getBBox();
        const newDimensions = { width: bbox.width, height: bbox.height };
        setDimensions(newDimensions);
        generatePixels(newDimensions.width, newDimensions.height);
      }
    }
  }, [text]);

  return (
    <div className={cn("relative inline-block", className)}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width || 400} ${dimensions.height || 100}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <mask id="textMask">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="0"
              y="80%"
              fill="white"
              className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-extrabold"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {text}
            </text>
          </mask>
        </defs>

        {/* Animated card pixels */}
        <g mask="url(#textMask)">
          {pixels.map(pixel => (
            <rect
              key={pixel.id}
              x={pixel.x}
              y={pixel.y}
              width="2.5"
              height="3.5"
              rx="0.3"
              ry="0.3"
              fill={pixel.color}
              opacity={pixel.opacity}
              style={{
                transform: `translate(${pixel.x}px, ${pixel.y}px)`,
                transition: pixel.animationType === 'teleport' ? 'none' : 'transform 0.1s ease-out',
                filter: 'drop-shadow(0 0.5px 0.5px rgba(0,0,0,0.3))',
              }}
            />
          ))}
        </g>

        {/* Hidden text for measurement */}
        <text
          x="0"
          y="80%"
          fill="transparent"
          className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-extrabold"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
