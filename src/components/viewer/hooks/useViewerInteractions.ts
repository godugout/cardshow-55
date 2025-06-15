
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeZones } from './useSafeZones';

interface UseViewerInteractionsProps {
  allowRotation: boolean;
  autoRotate: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (start: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  setRotation: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
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
  const lastDragPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const DRAG_THRESHOLD = 5; // pixels
  const [isMomentumActive, setIsMomentumActive] = useState(false);
  const restingRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Safe zone detection
  const { isInSafeZone } = useSafeZones({
    panelWidth: 320,
    showPanel: showCustomizePanel,
    showStats,
    hasNavigation: hasMultipleCards
  });

  // Minimal hover effect - only update mouse position for lighting effects
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
      
      // Removed hover rotation effect - only track mouse position for lighting
      // Card rotation is now only controlled by dragging or auto-rotate
    }
  }, [isDragging, isInSafeZone, setMousePosition, setIsHoveringControls, isMomentumActive]);

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
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (allowRotation && !inSafeZone) {
      initialDragPosition.current = { x: e.clientX, y: e.clientY };
      // Enhanced sensitivity for more responsive dragging
      setDragStart({ x: e.clientX - rotation.y * 2, y: e.clientY - rotation.x * 2 });
      lastDragPositionRef.current = { x: e.clientX, y: e.clientY };
      setAutoRotate(false);
    }
  }, [rotation, allowRotation, isInSafeZone, setDragStart, setAutoRotate]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (allowRotation && initialDragPosition.current) {
      if (isDragging) {
        // Enhanced drag sensitivity for better control
        const newRotationY = (e.clientX - dragStart.x) * 0.8;
        const newRotationX = (e.clientY - dragStart.y) * 0.8;
        
        const newRotation = {
          x: newRotationX,
          y: newRotationY
        };
        setRotation(newRotation);
        restingRotationRef.current = newRotation;

        // Calculate velocity for momentum
        velocityRef.current = {
          x: (e.clientX - lastDragPositionRef.current.x) * 0.8,
          y: (e.clientY - lastDragPositionRef.current.y) * 0.8
        };
        lastDragPositionRef.current = { x: e.clientX, y: e.clientY };

      } else {
        // Check threshold to start dragging
        const dx = e.clientX - initialDragPosition.current.x;
        const dy = e.clientY - initialDragPosition.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          setIsDragging(true);
          lastDragPositionRef.current = { x: e.clientX, y: e.clientY };
        }
      }
    }
  }, [isDragging, dragStart, allowRotation, setRotation, setIsDragging]);

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      const hasMomentum = Math.abs(velocityRef.current.x) > 0.5 || Math.abs(velocityRef.current.y) > 0.5;

      if (!autoRotate && hasMomentum) {
        setIsMomentumActive(true);
        const animateMomentum = () => {
          if (Math.abs(velocityRef.current.x) < 0.1 && Math.abs(velocityRef.current.y) < 0.1) {
            setIsMomentumActive(false);
            return;
          }

          setRotation(prev => {
            const newRotation = {
              x: prev.x + velocityRef.current.y,
              y: prev.y + velocityRef.current.x,
            };
            restingRotationRef.current = newRotation;
            return newRotation;
          });

          velocityRef.current.x *= 0.92; // Slightly less damping for better momentum
          velocityRef.current.y *= 0.92;

          animationFrameRef.current = requestAnimationFrame(animateMomentum);
        };
        animateMomentum();
      }
    }
    initialDragPosition.current = null;
  }, [isDragging, setIsDragging, autoRotate, setRotation]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    // Stop momentum if auto-rotate is toggled on
    if (autoRotate && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      setIsMomentumActive(false);
    }
  }, [autoRotate]);

  useEffect(() => {
    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    isMomentumActive,
  };
};
