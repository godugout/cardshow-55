

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

  // Use the enhanced advanced physics system
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

  // Combine refs for compatibility
  useEffect(() => {
    if (physicsContainerRef.current) {
      containerRef.current = physicsContainerRef.current;
    }
  }, [physicsContainerRef]);

  // Enhanced mouse handling with improved 360° sensitivity
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // Use enhanced physics mouse movement with improved sensitivity
    physicsMouseMove(e);

    // Update rotation indicator during dragging with enhanced feedback
    if (isDragging) {
      setRotationIndicator({
        show: true,
        angle: rotation.y % 360
      });
    }
  }, [setMousePosition, physicsMouseMove, isDragging, rotation.y]);

  // Enhanced wheel handling with better momentum
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.12 : 0.12; // Slightly more responsive zoom
    handleZoom(zoomDelta);
  }, [handleZoom]);

  // Enhanced drag start with improved sensitivity preparation
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      console.log('🎯 Starting enhanced 360° physics with improved sensitivity and smart click detection');
      
      // Use enhanced physics drag start
      physicsDragStart(e);
      
      // Legacy compatibility for existing code
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      
      // Show enhanced rotation indicator
      setRotationIndicator({ show: true, angle: rotation.y % 360 });
    }
  }, [rotation, allowRotation, physicsDragStart, setDragStart]);

  // Enhanced drag end with smart click detection and improved momentum
  const handleDragEnd = useCallback(() => {
    console.log('🎯 Ending enhanced 360° physics with smart click detection and improved momentum');
    
    // Use enhanced physics drag end - handle potential void return
    const dragResult = physicsDragEnd();
    
    // Check if we have a valid result with proper type narrowing
    if (dragResult !== undefined && dragResult !== null && typeof dragResult === 'object' && 'isClick' in dragResult && 'dragDistance' in dragResult) {
      // TypeScript now knows dragResult is a valid object with isClick and dragDistance properties
      if (dragResult.isClick) {
        // Hide immediately for clicks
        setRotationIndicator(prev => ({ ...prev, show: false }));
      } else {
        // Hide after delay for drags to show final rotation
        setTimeout(() => {
          setRotationIndicator(prev => ({ ...prev, show: false }));
        }, 1200);
      }
      return dragResult;
    }
    
    // Fallback - hide after delay if we can't determine click status
    setTimeout(() => {
      setRotationIndicator(prev => ({ ...prev, show: false }));
    }, 1200);
    
    // Return a safe default result
    return { isClick: false, dragDistance: 0 };
  }, [physicsDragEnd]);

  // Enhanced keyboard shortcuts for precise rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!allowRotation || isDragging) return;
      
      const rotationStep = e.shiftKey ? 5 : 15; // Smaller steps with Shift
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setRotation({ ...rotation, y: rotation.y - rotationStep });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setRotation({ ...rotation, y: rotation.y + rotationStep });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setRotation({ ...rotation, x: Math.max(-35, rotation.x - rotationStep) });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setRotation({ ...rotation, x: Math.min(35, rotation.x + rotationStep) });
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation({ x: 0, y: 0 });
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          // Optional flip shortcut - can be handled by parent component
          console.log('🎯 F key pressed - flip shortcut available');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allowRotation, isDragging, rotation, setRotation]);

  // Enhanced wheel event handling
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

