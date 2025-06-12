
import { useRef, useCallback, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import type { SpaceControls } from '../types';

interface UseCard3DInteractionsProps {
  controls: SpaceControls;
  onClick?: () => void;
}

export const useCard3DInteractions = ({ controls, onClick }: UseCard3DInteractionsProps) => {
  const groupRef = useRef<Group>(null);
  
  // Enhanced interaction state
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(controls.autoRotate);
  
  // Enhanced double-click detection with longer timeout
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastClickTime = useRef(0);

  useFrame((state) => {
    if (groupRef.current) {
      // Apply rotation directly to Three.js group - this is the ONLY rotation applied
      groupRef.current.rotation.x = (rotation.x * Math.PI) / 180 * 0.6;
      groupRef.current.rotation.y = (rotation.y * Math.PI) / 180 * 0.6;

      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      groupRef.current.position.y = floatY;

      // Auto rotation (only when not dragging)
      if (autoRotateEnabled && !isDragging) {
        // Slow, natural rotation that will show both sides
        const newRotationY = rotation.y + 0.2 * controls.orbitSpeed;
        setRotation(prev => ({ ...prev, y: newRotationY }));
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        groupRef.current.position.y += gravity;
      }
    }
  });

  // Enhanced flip handler - smoothly rotate to opposite side
  const handleCardFlip = useCallback(() => {
    console.log('🎯 Manual card flip triggered - rotating to opposite side');
    
    // Calculate target rotation (flip to opposite side)
    const currentY = rotation.y;
    const targetY = currentY + 180;
    
    setRotation(prev => ({ ...prev, y: targetY }));
    setIsFlipped(prev => !prev);
    onClick?.();
  }, [rotation.y, onClick]);

  // Enhanced mouse interaction handlers
  const handleMouseDown = useCallback((e: any) => {
    console.log('🎯 Mouse down event received');
    
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime.current;
    
    // Clear any existing timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    
    // Check for double-click (within 500ms)
    if (timeSinceLastClick < 500) {
      console.log('🎯 Double-click detected, triggering flip');
      clickCount.current = 0;
      handleCardFlip();
      return;
    }
    
    // Start drag operation
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - rotation.y, 
      y: e.clientY - rotation.x 
    });
    setAutoRotateEnabled(false);
    
    lastClickTime.current = currentTime;
    
    console.log('🎯 Drag started:', { 
      clientX: e.clientX, 
      clientY: e.clientY,
      rotationY: rotation.y,
      rotationX: rotation.x
    });
  }, [rotation, handleCardFlip]);

  const handleMouseMove = useCallback((e: any) => {
    // Update mouse position for effects
    const rect = e.target.getBoundingClientRect?.() || { left: 0, top: 0, width: 400, height: 560 };
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePosition({ x, y });
    
    // Handle dragging rotation with FULL 360° freedom
    if (isDragging) {
      const newRotationY = e.clientX - dragStart.x;
      const newRotationX = dragStart.y - e.clientY;
      
      console.log('🎯 Drag rotation update:', {
        clientX: e.clientX,
        clientY: e.clientY,
        dragStartX: dragStart.x,
        dragStartY: dragStart.y,
        newRotationX,
        newRotationY
      });
      
      setRotation({
        x: newRotationX * 0.5, // Reduce sensitivity for smoother control
        y: newRotationY * 0.5  // Reduce sensitivity for smoother control
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback((e: any) => {
    console.log('🎯 Mouse up event received, isDragging:', isDragging);
    
    if (isDragging) {
      setIsDragging(false);
      setAutoRotateEnabled(controls.autoRotate);
      console.log('🎯 Drag ended');
    }
  }, [isDragging, controls.autoRotate]);

  const handleMouseEnter = useCallback(() => {
    console.log('🎯 Mouse enter');
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    console.log('🎯 Mouse leave');
    setIsHovering(false);
    setIsDragging(false);
    setAutoRotateEnabled(controls.autoRotate);
  }, [controls.autoRotate]);

  return {
    groupRef,
    isFlipped,
    isHovering,
    mousePosition,
    rotation, // This rotation state is used for face detection and applied in useFrame
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleCardFlip
  };
};
