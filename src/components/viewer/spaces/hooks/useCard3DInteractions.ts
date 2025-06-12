
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
  
  // Double-click detection
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Apply manual rotation from dragging with full freedom
      groupRef.current.rotation.x = (rotation.x * Math.PI) / 180 * 0.6;
      groupRef.current.rotation.y = (rotation.y * Math.PI) / 180 * 0.6;

      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      groupRef.current.position.y = floatY;

      // Auto rotation (only when not dragging)
      if (autoRotateEnabled && !isDragging) {
        // Slow, natural rotation that will show both sides
        groupRef.current.rotation.y += 0.002 * controls.orbitSpeed;
        
        // Update our rotation state to match for face detection
        const currentRotationY = (groupRef.current.rotation.y * 180) / Math.PI;
        setRotation(prev => ({ ...prev, y: currentRotationY }));
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
    onClick?.();
  }, [rotation.y, onClick]);

  // Mouse interaction handlers with enhanced rotation
  const handleMouseDown = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - rotation.y, 
      y: e.clientY - rotation.x 
    });
    setAutoRotateEnabled(false);
    
    // Double-click detection
    clickCount.current += 1;
    
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    
    clickTimeout.current = setTimeout(() => {
      if (clickCount.current === 2) {
        handleCardFlip();
      }
      clickCount.current = 0;
    }, 300);
  }, [rotation, handleCardFlip]);

  const handleMouseMove = useCallback((e: any) => {
    e.stopPropagation();
    
    // Update mouse position for effects
    const rect = e.target.getBoundingClientRect?.() || { left: 0, top: 0, width: 400, height: 560 };
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePosition({ x, y });
    
    // Handle dragging rotation with FULL 360° freedom
    if (isDragging) {
      const newRotationX = dragStart.y - e.clientY;
      const newRotationY = e.clientX - dragStart.x;
      
      setRotation({
        x: newRotationX, // Full vertical rotation freedom
        y: newRotationY  // Full horizontal rotation freedom
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsDragging(false);
    setAutoRotateEnabled(controls.autoRotate);
  }, [controls.autoRotate]);

  return {
    groupRef,
    isFlipped,
    isHovering,
    mousePosition,
    rotation, // Pass rotation to child components for face detection
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleCardFlip
  };
};
