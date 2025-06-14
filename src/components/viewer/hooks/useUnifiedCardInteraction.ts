
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseUnifiedCardInteractionProps {
  allowRotation: boolean;
  autoRotate: boolean;
  interactiveLighting?: boolean;
}

export const useUnifiedCardInteraction = ({
  allowRotation,
  autoRotate,
  interactiveLighting = false
}: UseUnifiedCardInteractionProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  
  const animationRef = useRef<number>();

  // Throttled mouse position update
  const throttleRef = useRef<NodeJS.Timeout>();
  
  const updateMousePosition = useCallback((x: number, y: number) => {
    if (throttleRef.current) clearTimeout(throttleRef.current);
    throttleRef.current = setTimeout(() => {
      setMousePosition({ x, y });
    }, 16); // ~60fps
  }, []);

  // Unified mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!allowRotation) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, [allowRotation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    updateMousePosition(x, y);

    if (isDragging && allowRotation) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setRotation(prev => ({
        x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
        y: prev.y + deltaX * 0.5
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, allowRotation, updateMousePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsDragging(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setMousePosition({ x: 0.5, y: 0.5 });
  }, []);

  // Auto-rotation effect
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
  }, [autoRotate, isDragging]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (throttleRef.current) clearTimeout(throttleRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return {
    mousePosition,
    isHovering,
    rotation,
    isDragging,
    zoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleZoom,
    handleReset
  };
};
