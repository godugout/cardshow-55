
import { useState, useCallback, useRef, useEffect } from 'react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface UseCropAreaManagerProps {
  initialCropArea?: CropArea;
  canvasDimensions: { width: number; height: number };
  imagePosition: { x: number; y: number };
  imageDimensions: { width: number; height: number };
}

export const useCropAreaManager = ({
  initialCropArea,
  canvasDimensions,
  imagePosition,
  imageDimensions,
}: UseCropAreaManagerProps) => {
  const [cropArea, setCropAreaState] = useState<CropArea>(
    initialCropArea || {
      x: 100,
      y: 100,
      width: 200,
      height: 280,
      rotation: 0
    }
  );
  
  const [history, setHistory] = useState<CropArea[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0 });

  // Constants
  const MIN_OVERLAP = 0.25;
  const MIN_SIZE = 30;
  const RESIZE_STEP = 5;

  // Aspect ratio constants
  const ASPECT_RATIOS = {
    card: 2.5 / 3.5,
    landscape: 3 / 2,
    portrait: 2 / 3,
    square: 1,
    free: null
  };

  // Custom setCropArea that accepts both direct values and updater functions
  const setCropArea = useCallback((cropOrUpdater: CropArea | ((prev: CropArea) => CropArea)) => {
    if (typeof cropOrUpdater === 'function') {
      setCropAreaState(prev => cropOrUpdater(prev));
    } else {
      setCropAreaState(cropOrUpdater);
    }
  }, []);

  const saveToHistory = useCallback((cropState: CropArea) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...cropState });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCropArea({ ...history[historyIndex - 1] });
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCropArea({ ...history[historyIndex + 1] });
    }
  }, [history, historyIndex]);

  // Calculate if crop box has sufficient overlap with image
  const hasValidOverlap = useCallback((crop: CropArea) => {
    const cropRight = crop.x + crop.width;
    const cropBottom = crop.y + crop.height;
    const imageRight = imagePosition.x + imageDimensions.width;
    const imageBottom = imagePosition.y + imageDimensions.height;

    const intersectionLeft = Math.max(crop.x, imagePosition.x);
    const intersectionTop = Math.max(crop.y, imagePosition.y);
    const intersectionRight = Math.min(cropRight, imageRight);
    const intersectionBottom = Math.min(cropBottom, imageBottom);

    if (intersectionLeft >= intersectionRight || intersectionTop >= intersectionBottom) {
      return false;
    }

    const intersectionArea = (intersectionRight - intersectionLeft) * (intersectionBottom - intersectionTop);
    const cropAreaSize = crop.width * crop.height;
    
    return intersectionArea >= (cropAreaSize * MIN_OVERLAP);
  }, [imagePosition, imageDimensions]);

  // Constrain crop box to canvas bounds
  const constrainToCanvas = useCallback((crop: CropArea): CropArea => {
    const maxX = canvasDimensions.width - MIN_SIZE;
    const maxY = canvasDimensions.height - MIN_SIZE;
    
    return {
      ...crop,
      x: Math.max(0, Math.min(crop.x, maxX - crop.width)),
      y: Math.max(0, Math.min(crop.y, maxY - crop.height)),
      width: Math.max(MIN_SIZE, Math.min(crop.width, canvasDimensions.width - crop.x)),
      height: Math.max(MIN_SIZE, Math.min(crop.height, canvasDimensions.height - crop.y))
    };
  }, [canvasDimensions]);

  // Apply aspect ratio to crop area
  const applyAspectRatio = useCallback((crop: CropArea, ratio: number | null): CropArea => {
    if (!ratio) return crop;

    const centerX = crop.x + crop.width / 2;
    const centerY = crop.y + crop.height / 2;
    
    let newWidth = crop.width;
    let newHeight = crop.height;
    
    if (crop.width / crop.height > ratio) {
      newWidth = crop.height * ratio;
    } else {
      newHeight = crop.width / ratio;
    }

    if (newWidth < MIN_SIZE) {
      newWidth = MIN_SIZE;
      newHeight = newWidth / ratio;
    }
    if (newHeight < MIN_SIZE) {
      newHeight = MIN_SIZE;
      newWidth = newHeight * ratio;
    }

    const newCrop = {
      ...crop,
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight
    };

    return constrainToCanvas(newCrop);
  }, [constrainToCanvas]);

  return {
    cropArea,
    setCropArea,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    isDragging,
    setIsDragging,
    dragHandle,
    setDragHandle,
    dragStart,
    setDragStart,
    saveToHistory,
    undo,
    redo,
    hasValidOverlap,
    constrainToCanvas,
    applyAspectRatio,
    ASPECT_RATIOS,
    MIN_SIZE,
    RESIZE_STEP
  };
};
