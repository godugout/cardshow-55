
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
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleCardClick: () => void;
    handleCameraReset: () => void;
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
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [showEffects, setShowEffects] = useState(true);

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
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
    
    // Create a synthetic event that matches the expected type
    const syntheticEvent = {
      ...e,
      currentTarget: e.currentTarget as HTMLDivElement
    } as React.MouseEvent<HTMLDivElement>;
    
    interactionHandleMouseMove(syntheticEvent);
  }, [interactionHandleMouseMove]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    interactionHandleMouseEnter();
  }, [interactionHandleMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    interactionHandleMouseLeave();
  }, [interactionHandleMouseLeave]);

  const handleCardClick = useCallback(() => {
    // Card click logic
  }, []);

  const handleCameraReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1.0);
  }, []);

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
        handleMouseDown,
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
        handleCardClick,
        handleCameraReset,
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
