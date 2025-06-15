
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
  const initialDragPosition = useRef<{ x: number; y: number } | null>(null);
  const DRAG_THRESHOLD = 5; // pixels

  // Safe zone detection
  const { isInSafeZone } = useSafeZones({
    panelWidth: 320,
    showPanel: showCustomizePanel,
    showStats,
    hasNavigation: hasMultipleCards
  });

  // Enhanced mouse handling with increased rotation sensitivity for 360° rotation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Do not run hover effect if mouse is down for a potential drag
    if (!containerRef.current || initialDragPosition.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (!isDragging && !inSafeZone) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      const isInControlsArea = e.clientX - rect.left < 300 && e.clientY - rect.top > rect.height - 100;
      setIsHoveringControls(isInControlsArea);
      
      if (allowRotation && !autoRotate) {
        // Increased sensitivity for full 360° rotation
        setRotation({
          x: (y - 0.5) * 40, // Increased from 20 to 40 for more responsive X rotation
          y: (x - 0.5) * -180 // Increased from -20 to -180 for full Y rotation range
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate, isInSafeZone, setMousePosition, setIsHoveringControls, setRotation]);

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
      initialDragPosition.current = { x: e.clientX, y: e.clientY };
      // Adjusted drag start calculation for increased sensitivity
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation, isInSafeZone, setDragStart, setAutoRotate]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (allowRotation && initialDragPosition.current) {
      if (isDragging) {
        // Already dragging, just update rotation
        const newRotationY = e.clientX - dragStart.x;
        const newRotationX = e.clientY - dragStart.y;
        
        setRotation({
          x: Math.max(-90, Math.min(90, newRotationX)), // Limit X rotation to prevent flipping
          y: newRotationY // Allow full 360° Y rotation
        });
      } else {
        // Not dragging yet, check threshold
        const dx = e.clientX - initialDragPosition.current.x;
        const dy = e.clientY - initialDragPosition.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          setIsDragging(true);
        }
      }
    }
  }, [isDragging, dragStart, allowRotation, setRotation, setIsDragging]);

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
    initialDragPosition.current = null;
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
