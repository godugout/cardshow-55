
import { useCallback, useRef, useState } from 'react';

interface TouchGesture {
  type: 'tap' | 'doubleTap' | 'longPress' | 'swipeLeft' | 'swipeRight' | 'swipeUp' | 'pinch' | 'twoFingerTap';
  data?: any;
}

interface TouchOptions {
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onPinch?: (scale: number) => void;
  onTwoFingerTap?: () => void;
  enableHaptic?: boolean;
}

export const useAdvancedTouch = (options: TouchOptions) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const touchStartTime = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTap = useRef<number>(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const initialDistance = useRef<number>(0);

  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (options.enableHaptic && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, [options.enableHaptic]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartTime.current = Date.now();
    touchStart.current = { x: touch.clientX, y: touch.clientY };

    // Handle two finger tap
    if (e.touches.length === 2) {
      options.onTwoFingerTap?.();
      triggerHaptic('medium');
      return;
    }

    // Handle pinch start
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance.current = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    }

    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      options.onLongPress?.();
      triggerHaptic('heavy');
    }, 500);
  }, [options, triggerHaptic]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Handle pinch
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (initialDistance.current > 0) {
        const scale = currentDistance / initialDistance.current;
        options.onPinch?.(scale);
      }
    }

    // Cancel long press if moved too far
    if (touchStart.current && e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStart.current.x);
      const deltaY = Math.abs(touch.clientY - touchStart.current.y);
      
      if (deltaX > 10 || deltaY > 10) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
      }
    }
  }, [options]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime.current;

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (isLongPressing) {
      setIsLongPressing(false);
      return;
    }

    // Handle swipes
    if (touchStart.current && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > 50 || absDeltaY > 50) {
        if (absDeltaX > absDeltaY) {
          if (deltaX > 0) {
            options.onSwipeRight?.();
            triggerHaptic('light');
          } else {
            options.onSwipeLeft?.();
            triggerHaptic('light');
          }
        } else if (deltaY < 0) {
          options.onSwipeUp?.();
          triggerHaptic('light');
        }
        return;
      }
    }

    // Handle taps
    if (touchDuration < 200) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        // Double tap
        options.onDoubleTap?.();
        triggerHaptic('medium');
        lastTap.current = 0;
      } else {
        // Single tap
        setTimeout(() => {
          if (lastTap.current !== 0) {
            options.onTap?.();
            triggerHaptic('light');
          }
        }, 300);
        lastTap.current = now;
      }
    }

    touchStart.current = null;
    initialDistance.current = 0;
  }, [options, isLongPressing, triggerHaptic]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isLongPressing
  };
};
