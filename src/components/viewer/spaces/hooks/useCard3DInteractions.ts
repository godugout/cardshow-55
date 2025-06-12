
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
  
  // Core interaction state
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Double-click detection
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastClickTime = useRef(0);

  useFrame((state) => {
    if (groupRef.current) {
      // Apply rotation to Three.js group
      groupRef.current.rotation.x = (rotation.x * Math.PI) / 180 * 0.3;
      groupRef.current.rotation.y = (rotation.y * Math.PI) / 180 * 0.3;

      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.05;
      groupRef.current.position.y = floatY;

      // Auto rotation when enabled and not dragging
      if (controls.autoRotate && !isDragging) {
        const newRotationY = rotation.y + 0.3 * controls.orbitSpeed;
        setRotation(prev => ({ ...prev, y: newRotationY }));
      }
    }
  });

  // Enhanced flip handler
  const handleCardFlip = useCallback(() => {
    console.log('🎯 Card flip triggered - rotating 180°');
    const targetY = rotation.y + 180;
    setRotation(prev => ({ ...prev, y: targetY }));
    onClick?.();
  }, [rotation.y, onClick]);

  // Mouse down handler with double-click detection
  const handleMouseDown = useCallback((e: any) => {
    e.preventDefault();
    console.log('🎯 Mouse down - checking for double-click');
    
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime.current;
    
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    
    // Double-click detection (within 400ms)
    if (timeSinceLastClick < 400) {
      console.log('🎯 Double-click detected - flipping card');
      clickCount.current = 0;
      handleCardFlip();
      return;
    }
    
    // Start drag operation
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    
    setDragStart({ 
      x: clientX - rotation.y, 
      y: clientY - rotation.x 
    });
    
    lastClickTime.current = currentTime;
    console.log('🎯 Drag started');
  }, [rotation, handleCardFlip]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: any) => {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    
    // Update mouse position for effects
    const rect = e.target?.getBoundingClientRect?.() || { left: 0, top: 0, width: 400, height: 560 };
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    setMousePosition({ x, y });
    
    // Handle dragging
    if (isDragging) {
      const newRotationY = clientX - dragStart.x;
      const newRotationX = dragStart.y - clientY;
      
      setRotation({
        x: newRotationX * 0.3, // Reduced sensitivity
        y: newRotationY * 0.3
      });
      
      console.log('🎯 Dragging - rotation:', { x: newRotationX * 0.3, y: newRotationY * 0.3 });
    }
  }, [isDragging, dragStart]);

  // Mouse up handler
  const handleMouseUp = useCallback((e: any) => {
    if (isDragging) {
      console.log('🎯 Drag ended');
      setIsDragging(false);
    }
  }, [isDragging]);

  // Mouse enter handler
  const handleMouseEnter = useCallback(() => {
    console.log('🎯 Mouse enter');
    setIsHovering(true);
  }, []);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    console.log('🎯 Mouse leave');
    setIsHovering(false);
    setIsDragging(false);
  }, []);

  return {
    groupRef,
    isFlipped: Math.abs((rotation.y % 360)) > 90 && Math.abs((rotation.y % 360)) < 270,
    isHovering,
    mousePosition,
    rotation,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleCardFlip
  };
};
