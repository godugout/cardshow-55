
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEnhanced360Interactions } from './useEnhanced360Interactions';

interface UseSimplifiedViewerInteractionsProps {
  allowRotation: boolean;
  autoRotate: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (start: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  rotation: { x: number; y: number };
  dragStart: { x: number; y: number };
  handleZoom: (delta: number) => void;
  effectIntensity?: number;
}

export const useSimplifiedViewerInteractions = ({
  allowRotation,
  autoRotate,
  isDragging,
  setIsDragging,
  setDragStart,
  setAutoRotate,
  setRotation,
  setMousePosition,
  rotation,
  dragStart,
  handleZoom,
  effectIntensity = 0
}: UseSimplifiedViewerInteractionsProps) => {
  // Use the enhanced 360° interaction system
  const {
    containerRef,
    handleMouseMove,
    handleDragStart,
    handleDragEnd,
    gripPoint,
    physicsState,
    rotationIndicator
  } = useEnhanced360Interactions({
    allowRotation,
    autoRotate,
    isDragging,
    setIsDragging,
    setDragStart,
    setAutoRotate,
    setRotation,
    setMousePosition,
    rotation,
    dragStart,
    handleZoom,
    effectIntensity
  });

  return {
    containerRef,
    handleMouseMove,
    handleDragStart,
    handleDragEnd,
    gripPoint,
    physicsState,
    rotationIndicator
  };
};
