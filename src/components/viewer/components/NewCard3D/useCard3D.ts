
import { useState, useCallback } from 'react';
import type { Card3DState } from './types';

export const useCard3D = () => {
  const [state, setState] = useState<Card3DState>({
    isFlipped: false,
    isHovering: false,
    mousePosition: { x: 0.5, y: 0.5 },
    rotation: { x: 0, y: 0 }
  });

  const handleFlip = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFlipped: !prev.isFlipped
    }));
  }, []);

  const handleMouseEnter = useCallback(() => {
    setState(prev => ({ ...prev, isHovering: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({
      ...prev,
      isHovering: false,
      rotation: { x: 0, y: 0 },
      mousePosition: { x: 0.5, y: 0.5 }
    }));
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    const rotationX = (y - 0.5) * 15; // -7.5 to 7.5 degrees
    const rotationY = (x - 0.5) * 15; // -7.5 to 7.5 degrees
    
    setState(prev => ({
      ...prev,
      mousePosition: { x, y },
      rotation: { x: rotationX, y: rotationY }
    }));
  }, []);

  return {
    state,
    actions: {
      handleFlip,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseMove
    }
  };
};
