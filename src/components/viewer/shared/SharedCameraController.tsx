import React, { useCallback, useRef } from 'react';
import type { EnvironmentControls } from '../types';

interface SharedCameraControllerProps {
  allowRotation: boolean;
  autoRotate: boolean;
  mousePosition: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
  onCameraUpdate: (position: { x: number; y: number; z: number }, rotation: { x: number; y: number }) => void;
  environmentControls: EnvironmentControls;
  immersive360Mode?: boolean;
}

export const SharedCameraController: React.FC<SharedCameraControllerProps> = ({
  allowRotation,
  autoRotate,
  mousePosition,
  containerRef,
  onCameraUpdate,
  environmentControls,
  immersive360Mode = false
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [cameraRotation, setCameraRotation] = React.useState({ x: 0, y: 0 });
  const [cameraPosition, setCameraPosition] = React.useState({ x: 0, y: 0, z: 8 });
  const momentumRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef({ x: 0, y: 0, time: 0 });

  // Enhanced camera controls for 360° experience
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!allowRotation) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    lastMoveRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  }, [allowRotation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !allowRotation) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Calculate momentum for smoother interactions
    const now = Date.now();
    const timeDelta = now - lastMoveRef.current.time;
    if (timeDelta > 0) {
      momentumRef.current.x = (e.clientX - lastMoveRef.current.x) / timeDelta;
      momentumRef.current.y = (e.clientY - lastMoveRef.current.y) / timeDelta;
    }
    lastMoveRef.current = { x: e.clientX, y: e.clientY, time: now };

    // Enhanced rotation sensitivity for 360° mode
    const sensitivity = immersive360Mode ? 0.8 : 0.5;
    const newRotation = {
      x: Math.max(-85, Math.min(85, deltaY * sensitivity * -1)),
      y: deltaX * sensitivity
    };

    setCameraRotation(newRotation);
    onCameraUpdate(cameraPosition, newRotation);
  }, [isDragging, dragStart, allowRotation, cameraPosition, onCameraUpdate, immersive360Mode]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Apply momentum for natural feel
    if (Math.abs(momentumRef.current.x) > 0.1 || Math.abs(momentumRef.current.y) > 0.1) {
      let currentRotation = { ...cameraRotation };
      const applyMomentum = () => {
        momentumRef.current.x *= 0.95;
        momentumRef.current.y *= 0.95;
        
        currentRotation.x += momentumRef.current.y * -10;
        currentRotation.y += momentumRef.current.x * 10;
        
        // Clamp rotation
        currentRotation.x = Math.max(-85, Math.min(85, currentRotation.x));
        
        setCameraRotation(currentRotation);
        onCameraUpdate(cameraPosition, currentRotation);
        
        if (Math.abs(momentumRef.current.x) > 0.01 || Math.abs(momentumRef.current.y) > 0.01) {
          requestAnimationFrame(applyMomentum);
        }
      };
      requestAnimationFrame(applyMomentum);
    }
  }, [isDragging, cameraRotation, cameraPosition, onCameraUpdate]);

  // Scroll-based zoom for depth navigation
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const zoomSensitivity = immersive360Mode ? 0.002 : 0.001;
    const deltaZ = e.deltaY * zoomSensitivity;
    
    const newPosition = {
      ...cameraPosition,
      z: Math.max(2, Math.min(20, cameraPosition.z + deltaZ))
    };
    
    setCameraPosition(newPosition);
    onCameraUpdate(newPosition, cameraRotation);
  }, [cameraPosition, cameraRotation, onCameraUpdate, immersive360Mode]);

  // Auto-rotation for cinematic experience
  React.useEffect(() => {
    if (!autoRotate || isDragging) return;

    let animationId: number;
    const animate = () => {
      setCameraRotation(prev => ({
        x: Math.sin(Date.now() * 0.0003) * 5,
        y: prev.y + 0.1
      }));
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [autoRotate, isDragging]);

  // Keyboard controls for fine navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!allowRotation) return;
      
      const step = 5;
      const zoomStep = 0.5;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setCameraRotation(prev => ({ ...prev, y: prev.y - step }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCameraRotation(prev => ({ ...prev, y: prev.y + step }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setCameraRotation(prev => ({ ...prev, x: Math.max(-85, prev.x - step) }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setCameraRotation(prev => ({ ...prev, x: Math.min(85, prev.x + step) }));
          break;
        case '=':
        case '+':
          e.preventDefault();
          setCameraPosition(prev => ({ ...prev, z: Math.max(2, prev.z - zoomStep) }));
          break;
        case '-':
          e.preventDefault();
          setCameraPosition(prev => ({ ...prev, z: Math.min(20, prev.z + zoomStep) }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allowRotation]);

  // Wheel event listener
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel, containerRef]);

  // Global mouse event listeners for drag
  React.useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e as any);
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="absolute inset-0 z-40"
      style={{ cursor: isDragging ? 'grabbing' : (allowRotation ? 'grab' : 'default') }}
      onMouseDown={handleMouseDown}
    />
  );
};