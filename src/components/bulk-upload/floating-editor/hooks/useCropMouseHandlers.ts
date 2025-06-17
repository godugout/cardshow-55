
import { useCallback, useEffect } from 'react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface UseCropMouseHandlersProps {
  cropArea: CropArea;
  setCropArea: (crop: CropArea) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  dragHandle: string | null;
  setDragHandle: (handle: string | null) => void;
  dragStart: { x: number; y: number; cropX: number; cropY: number };
  setDragStart: (start: { x: number; y: number; cropX: number; cropY: number }) => void;
  saveToHistory: (crop: CropArea) => void;
  constrainToCanvas: (crop: CropArea) => CropArea;
  aspectRatioMode: string;
  ASPECT_RATIOS: Record<string, number | null>;
  canvasDimensions: { width: number; height: number };
  imageLoaded: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  MIN_SIZE: number;
  RESIZE_STEP: number;
}

export const useCropMouseHandlers = ({
  cropArea,
  setCropArea,
  isDragging,
  setIsDragging,
  dragHandle,
  setDragHandle,
  dragStart,
  setDragStart,
  saveToHistory,
  constrainToCanvas,
  aspectRatioMode,
  ASPECT_RATIOS,
  canvasDimensions,
  imageLoaded,
  containerRef,
  MIN_SIZE,
  RESIZE_STEP
}: UseCropMouseHandlersProps) => {

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement>, handle: string) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    setDragStart({
      x: clientX,
      y: clientY,
      cropX: cropArea.x,
      cropY: cropArea.y
    });
    setDragHandle(handle);
    setIsDragging(true);
    
    e.preventDefault();
    e.stopPropagation();
  }, [cropArea, containerRef, setDragStart, setDragHandle, setIsDragging]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !imageLoaded) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const deltaX = Math.round((clientX - dragStart.x) / RESIZE_STEP) * RESIZE_STEP;
    const deltaY = Math.round((clientY - dragStart.y) / RESIZE_STEP) * RESIZE_STEP;

    setCropArea(prev => {
      let newCrop = { ...prev };
      const currentRatio = ASPECT_RATIOS[aspectRatioMode];

      switch (dragHandle) {
        case 'move':
          newCrop.x = dragStart.cropX + deltaX;
          newCrop.y = dragStart.cropY + deltaY;
          break;

        case 'tl':
          const newWidthTL = Math.max(MIN_SIZE, prev.width - deltaX);
          const newHeightTL = currentRatio ? newWidthTL / currentRatio : Math.max(MIN_SIZE, prev.height - deltaY);
          newCrop.x = prev.x + prev.width - newWidthTL;
          newCrop.y = prev.y + prev.height - newHeightTL;
          newCrop.width = newWidthTL;
          newCrop.height = newHeightTL;
          break;

        case 'tr':
          const newWidthTR = Math.max(MIN_SIZE, prev.width + deltaX);
          const newHeightTR = currentRatio ? newWidthTR / currentRatio : Math.max(MIN_SIZE, prev.height - deltaY);
          newCrop.width = newWidthTR;
          newCrop.height = newHeightTR;
          newCrop.y = prev.y + prev.height - newHeightTR;
          break;

        case 'bl':
          const newWidthBL = Math.max(MIN_SIZE, prev.width - deltaX);
          const newHeightBL = currentRatio ? newWidthBL / currentRatio : Math.max(MIN_SIZE, prev.height + deltaY);
          newCrop.x = prev.x + prev.width - newWidthBL;
          newCrop.width = newWidthBL;
          newCrop.height = newHeightBL;
          break;

        case 'br':
          const newWidthBR = Math.max(MIN_SIZE, prev.width + deltaX);
          const newHeightBR = currentRatio ? newWidthBR / currentRatio : Math.max(MIN_SIZE, prev.height + deltaY);
          newCrop.width = newWidthBR;
          newCrop.height = newHeightBR;
          break;

        case 'rotate':
          const centerX = prev.x + prev.width / 2;
          const centerY = prev.y + prev.height / 2;
          const angle = Math.atan2(clientY - centerY, clientX - centerX);
          newCrop.rotation = Math.round((angle * 180 / Math.PI) / 15) * 15;
          break;

        case 't':
          const newHeightT = currentRatio ? prev.width / currentRatio : Math.max(MIN_SIZE, prev.height - deltaY);
          newCrop.y = prev.y + prev.height - newHeightT;
          newCrop.height = newHeightT;
          break;

        case 'b':
          const newHeightB = currentRatio ? prev.width / currentRatio : Math.max(MIN_SIZE, prev.height + deltaY);
          newCrop.height = newHeightB;
          break;

        case 'l':
          const newWidthL = currentRatio ? prev.height * currentRatio : Math.max(MIN_SIZE, prev.width - deltaX);
          newCrop.x = prev.x + prev.width - newWidthL;
          newCrop.width = newWidthL;
          break;

        case 'r':
          const newWidthR = currentRatio ? prev.height * currentRatio : Math.max(MIN_SIZE, prev.width + deltaX);
          newCrop.width = newWidthR;
          break;
      }

      if (dragHandle !== 'move') {
        newCrop = constrainToCanvas(newCrop);
      } else {
        const buffer = 50;
        newCrop.x = Math.max(-newCrop.width + buffer, Math.min(canvasDimensions.width - buffer, newCrop.x));
        newCrop.y = Math.max(-newCrop.height + buffer, Math.min(canvasDimensions.height - buffer, newCrop.y));
      }

      return newCrop;
    });
  }, [isDragging, dragHandle, dragStart, aspectRatioMode, canvasDimensions, imageLoaded, constrainToCanvas, containerRef, ASPECT_RATIOS, MIN_SIZE, RESIZE_STEP, setCropArea]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      saveToHistory(cropArea);
    }
    setIsDragging(false);
    setDragHandle(null);
  }, [isDragging, cropArea, saveToHistory, setIsDragging, setDragHandle]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown
  };
};
