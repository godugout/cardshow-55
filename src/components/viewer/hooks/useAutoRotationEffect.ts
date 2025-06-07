
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
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        const newRotation = {
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: rotationRef.current.y + 0.5
        };
        rotationRef.current = newRotation;
        setRotation(newRotation);
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
