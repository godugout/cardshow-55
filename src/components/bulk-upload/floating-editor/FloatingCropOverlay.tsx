
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { FloatingCropToolbar } from './FloatingCropToolbar';
import { CropCanvas } from './components/CropCanvas';
import { useCropAreaManager } from './hooks/useCropAreaManager';
import { useCropMouseHandlers } from './hooks/useCropMouseHandlers';
import { createCroppedImage, initializeCropArea } from './utils/cropUtils';
import type { UploadedFile } from '@/types/bulk-upload';

interface FloatingCropOverlayProps {
  file: UploadedFile;
  onApply: (editData: UploadedFile['editData']) => void;
  onCancel: () => void;
}

export const FloatingCropOverlay: React.FC<FloatingCropOverlayProps> = ({
  file,
  onApply,
  onCancel
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(file.editData?.zoom || 1);
  const [showGrid, setShowGrid] = useState(true);
  const [aspectRatioMode, setAspectRatioMode] = useState<'free' | 'landscape' | 'portrait' | 'square' | 'card'>('card');

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const CANVAS_PADDING = 150;

  const cropManager = useCropAreaManager({
    initialCropArea: file.editData?.cropArea,
    canvasDimensions,
    imagePosition,
    imageDimensions,
  });

  const mouseHandlers = useCropMouseHandlers({
    ...cropManager,
    aspectRatioMode,
    canvasDimensions,
    imageLoaded,
    containerRef,
  });

  // Handle aspect ratio changes
  const handleSetAspectRatio = useCallback((mode: typeof aspectRatioMode) => {
    setAspectRatioMode(mode);
    const ratio = cropManager.ASPECT_RATIOS[mode];
    if (ratio !== null) {
      const newCrop = cropManager.applyAspectRatio(cropManager.cropArea, ratio);
      cropManager.setCropArea(newCrop);
      cropManager.saveToHistory(newCrop);
    }
  }, [aspectRatioMode, cropManager]);

  // Initialize crop area when image loads
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      setCanvasDimensions({ width: containerWidth, height: containerHeight });
      
      // Calculate display dimensions while maintaining aspect ratio
      const imageAspect = img.naturalWidth / img.naturalHeight;
      const availableWidth = containerWidth - (CANVAS_PADDING * 2);
      const availableHeight = containerHeight - (CANVAS_PADDING * 2);
      const availableAspect = availableWidth / availableHeight;
      
      let displayWidth, displayHeight;
      if (imageAspect > availableAspect) {
        displayWidth = availableWidth;
        displayHeight = displayWidth / imageAspect;
      } else {
        displayHeight = availableHeight;
        displayWidth = displayHeight * imageAspect;
      }

      setImageDimensions({ width: displayWidth, height: displayHeight });

      // Center the image in the canvas
      const imageX = (containerWidth - displayWidth) / 2;
      const imageY = (containerHeight - displayHeight) / 2;
      setImagePosition({ x: imageX, y: imageY });

      // Initialize crop area in the center if not already set
      if (!file.editData?.cropArea) {
        const initialCrop = initializeCropArea(
          containerWidth,
          containerHeight,
          displayWidth,
          displayHeight,
          imageX,
          imageY,
          aspectRatioMode,
          cropManager.constrainToCanvas
        );
        
        cropManager.setCropArea(initialCrop);
        cropManager.setHistory([initialCrop]);
        cropManager.setHistoryIndex(0);
      }
      
      setImageLoaded(true);
    };
    
    img.src = file.preview;
  }, [file.preview, file.editData?.cropArea, aspectRatioMode, cropManager]);

  const handleApply = async () => {
    if (!imageLoaded) return;

    // Validate that there's sufficient overlap
    if (!cropManager.hasValidOverlap(cropManager.cropArea)) {
      alert('Crop area must have at least 25% overlap with the image');
      return;
    }

    const croppedImageUrl = await createCroppedImage(
      file.preview,
      cropManager.cropArea,
      imagePosition,
      imageDimensions
    );
    
    onApply({
      cropArea: cropManager.cropArea,
      zoom,
      originalImageUrl: file.preview,
      croppedImageUrl
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter') {
      handleApply();
    }
  }, [onCancel]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center animate-fade-in">
      <FloatingCropToolbar
        fileName={file.file.name}
        zoom={zoom}
        showGrid={showGrid}
        aspectRatioLocked={aspectRatioMode !== 'free'}
        aspectRatioMode={aspectRatioMode}
        canUndo={cropManager.historyIndex > 0}
        canRedo={cropManager.historyIndex < cropManager.history.length - 1}
        onZoomIn={() => setZoom(Math.min(3, zoom + 0.25))}
        onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.25))}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleAspectRatio={() => handleSetAspectRatio(aspectRatioMode === 'free' ? 'card' : 'free')}
        onSetAspectRatio={handleSetAspectRatio}
        onUndo={cropManager.undo}
        onRedo={cropManager.redo}
        onApply={handleApply}
        onCancel={onCancel}
      />

      <Card className="bg-crd-darkGray border-crd-mediumGray/30 w-[90vw] h-[80vh] overflow-hidden mt-20">
        <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
          <CropCanvas
            imageLoaded={imageLoaded}
            imagePosition={imagePosition}
            imageDimensions={imageDimensions}
            imageUrl={file.preview}
            zoom={zoom}
            cropArea={cropManager.cropArea}
            canvasDimensions={canvasDimensions}
            showGrid={showGrid}
            aspectRatioMode={aspectRatioMode}
            hasValidOverlap={cropManager.hasValidOverlap(cropManager.cropArea)}
            onMouseDown={mouseHandlers.handleMouseDown}
          />
        </div>
      </Card>
    </div>
  );
};
