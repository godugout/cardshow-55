
import { useEffect, useRef, useState } from 'react';

interface AutoRotationManagerProps {
  autoRotate: boolean;
  isDragging: boolean;
  setRotation: (rotation: { x: number; y: number }) => void;
}

export const AutoRotationManager: React.FC<AutoRotationManagerProps> = ({
  autoRotate,
  isDragging,
  setRotation
}) => {
  const animationRef = useRef<number>();
  const rotationRef = useRef({ x: 0, y: 0 });

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        // Update the rotation values
        rotationRef.current = {
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: rotationRef.current.y + 0.5
        };
        
        // Pass the direct rotation object
        setRotation(rotationRef.current);
        
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging, setRotation]);

  return null; // This component doesn't render anything
};
