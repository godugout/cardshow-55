
import { useCallback, useEffect, useRef } from 'react';

interface UseSimplifiedViewerInteractionsProps {
  allowRotation: boolean;
  autoRotate: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (start: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  rotation: { x: number; y: number };
  dragStart: { x: number; y: number };
  handleZoom: (delta: number) => void;
}

export const useSimplifiedViewerInteractions = ({
  allowRotation,
  autoRotate,
  isDragging,
  setIsDragging,
  setDragStart,
  setAutoRotate,
  setRotation,
  setMousePosition,
  rotation,
  dragStart,
  handleZoom
}: UseSimplifiedViewerInteractionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Simplified mouse handling - no safe zones
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // Handle dragging for rotation
    if (isDragging && allowRotation) {
      setRotation({
        x: Math.max(-90, Math.min(90, dragStart.y - e.clientY)), // FIXED: Inverted Y-axis for natural movement
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, allowRotation, dragStart, setMousePosition, setRotation]);

  // Simplified wheel handling
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(zoomDelta);
  }, [handleZoom]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      console.log('🎯 Starting drag for rotation');
      setIsDragging(true);
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation, setIsDragging, setDragStart, setAutoRotate]);

  const handleDragEnd = useCallback(() => {
    console.log('🎯 Ending drag');
    setIsDragging(false);
  }, [setIsDragging]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return {
    containerRef,
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  };
};
