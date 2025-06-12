import { useCallback, useRef, useState } from 'react';

interface TouchGestureState {
  isTouch: boolean;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  velocity: { x: number; y: number };
  lastTime: number;
  touchId?: number;
}

interface UseTouchGesturesProps {
  onGestureStart: (position: { x: number; y: number }) => void;
  onGestureMove: (delta: { x: number; y: number }, velocity: { x: number; y: number }) => void;
  onGestureEnd: (velocity: { x: number; y: number }) => void;
  containerRef: React.RefObject<HTMLElement>;
}

export const useTouchGestures = ({
  onGestureStart,
  onGestureMove,
  onGestureEnd,
  containerRef
}: UseTouchGesturesProps) => {
  const [gestureState, setGestureState] = useState<TouchGestureState | null>(null);
  const velocityHistory = useRef<Array<{ x: number; y: number; time: number }>>([]);

  const calculateVelocity = useCallback((currentPos: { x: number; y: number }, currentTime: number) => {
    const history = velocityHistory.current;
    history.push({ ...currentPos, time: currentTime });
    
    // Keep only last 3 samples for velocity calculation
    if (history.length > 3) {
      history.shift();
    }
    
    if (history.length < 2) return { x: 0, y: 0 };
    
    const oldest = history[0];
    const newest = history[history.length - 1];
    const timeDelta = newest.time - oldest.time;
    
    if (timeDelta === 0) return { x: 0, y: 0 };
    
    return {
      x: (newest.x - oldest.x) / timeDelta,
      y: (newest.y - oldest.y) / timeDelta
    };
  }, []);

  const getRelativePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height
    };
  }, [containerRef]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    
    const position = getRelativePosition(touch.clientX, touch.clientY);
    const currentTime = performance.now();
    
    setGestureState({
      isTouch: true,
      startPosition: position,
      currentPosition: position,
      velocity: { x: 0, y: 0 },
      lastTime: currentTime,
      touchId: touch.identifier
    });
    
    velocityHistory.current = [{ ...position, time: currentTime }];
    onGestureStart(position);
  }, [getRelativePosition, onGestureStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!gestureState) return;
    
    const touch = Array.from(e.touches).find(t => t.identifier === gestureState.touchId);
    if (!touch) return;
    
    const currentPosition = getRelativePosition(touch.clientX, touch.clientY);
    const currentTime = performance.now();
    const velocity = calculateVelocity(currentPosition, currentTime);
    
    const delta = {
      x: currentPosition.x - gestureState.currentPosition.x,
      y: currentPosition.y - gestureState.currentPosition.y
    };
    
    setGestureState(prev => prev ? {
      ...prev,
      currentPosition,
      velocity,
      lastTime: currentTime
    } : null);
    
    onGestureMove(delta, velocity);
  }, [gestureState, getRelativePosition, calculateVelocity, onGestureMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!gestureState) return;
    
    const finalVelocity = gestureState.velocity;
    setGestureState(null);
    velocityHistory.current = [];
    
    onGestureEnd(finalVelocity);
  }, [gestureState, onGestureEnd]);

  // Mouse event handlers (enhanced for better sensitivity)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const position = getRelativePosition(e.clientX, e.clientY);
    const currentTime = performance.now();
    
    setGestureState({
      isTouch: false,
      startPosition: position,
      currentPosition: position,
      velocity: { x: 0, y: 0 },
      lastTime: currentTime
    });
    
    velocityHistory.current = [{ ...position, time: currentTime }];
    onGestureStart(position);
  }, [getRelativePosition, onGestureStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gestureState) return;
    
    const currentPosition = getRelativePosition(e.clientX, e.clientY);
    const currentTime = performance.now();
    const velocity = calculateVelocity(currentPosition, currentTime);
    
    const delta = {
      x: currentPosition.x - gestureState.currentPosition.x,
      y: currentPosition.y - gestureState.currentPosition.y
    };
    
    setGestureState(prev => prev ? {
      ...prev,
      currentPosition,
      velocity,
      lastTime: currentTime
    } : null);
    
    onGestureMove(delta, velocity);
  }, [gestureState, getRelativePosition, calculateVelocity, onGestureMove]);

  const handleMouseUp = useCallback(() => {
    if (!gestureState) return;
    
    const finalVelocity = gestureState.velocity;
    setGestureState(null);
    velocityHistory.current = [];
    
    onGestureEnd(finalVelocity);
  }, [gestureState, onGestureEnd]);

  // Wheel event handler for trackpad scrolling
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    // Convert wheel delta to rotation movement
    const delta = {
      x: e.deltaX * 0.01,
      y: e.deltaY * 0.01
    };
    
    const velocity = {
      x: delta.x * 10,
      y: delta.y * 10
    };
    
    onGestureMove(delta, velocity);
  }, [onGestureMove]);

  return {
    gestureState,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp
    },
    wheelHandler: handleWheel
  };
};
