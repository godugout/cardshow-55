
import React, { useRef, useEffect, useCallback } from 'react';
import { useViewerInteractions } from '../hooks/useViewerInteractions';

interface ViewerInteractionLayerProps {
  allowRotation: boolean;
  autoRotate: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (start: any) => void;
  setAutoRotate: (rotate: boolean) => void;
  setRotation: (rotation: any) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  setIsHoveringControls: (hovering: boolean) => void;
  rotation: { x: number; y: number };
  dragStart: any;
  handleZoom: (delta: number) => void;
  showCustomizePanel: boolean;
  showStats: boolean;
  hasMultipleCards: boolean;
  children: React.ReactNode;
}

export const ViewerInteractionLayer: React.FC<ViewerInteractionLayerProps> = ({
  allowRotation,
  autoRotate,
  isDragging,
  setIsDragging,
  setDragStart,
  setAutoRotate,
  setRotation,
  setMousePosition,
  setIsHoveringControls,
  rotation,
  dragStart,
  handleZoom,
  showCustomizePanel,
  showStats,
  hasMultipleCards,
  children
}) => {
  // Viewer interactions hook
  const { containerRef, handleMouseMove, handleDragStart, handleDrag, handleDragEnd } = useViewerInteractions({
    allowRotation,
    autoRotate,
    isDragging,
    setIsDragging,
    setDragStart,
    setAutoRotate,
    setRotation,
    setMousePosition,
    setIsHoveringControls,
    rotation,
    dragStart,
    handleZoom,
    showCustomizePanel,
    showStats,
    hasMultipleCards
  });

  const animationRef = useRef<number>();

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        setRotation((prev: { x: number; y: number }) => ({
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: prev.y + 0.5
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging, setRotation]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {children}
    </div>
  );
};
