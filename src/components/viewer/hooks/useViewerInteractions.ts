
import { useCallback, useEffect, useRef } from 'react';
import { useSafeZones } from './useSafeZones';

interface UseViewerInteractionsProps {
  allowRotation: boolean;
  autoRotate: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (start: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  setIsHoveringControls: (hovering: boolean) => void;
  rotation: { x: number; y: number };
  dragStart: { x: number; y: number };
  handleZoom: (delta: number) => void;
  showCustomizePanel: boolean;
  showStats: boolean;
  hasMultipleCards: boolean;
}

export const useViewerInteractions = ({
  allowRotation,
  autoRotate,
  isDragging,
  setIsDragging,
  setDragStart,
  setAutoRotate,
  setRotation,
  setMousePosition,
  setIsHoveringControls,
  rotation,
  dragStart,
  handleZoom,
  showCustomizePanel,
  showStats,
  hasMultipleCards
}: UseViewerInteractionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Safe zone detection
  const { isInSafeZone } = useSafeZones({
    panelWidth: 320,
    showPanel: showCustomizePanel,
    showStats,
    hasNavigation: hasMultipleCards
  });

  // Enhanced mouse handling with increased rotation sensitivity for 360° rotation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
    
    const isInControlsArea = e.clientX - rect.left < 300 && e.clientY - rect.top > rect.height - 100;
    setIsHoveringControls(isInControlsArea);
    
    if (isDragging && allowRotation) {
      // Enhanced drag rotation with continuous 360° support
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setRotation({
        x: Math.max(-90, Math.min(90, deltaY * 0.5)), // Limit X rotation to prevent flipping
        y: deltaX * 0.8 // Allow full 360° Y rotation with smooth movement
      });
    } else if (!isDragging && !inSafeZone && allowRotation && !autoRotate) {
      // Passive rotation on hover
      setRotation({
        x: (y - 0.5) * 30,
        y: (x - 0.5) * -60
      });
    }
  }, [isDragging, allowRotation, autoRotate, isInSafeZone, setMousePosition, setIsHoveringControls, setRotation, dragStart]);

  // Enhanced wheel handling for safe zones
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (!inSafeZone) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(zoomDelta);
    }
  }, [isInSafeZone, handleZoom]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (allowRotation && !inSafeZone) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setAutoRotate(false);
      console.log('🎯 Drag started at:', e.clientX, e.clientY);
    }
  }, [allowRotation, isInSafeZone, setIsDragging, setDragStart, setAutoRotate]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    // This is handled in handleMouseMove now for better performance
  }, []);

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      console.log('🎯 Drag ended');
    }
  }, [isDragging, setIsDragging]);

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
    handleDrag,
    handleDragEnd
  };
};
