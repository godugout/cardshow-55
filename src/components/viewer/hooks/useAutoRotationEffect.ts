
import { useEffect, useRef } from 'react';

interface UseAutoRotationEffectProps {
  autoRotate: boolean;
  isDragging: boolean;
  setRotation: (rotation: { x: number; y: number }) => void;
}

export const useAutoRotationEffect = ({
  autoRotate,
  isDragging,
  setRotation
}: UseAutoRotationEffectProps) => {
  const animationRef = useRef<number>();

  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        setRotation(prev => ({
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: prev.y + 0.5
        }));
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

  return animationRef;
};
