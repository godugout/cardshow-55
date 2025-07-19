import React, { useRef, useCallback, useState } from 'react';
import { useThree } from '@react-three/fiber';

interface DragUpGestureProps {
  onDragUpTrigger: () => void;
  minDragDistance?: number;
  children: React.ReactNode;
}

interface DragState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  hasTriggered: boolean;
}

export const DragUpGesture: React.FC<DragUpGestureProps> = ({
  onDragUpTrigger,
  minDragDistance = 100, // pixels
  children
}) => {
  const { gl } = useThree();
  const dragState = useRef<DragState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    hasTriggered: false
  });

  const [isGestureActive, setIsGestureActive] = useState(false);

  const handlePointerDown = useCallback((event: any) => {
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
    
    dragState.current = {
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      isDragging: true,
      hasTriggered: false
    };
    setIsGestureActive(true);
    
    // Prevent default to handle touch events properly
    event.preventDefault();
  }, []);

  const handlePointerMove = useCallback((event: any) => {
    if (!dragState.current.isDragging) return;

    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
    
    dragState.current.currentX = clientX;
    dragState.current.currentY = clientY;

    // Calculate drag vector
    const deltaX = clientX - dragState.current.startX;
    const deltaY = clientY - dragState.current.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Check if drag is primarily upward and meets minimum distance
    const isUpwardDrag = deltaY < -minDragDistance * 0.5; // Negative Y is up
    const isMinDistance = distance >= minDragDistance;
    const isPrimarilyVertical = Math.abs(deltaY) > Math.abs(deltaX) * 0.7; // 70% vertical bias
    
    // Trigger alignment animation if conditions are met
    if (isUpwardDrag && isMinDistance && isPrimarilyVertical && !dragState.current.hasTriggered) {
      console.log('🚀 Drag-up gesture detected! Triggering alignment animation...');
      dragState.current.hasTriggered = true;
      onDragUpTrigger();
      
      // Give visual feedback
      gl.domElement.style.cursor = 'grab';
    }
    
    event.preventDefault();
  }, [minDragDistance, onDragUpTrigger, gl.domElement]);

  const handlePointerUp = useCallback((event: any) => {
    dragState.current.isDragging = false;
    setIsGestureActive(false);
    gl.domElement.style.cursor = 'grab';
    
    event.preventDefault();
  }, [gl.domElement]);

  // Add global event listeners for mouse/touch tracking
  React.useEffect(() => {
    const element = gl.domElement;
    
    // Touch events
    element.addEventListener('touchstart', handlePointerDown, { passive: false });
    element.addEventListener('touchmove', handlePointerMove, { passive: false });
    element.addEventListener('touchend', handlePointerUp, { passive: false });
    
    // Mouse events
    element.addEventListener('mousedown', handlePointerDown);
    element.addEventListener('mousemove', handlePointerMove);
    element.addEventListener('mouseup', handlePointerUp);
    
    return () => {
      element.removeEventListener('touchstart', handlePointerDown);
      element.removeEventListener('touchmove', handlePointerMove);
      element.removeEventListener('touchend', handlePointerUp);
      element.removeEventListener('mousedown', handlePointerDown);
      element.removeEventListener('mousemove', handlePointerMove);
      element.removeEventListener('mouseup', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, gl.domElement]);

  return <>{children}</>;
};