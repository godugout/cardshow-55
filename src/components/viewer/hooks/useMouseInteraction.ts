
import { useCallback, useRef } from 'react';

interface UseMouseInteractionProps {
  rotation: { x: number; y: number };
  setRotation: (rotation: { x: number; y: number }) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  dragStart: { x: number; y: number };
  setDragStart: (start: { x: number; y: number }) => void;
  setAutoRotate: (autoRotate: boolean) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  setIsHoveringControls: (hovering: boolean) => void;
  allowRotation: boolean;
  autoRotate: boolean;
  isInSafeZone: (x: number, y: number, rect: DOMRect) => boolean;
}

export const useMouseInteraction = ({
  rotation,
  setRotation,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  setAutoRotate,
  setMousePosition,
  setIsHoveringControls,
  allowRotation,
  autoRotate,
  isInSafeZone
}: UseMouseInteractionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (!isDragging && !inSafeZone) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      const isInControlsArea = e.clientX - rect.left < 300 && e.clientY - rect.top > rect.height - 100;
      setIsHoveringControls(isInControlsArea);
      
      if (allowRotation && !autoRotate) {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * -20
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate, isInSafeZone, setMousePosition, setIsHoveringControls, setRotation]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (allowRotation && !inSafeZone) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation, isInSafeZone, setIsDragging, setDragStart, setAutoRotate]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && allowRotation) {
      setRotation({
        x: e.clientY - dragStart.y,
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, dragStart, allowRotation, setRotation]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  return {
    containerRef,
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd
  };
};
