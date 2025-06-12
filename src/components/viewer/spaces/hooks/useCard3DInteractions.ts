
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
      // Apply manual rotation from dragging - FIXED: Remove constraints and improve handling
      const normalizedRotationX = ((rotation.x % 360) + 360) % 360;
      const normalizedRotationY = ((rotation.y % 360) + 360) % 360;
      
      // Apply smooth rotation without restrictions
      groupRef.current.rotation.x = (normalizedRotationX * Math.PI) / 180 * 0.6;
      groupRef.current.rotation.y = (normalizedRotationY * Math.PI) / 180 * 0.6;
      
      // Add flip rotation if card is flipped - FIXED: Don't interfere with manual rotation
      if (isFlipped && !isDragging) {
        groupRef.current.rotation.y += Math.PI;
      }

      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      groupRef.current.position.y = floatY;

      // Auto rotation (only when not dragging)
      if (autoRotateEnabled && !isDragging) {
        groupRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        groupRef.current.position.y += gravity;
      }
    }
  });

  // Double-click flip handler
  const handleCardFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
    onClick?.();
  }, [onClick]);

  // Mouse interaction handlers - FIXED: Improved rotation calculation
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
    
    // Handle dragging rotation - FIXED: Remove constraints for both axes
    if (isDragging) {
      const newRotationX = e.clientY - dragStart.y;
      const newRotationY = e.clientX - dragStart.x;
      
      setRotation({
        x: newRotationX,
        y: newRotationY
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
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleCardFlip
  };
};
