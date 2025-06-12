
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

  // Enhanced mouse handling with safe zones - but avoid conflicts with card interactions
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    // Only handle viewer-level interactions if not over the card area and not in safe zones
    const cardAreaX = rect.left + (rect.width / 2) - 150; // Card area bounds
    const cardAreaY = rect.top + (rect.height / 2) - 200;
    const cardAreaWidth = 300;
    const cardAreaHeight = 400;
    
    const isOverCard = e.clientX >= cardAreaX && e.clientX <= cardAreaX + cardAreaWidth &&
                      e.clientY >= cardAreaY && e.clientY <= cardAreaY + cardAreaHeight;
    
    if (!isDragging && !inSafeZone && !isOverCard) {
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

  // Enhanced wheel handling for safe zones - but allow card interactions
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    // Only handle zoom if not in safe zones and not over card
    const cardAreaX = rect.left + (rect.width / 2) - 150;
    const cardAreaY = rect.top + (rect.height / 2) - 200;
    const cardAreaWidth = 300;
    const cardAreaHeight = 400;
    
    const isOverCard = e.clientX >= cardAreaX && e.clientX <= cardAreaX + cardAreaWidth &&
                      e.clientY >= cardAreaY && e.clientY <= cardAreaY + cardAreaHeight;
    
    if (!inSafeZone && !isOverCard) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(zoomDelta);
    }
  }, [isInSafeZone, handleZoom]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    // Only start viewer-level dragging if not in safe zones and not over card
    const cardAreaX = rect.left + (rect.width / 2) - 150;
    const cardAreaY = rect.top + (rect.height / 2) - 200;
    const cardAreaWidth = 300;
    const cardAreaHeight = 400;
    
    const isOverCard = e.clientX >= cardAreaX && e.clientX <= cardAreaX + cardAreaWidth &&
                      e.clientY >= cardAreaY && e.clientY <= cardAreaY + cardAreaHeight;
    
    if (allowRotation && !inSafeZone && !isOverCard) {
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
