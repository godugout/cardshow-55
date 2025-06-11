
import React, { useRef, useCallback } from 'react';

interface Card3DTransformProps {
  children: React.ReactNode;
  rotation: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  isHovering: boolean;
  onClick: () => void;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  children,
  rotation,
  mousePosition,
  isDragging,
  interactiveLighting = false,
  isHovering,
  onClick
}) => {
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    clickCount.current += 1;
    
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    
    clickTimeout.current = setTimeout(() => {
      if (clickCount.current === 2) {
        // Double click - flip card
        onClick();
      }
      // Single click does nothing now - just drag to rotate
      clickCount.current = 0;
    }, 300);
  }, [onClick]);

  // Calculate dynamic transform
  const getDynamicTransform = () => {
    let baseTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    
    // Add subtle interactive lighting-based depth effect
    if (interactiveLighting && isHovering) {
      const lightDepth = (mousePosition.x - 0.5) * 2; // -1 to 1
      const additionalRotateY = lightDepth * 1; // Max 1 degree
      baseTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y + additionalRotateY}deg)`;
    }
    
    return baseTransform;
  };

  return (
    <div
      className="relative cursor-grab active:cursor-grabbing"
      style={{
        width: '400px',
        height: '560px',
        transform: getDynamicTransform(),
        transformStyle: 'preserve-3d',
        transition: isDragging ? 'none' : 'transform 0.1s ease',
        filter: `drop-shadow(0 25px 50px rgba(0,0,0,${interactiveLighting && isHovering ? 0.9 : 0.8}))`
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
