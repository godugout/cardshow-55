
import { useState, useCallback, useRef } from 'react';
import type { EnhancedGestureCallbacks } from './types';

export const useMouseGestures = (callbacks: EnhancedGestureCallbacks) => {
  const [mouseState, setMouseState] = useState({
    isDown: false,
    startPosition: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
    startTime: 0,
    dragStarted: false
  });

  const lastClickTime = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const dragThreshold = 5; // pixels

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Right click for long press simulation
    if (e.button === 2) {
      e.preventDefault();
      longPressTimer.current = setTimeout(() => {
        callbacks.onLongPress();
      }, 500);
      return;
    }

    // Only handle left clicks
    if (e.button !== 0) return;

    const now = Date.now();
    const position = { x: e.clientX, y: e.clientY };

    setMouseState({
      isDown: true,
      startPosition: position,
      lastPosition: position,
      startTime: now,
      dragStarted: false
    });

    // Handle Ctrl + Alt + Click for three finger tap
    if (e.ctrlKey && e.altKey) {
      e.preventDefault();
      callbacks.onThreeFingerTap();
      return;
    }
  }, [callbacks]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mouseState.isDown) return;

    const currentPosition = { x: e.clientX, y: e.clientY };
    const deltaX = currentPosition.x - mouseState.lastPosition.x;
    const deltaY = currentPosition.y - mouseState.lastPosition.y;
    const totalDistance = Math.sqrt(
      Math.pow(currentPosition.x - mouseState.startPosition.x, 2) +
      Math.pow(currentPosition.y - mouseState.startPosition.y, 2)
    );

    // Start drag if moved beyond threshold
    if (!mouseState.dragStarted && totalDistance > dragThreshold) {
      setMouseState(prev => ({ ...prev, dragStarted: true }));
    }

    if (mouseState.dragStarted) {
      // Shift + drag for rotation/pan
      if (e.shiftKey) {
        // Horizontal movement for rotation
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          callbacks.onRotate(deltaX * 0.5);
        } else {
          // Vertical movement for pan
          callbacks.onPan({ x: deltaX, y: deltaY }, { x: deltaX * 0.1, y: deltaY * 0.1 });
        }
      } else {
        // Regular pan
        callbacks.onPan({ x: deltaX, y: deltaY }, { x: deltaX * 0.1, y: deltaY * 0.1 });
      }
    }

    setMouseState(prev => ({
      ...prev,
      lastPosition: currentPosition
    }));
  }, [mouseState, callbacks]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Right click - don't process as tap
    if (e.button === 2) {
      return;
    }

    if (!mouseState.isDown) return;

    const now = Date.now();
    const duration = now - mouseState.startTime;
    const currentPosition = { x: e.clientX, y: e.clientY };
    
    // Check for swipe (Alt + horizontal drag)
    if (e.altKey && mouseState.dragStarted) {
      const deltaX = currentPosition.x - mouseState.startPosition.x;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          callbacks.onSwipeRight();
        } else {
          callbacks.onSwipeLeft();
        }
      }
    }
    // Handle taps only if not dragged
    else if (!mouseState.dragStarted && duration < 300) {
      const timeSinceLastClick = now - lastClickTime.current;
      
      if (timeSinceLastClick < 300) {
        // Double tap
        callbacks.onDoubleTap();
        lastClickTime.current = 0;
      } else {
        // Single tap (with delay to detect double tap)
        setTimeout(() => {
          if (now === lastClickTime.current) {
            callbacks.onTap();
          }
        }, 300);
        lastClickTime.current = now;
      }
    }

    setMouseState({
      isDown: false,
      startPosition: { x: 0, y: 0 },
      lastPosition: { x: 0, y: 0 },
      startTime: 0,
      dragStarted: false
    });
  }, [mouseState, callbacks]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Ctrl + scroll for zoom
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1; // Scale factor
      const center = { x: e.clientX, y: e.clientY };
      callbacks.onPinchZoom(delta, center);
    }
  }, [callbacks]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Prevent right-click context menu
    e.preventDefault();
  }, []);

  return {
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onWheel: handleWheel,
      onContextMenu: handleContextMenu,
    },
    isActive: mouseState.dragStarted
  };
};
