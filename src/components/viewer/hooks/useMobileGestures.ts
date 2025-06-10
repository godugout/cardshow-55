
import { useCallback, useRef, useState } from 'react';

interface GestureState {
  isTracking: boolean;
  startTime: number;
  startPosition: { x: number; y: number };
  lastTapTime: number;
  touchCount: number;
}

interface GestureCallbacks {
  onSingleTap?: (position: { x: number; y: number }) => void;
  onDoubleTap?: (position: { x: number; y: number }) => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onRotateGesture?: (angle: number, center: { x: number; y: number }) => void;
}

export const useMobileGestures = (callbacks: GestureCallbacks = {}) => {
  const gestureStateRef = useRef<GestureState>({
    isTracking: false,
    startTime: 0,
    startPosition: { x: 0, y: 0 },
    lastTapTime: 0,
    touchCount: 0
  });

  const [isGestureActive, setIsGestureActive] = useState(false);
  const pinchDistanceRef = useRef<number>(0);
  const rotationAngleRef = useRef<number>(0);

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate angle between two touch points
  const getTouchAngle = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.atan2(dy, dx);
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    const state = gestureStateRef.current;
    const touches = event.touches;
    
    state.touchCount = touches.length;
    state.isTracking = true;
    state.startTime = Date.now();
    
    if (touches.length === 1) {
      // Single touch - potential tap or swipe
      state.startPosition = {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
      setIsGestureActive(true);
    } else if (touches.length === 2) {
      // Two touches - potential pinch or rotate
      pinchDistanceRef.current = getTouchDistance(touches[0], touches[1]);
      rotationAngleRef.current = getTouchAngle(touches[0], touches[1]);
      setIsGestureActive(true);
    }
  }, [getTouchDistance, getTouchAngle]);

  // Handle touch move
  const handleTouchMove = useCallback((event: TouchEvent) => {
    const state = gestureStateRef.current;
    const touches = event.touches;
    
    if (!state.isTracking) return;
    
    if (touches.length === 2 && pinchDistanceRef.current > 0) {
      // Handle pinch and rotation gestures
      const currentDistance = getTouchDistance(touches[0], touches[1]);
      const currentAngle = getTouchAngle(touches[0], touches[1]);
      
      // Pinch gesture
      const scale = currentDistance / pinchDistanceRef.current;
      const center = {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2
      };
      
      if (Math.abs(scale - 1) > 0.1 && callbacks.onPinch) {
        callbacks.onPinch(scale, center);
      }
      
      // Rotation gesture
      const angleDiff = currentAngle - rotationAngleRef.current;
      if (Math.abs(angleDiff) > 0.1 && callbacks.onRotateGesture) {
        callbacks.onRotateGesture(angleDiff, center);
        rotationAngleRef.current = currentAngle;
      }
    }
  }, [getTouchDistance, getTouchAngle, callbacks]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    const state = gestureStateRef.current;
    
    if (!state.isTracking) return;
    
    const endTime = Date.now();
    const duration = endTime - state.startTime;
    const touches = event.changedTouches;
    
    if (state.touchCount === 1 && touches.length === 1) {
      const endPosition = {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
      
      const deltaX = endPosition.x - state.startPosition.x;
      const deltaY = endPosition.y - state.startPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < 10 && duration < 300) {
        // Tap gesture
        const timeSinceLastTap = endTime - state.lastTapTime;
        
        if (timeSinceLastTap < 300 && callbacks.onDoubleTap) {
          // Double tap
          callbacks.onDoubleTap(endPosition);
          state.lastTapTime = 0; // Reset to prevent triple tap
        } else {
          // Single tap
          if (callbacks.onSingleTap) {
            callbacks.onSingleTap(endPosition);
          }
          state.lastTapTime = endTime;
        }
      } else if (distance > 50) {
        // Swipe gesture
        const velocity = distance / duration;
        let direction: 'left' | 'right' | 'up' | 'down';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        if (callbacks.onSwipe) {
          callbacks.onSwipe(direction, velocity);
        }
      }
    }
    
    // Reset state
    state.isTracking = false;
    state.touchCount = 0;
    setIsGestureActive(false);
    pinchDistanceRef.current = 0;
    rotationAngleRef.current = 0;
  }, [callbacks]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isGestureActive
  };
};
