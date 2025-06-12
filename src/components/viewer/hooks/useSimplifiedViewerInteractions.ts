
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePhysicsCardInteraction } from './usePhysicsCardInteraction';

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
  const [gripPoint, setGripPoint] = useState<{ x: number; y: number } | null>(null);

  // Use the new physics-based interaction system
  const {
    containerRef: physicsContainerRef,
    physicsState,
    handleMouseMove: physicsMouseMove,
    handleDragStart: physicsDragStart,
    handleDragEnd: physicsDragEnd
  } = usePhysicsCardInteraction({
    allowRotation,
    isDragging,
    setIsDragging,
    setRotation,
    setAutoRotate,
    rotation,
    onGripPointChange: setGripPoint
  });

  // Combine refs
  useEffect(() => {
    if (physicsContainerRef.current) {
      containerRef.current = physicsContainerRef.current;
    }
  }, [physicsContainerRef]);

  // Enhanced mouse handling with physics and grip feedback
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // Use physics-based mouse movement
    physicsMouseMove(e);
  }, [setMousePosition, physicsMouseMove]);

  // Simplified wheel handling with momentum
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(zoomDelta);
  }, [handleZoom]);

  // Enhanced drag start with physics
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      console.log('🎯 Starting enhanced physics-based drag');
      
      // Use physics drag start for enhanced experience
      physicsDragStart(e);
      
      // Legacy compatibility
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
    }
  }, [rotation, allowRotation, physicsDragStart, setDragStart]);

  // Enhanced drag end with momentum
  const handleDragEnd = useCallback(() => {
    console.log('🎯 Ending physics-based drag with momentum');
    
    // Use physics drag end for momentum
    physicsDragEnd();
  }, [physicsDragEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return {
    containerRef: physicsContainerRef,
    handleMouseMove,
    handleDragStart,
    handleDragEnd,
    gripPoint,
    physicsState
  };
};
