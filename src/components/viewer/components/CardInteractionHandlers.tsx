
import React, { useState, useCallback, useMemo } from 'react';
import { useEnhancedCardEffects } from '../hooks/useEnhancedCardEffects';
import { useEnhancedCardInteraction } from '../hooks/useEnhancedCardInteraction';
import { cardAdapter } from '../utils/cardAdapter';

interface CardInteractionHandlersProps {
  card: any;
  children: (handlers: {
    rotation: { x: number; y: number };
    zoom: number;
    isDragging: boolean;
    mousePosition: { x: number; y: number };
    isHovering: boolean;
    showEffects: boolean;
    effectValues: any;
    autoRotate: boolean;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseUp: (e: React.MouseEvent) => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleCardClick: () => void;
    handleCameraReset: () => void;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleToggleEffects: () => void;
    handleToggleAutoRotate: () => void;
    handleApplyCombo: (combo: any) => void;
    handleResetAllEffects: () => void;
    applyPreset: any;
    presetState: any;
    isApplyingPreset: boolean;
    handleEffectChange: any;
  }) => React.ReactNode;
}

export const CardInteractionHandlers: React.FC<CardInteractionHandlersProps> = ({ card, children }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const {
    effectValues,
    handleEffectChange,
    resetAllEffects,
    applyPreset,
    presetState,
    isApplyingPreset
  } = useEnhancedCardEffects();

  const {
    handleMouseMove: interactionHandleMouseMove,
    handleMouseEnter: interactionHandleMouseEnter,
    handleMouseLeave: interactionHandleMouseLeave
  } = useEnhancedCardInteraction();

  const handleApplyCombo = useCallback((combo: any) => {
    applyPreset(combo.effects);
  }, [applyPreset]);

  const handleResetAllEffects = useCallback(() => {
    resetAllEffects();
  }, [resetAllEffects]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rotation.y,
      y: e.clientY - rotation.x
    });
    setAutoRotate(false); // Stop auto-rotation when user starts dragging
  }, [rotation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
    
    // Handle dragging rotation
    if (isDragging) {
      const newRotationY = e.clientX - dragStart.x;
      const newRotationX = e.clientY - dragStart.y;
      
      setRotation({
        x: Math.max(-90, Math.min(90, newRotationX)), // Limit X rotation
        y: newRotationY // Allow full 360° Y rotation
      });
    } else if (!autoRotate) {
      // Interactive rotation when not dragging and not auto-rotating
      setRotation({
        x: (y - 0.5) * 30, // -15 to 15 degrees
        y: (x - 0.5) * -60 // -30 to 30 degrees
      });
    }
    
    // Create a synthetic event that matches the expected type
    const syntheticEvent = {
      ...e,
      currentTarget: e.currentTarget as HTMLDivElement
    } as React.MouseEvent<HTMLDivElement>;
    
    interactionHandleMouseMove(syntheticEvent);
  }, [isDragging, dragStart, autoRotate, interactionHandleMouseMove]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    interactionHandleMouseEnter();
  }, [interactionHandleMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (!isDragging && !autoRotate) {
      setRotation({ x: 0, y: 0 }); // Reset rotation when not dragging
    }
    interactionHandleMouseLeave();
  }, [isDragging, autoRotate, interactionHandleMouseLeave]);

  const handleCardClick = useCallback(() => {
    // Card click logic - could flip card or other interactions
  }, []);

  const handleCameraReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1.0);
    setAutoRotate(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(3, prev + 0.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(0.5, prev - 0.2));
  }, []);

  const handleToggleEffects = useCallback(() => {
    setShowEffects(prev => !prev);
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate(prev => {
      if (!prev) {
        setRotation({ x: 0, y: 0 }); // Reset rotation when starting auto-rotate
      }
      return !prev;
    });
  }, []);

  // Auto-rotation effect
  React.useEffect(() => {
    if (!autoRotate || isDragging) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 1 // Slow continuous rotation
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  return (
    <>
      {children({
        rotation,
        zoom,
        isDragging,
        mousePosition,
        isHovering,
        showEffects,
        effectValues,
        autoRotate,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseEnter,
        handleMouseLeave,
        handleCardClick,
        handleCameraReset,
        handleZoomIn,
        handleZoomOut,
        handleToggleEffects,
        handleToggleAutoRotate,
        handleApplyCombo,
        handleResetAllEffects,
        applyPreset,
        presetState,
        isApplyingPreset,
        handleEffectChange
      })}
    </>
  );
};
