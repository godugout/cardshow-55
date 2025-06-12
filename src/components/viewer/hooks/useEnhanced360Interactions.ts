
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAdvancedPhysicsCardInteraction } from './useAdvancedPhysicsCardInteraction';

interface UseEnhanced360InteractionsProps {
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
  effectIntensity?: number;
}

export const useEnhanced360Interactions = ({
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
  handleZoom,
  effectIntensity = 0
}: UseEnhanced360InteractionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gripPoint, setGripPoint] = useState<{ x: number; y: number } | null>(null);
  const [rotationIndicator, setRotationIndicator] = useState<{ show: boolean; angle: number }>({ 
    show: false, 
    angle: 0 
  });

  // Use the advanced physics system
  const {
    containerRef: physicsContainerRef,
    physicsState,
    handleMouseMove: physicsMouseMove,
    handleDragStart: physicsDragStart,
    handleDragEnd: physicsDragEnd
  } = useAdvancedPhysicsCardInteraction({
    allowRotation,
    isDragging,
    setIsDragging,
    setRotation,
    setAutoRotate,
    rotation,
    onGripPointChange: setGripPoint,
    effectIntensity
  });

  // Combine refs
  useEffect(() => {
    if (physicsContainerRef.current) {
      containerRef.current = physicsContainerRef.current;
    }
  }, [physicsContainerRef]);

  // Enhanced mouse handling with 360° capabilities
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // Use advanced physics mouse movement
    physicsMouseMove(e);

    // Update rotation indicator during dragging
    if (isDragging) {
      setRotationIndicator({
        show: true,
        angle: rotation.y % 360
      });
    }
  }, [setMousePosition, physicsMouseMove, isDragging, rotation.y]);

  // Enhanced wheel handling with momentum
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(zoomDelta);
  }, [handleZoom]);

  // Enhanced drag start with 360° support
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      console.log('🎯 Starting enhanced 360° physics-based drag');
      
      // Use advanced physics drag start
      physicsDragStart(e);
      
      // Legacy compatibility
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      
      // Show rotation indicator
      setRotationIndicator({ show: true, angle: rotation.y % 360 });
    }
  }, [rotation, allowRotation, physicsDragStart, setDragStart]);

  // Enhanced drag end with momentum and indicator management
  const handleDragEnd = useCallback(() => {
    console.log('🎯 Ending 360° physics-based drag with advanced momentum');
    
    // Use advanced physics drag end
    physicsDragEnd();
    
    // Hide rotation indicator after a delay
    setTimeout(() => {
      setRotationIndicator(prev => ({ ...prev, show: false }));
    }, 1000);
  }, [physicsDragEnd]);

  // Keyboard shortcuts for precise rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!allowRotation || isDragging) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setRotation({ ...rotation, y: rotation.y - 15 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setRotation({ ...rotation, y: rotation.y + 15 });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setRotation({ ...rotation, x: Math.max(-90, rotation.x - 15) });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setRotation({ ...rotation, x: Math.min(90, rotation.x + 15) });
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation({ x: 0, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allowRotation, isDragging, rotation, setRotation]);

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
    physicsState,
    rotationIndicator
  };
};
