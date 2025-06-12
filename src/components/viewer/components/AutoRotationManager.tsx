
import { useEffect, useRef } from 'react';

interface AutoRotationManagerProps {
  autoRotate: boolean;
  isDragging: boolean;
  setRotation: (fn: (prev: { x: number; y: number }) => { x: number; y: number }) => void;
  rotationSpeed?: number;
}

export const AutoRotationManager: React.FC<AutoRotationManagerProps> = ({
  autoRotate,
  isDragging,
  setRotation,
  rotationSpeed = 0.3
}) => {
  const animationRef = useRef<number>();

  useEffect(() => {
    if (autoRotate && !isDragging) {
      console.log('🎯 Starting auto-rotation');
      
      const animate = () => {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + rotationSpeed
        }));
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        console.log('🎯 Stopping auto-rotation');
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging, setRotation, rotationSpeed]);

  return null;
};
