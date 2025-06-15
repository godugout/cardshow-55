
import React, { useMemo } from 'react';

interface Card3DTransformProps {
  rotation: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  isHovering: boolean;
  children: React.ReactNode;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  rotation,
  mousePosition,
  isDragging,
  interactiveLighting = false,
  isHovering,
  children
}) => {
  console.log('🎯 Card3DTransform - Rotation X:', rotation.x.toFixed(1), 'Y:', rotation.y.toFixed(1));

  // Memoize transform styles for better performance
  const transformStyles = useMemo(() => {
    const baseTransform = `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    
    // Add subtle interactive lighting transform if enabled
    const lightingTransform = interactiveLighting && isHovering 
      ? ` translateZ(${(mousePosition.x + mousePosition.y) * 5}px)`
      : '';
    
    return {
      transform: baseTransform + lightingTransform,
      transformStyle: 'preserve-3d' as const,
      transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: isDragging ? 'transform' : 'auto',
      backfaceVisibility: 'hidden' as const
    };
  }, [rotation.x, rotation.y, mousePosition, isDragging, interactiveLighting, isHovering]);

  return (
    <div 
      className="relative w-[300px] h-[420px]"
      style={transformStyles}
    >
      {children}
    </div>
  );
};

Card3DTransform.displayName = 'Card3DTransform';
