
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { FloatingCropToolbar } from './FloatingCropToolbar';
import { ImprovedCropOverlay } from '../enhanced-crop/ImprovedCropOverlay';
import type { UploadedFile } from '@/types/bulk-upload';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

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
  const [cropArea, setCropArea] = useState<CropArea>(
    file.editData?.cropArea || {
      x: 100,
      y: 100,
      width: 200,
      height: 280,
      rotation: 0
    }
  );
  const [zoom, setZoom] = useState(file.editData?.zoom || 1);
  const [showGrid, setShowGrid] = useState(true);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0 });
  const [history, setHistory] = useState<CropArea[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const CARD_ASPECT_RATIO = 2.5 / 3.5;
  const CANVAS_PADDING = 100; // Padding around the image
  const MIN_OVERLAP = 0.25; // Minimum 25% of crop box must overlap with image

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

    // Calculate intersection area
    const intersectionLeft = Math.max(crop.x, imagePosition.x);
    const intersectionTop = Math.max(crop.y, imagePosition.y);
    const intersectionRight = Math.min(cropRight, imageRight);
    const intersectionBottom = Math.min(cropBottom, imageBottom);

    if (intersectionLeft >= intersectionRight || intersectionTop >= intersectionBottom) {
      return false; // No intersection
    }

    const intersectionArea = (intersectionRight - intersectionLeft) * (intersectionBottom - intersectionTop);
    const cropArea = crop.width * crop.height;
    
    return intersectionArea >= (cropArea * MIN_OVERLAP);
  }, [imagePosition, imageDimensions]);

  // Initialize crop area when image loads
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Set canvas dimensions
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
        const cropWidth = Math.min(200, displayWidth * 0.6);
        const cropHeight = aspectRatioLocked ? cropWidth / CARD_ASPECT_RATIO : Math.min(280, displayHeight * 0.6);
        
        const initialCrop = {
          x: imageX + (displayWidth - cropWidth) / 2,
          y: imageY + (displayHeight - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight,
          rotation: 0
        };
        
        setCropArea(initialCrop);
        setHistory([initialCrop]);
        setHistoryIndex(0);
      }
      
      setImageLoaded(true);
    };
    
    img.src = file.preview;
  }, [file.preview, file.editData?.cropArea, aspectRatioLocked]);

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
  }, [cropArea]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !imageLoaded) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    setCropArea(prev => {
      let newCrop = { ...prev };

      switch (dragHandle) {
        case 'move':
          // Allow movement anywhere within the canvas, just ensure some overlap
          const newX = dragStart.cropX + deltaX;
          const newY = dragStart.cropY + deltaY;
          
          // Constrain to canvas bounds with some tolerance
          newCrop.x = Math.max(-prev.width + 50, Math.min(canvasDimensions.width - 50, newX));
          newCrop.y = Math.max(-prev.height + 50, Math.min(canvasDimensions.height - 50, newY));
          break;

        case 'tl':
          const newWidthTL = Math.max(30, prev.width - deltaX);
          const newHeightTL = aspectRatioLocked ? newWidthTL / CARD_ASPECT_RATIO : Math.max(30, prev.height - deltaY);
          newCrop.x = prev.x + deltaX;
          newCrop.y = aspectRatioLocked ? prev.y - (newHeightTL - prev.height) : prev.y + deltaY;
          newCrop.width = newWidthTL;
          newCrop.height = newHeightTL;
          break;

        case 'tr':
          const newWidthTR = Math.max(30, prev.width + deltaX);
          const newHeightTR = aspectRatioLocked ? newWidthTR / CARD_ASPECT_RATIO : Math.max(30, prev.height - deltaY);
          newCrop.width = newWidthTR;
          newCrop.height = newHeightTR;
          newCrop.y = aspectRatioLocked ? prev.y - (newHeightTR - prev.height) : prev.y + deltaY;
          break;

        case 'bl':
          const newWidthBL = Math.max(30, prev.width - deltaX);
          const newHeightBL = aspectRatioLocked ? newWidthBL / CARD_ASPECT_RATIO : Math.max(30, prev.height + deltaY);
          newCrop.x = prev.x + deltaX;
          newCrop.width = newWidthBL;
          newCrop.height = newHeightBL;
          break;

        case 'br':
          const newWidthBR = Math.max(30, prev.width + deltaX);
          const newHeightBR = aspectRatioLocked ? newWidthBR / CARD_ASPECT_RATIO : Math.max(30, prev.height + deltaY);
          newCrop.width = newWidthBR;
          newCrop.height = newHeightBR;
          break;

        case 'rotate':
          const centerX = prev.x + prev.width / 2;
          const centerY = prev.y + prev.height / 2;
          const angle = Math.atan2(clientY - centerY, clientX - centerX);
          newCrop.rotation = Math.round((angle * 180 / Math.PI) / 15) * 15;
          break;

        // Edge handles
        case 't':
          const newHeightT = aspectRatioLocked ? prev.width / CARD_ASPECT_RATIO : Math.max(30, prev.height - deltaY);
          newCrop.y = prev.y + (prev.height - newHeightT);
          newCrop.height = newHeightT;
          break;

        case 'b':
          const newHeightB = aspectRatioLocked ? prev.width / CARD_ASPECT_RATIO : Math.max(30, prev.height + deltaY);
          newCrop.height = newHeightB;
          break;

        case 'l':
          const newWidthL = aspectRatioLocked ? prev.height * CARD_ASPECT_RATIO : Math.max(30, prev.width - deltaX);
          newCrop.x = prev.x + (prev.width - newWidthL);
          newCrop.width = newWidthL;
          break;

        case 'r':
          const newWidthR = aspectRatioLocked ? prev.height * CARD_ASPECT_RATIO : Math.max(30, prev.width + deltaX);
          newCrop.width = newWidthR;
          break;
      }

      return newCrop;
    });
  }, [isDragging, dragHandle, dragStart, aspectRatioLocked, canvasDimensions, imageLoaded]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      saveToHistory(cropArea);
    }
    setIsDragging(false);
    setDragHandle(null);
  }, [isDragging, cropArea, saveToHistory]);

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

  const handleApply = async () => {
    if (!imageLoaded) return;

    // Validate that there's sufficient overlap
    if (!hasValidOverlap(cropArea)) {
      alert('Crop area must have at least 25% overlap with the image');
      return;
    }

    // Create a canvas for the cropped image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 350;
    canvas.height = 490;

    const img = new Image();
    img.onload = () => {
      // Calculate the scale factor between display image and actual image
      const scaleX = img.naturalWidth / imageDimensions.width;
      const scaleY = img.naturalHeight / imageDimensions.height;

      // Calculate crop area relative to the image (not canvas)
      const relativeX = (cropArea.x - imagePosition.x) * scaleX;
      const relativeY = (cropArea.y - imagePosition.y) * scaleY;
      const relativeWidth = cropArea.width * scaleX;
      const relativeHeight = cropArea.height * scaleY;

      // Apply the crop with rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((cropArea.rotation * Math.PI) / 180);
      
      ctx.drawImage(
        img,
        Math.max(0, relativeX), 
        Math.max(0, relativeY), 
        Math.min(relativeWidth, img.naturalWidth - Math.max(0, relativeX)), 
        Math.min(relativeHeight, img.naturalHeight - Math.max(0, relativeY)),
        -canvas.width / 2, 
        -canvas.height / 2, 
        canvas.width, 
        canvas.height
      );
      
      ctx.restore();

      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      onApply({
        cropArea,
        zoom,
        originalImageUrl: file.preview,
        croppedImageUrl
      });
    };
    
    img.src = file.preview;
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
        aspectRatioLocked={aspectRatioLocked}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onZoomIn={() => setZoom(Math.min(3, zoom + 0.25))}
        onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.25))}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleAspectRatio={() => setAspectRatioLocked(!aspectRatioLocked)}
        onUndo={undo}
        onRedo={redo}
        onApply={handleApply}
        onCancel={onCancel}
      />

      <Card className="bg-crd-darkGray border-crd-mediumGray/30 w-[90vw] h-[80vh] overflow-hidden mt-20">
        <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
          {imageLoaded && (
            <>
              <img
                ref={imageRef}
                src={file.preview}
                alt="Crop preview"
                className="absolute pointer-events-none"
                style={{
                  left: imagePosition.x,
                  top: imagePosition.y,
                  width: imageDimensions.width,
                  height: imageDimensions.height,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center'
                }}
              />
              
              {/* Canvas overlay for out-of-bounds visualization */}
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              >
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <mask id="canvas-mask">
                      <rect width="100%" height="100%" fill="black" />
                      <rect 
                        x={cropArea.x} 
                        y={cropArea.y} 
                        width={cropArea.width} 
                        height={cropArea.height}
                        fill="white"
                        transform={`rotate(${cropArea.rotation} ${cropArea.x + cropArea.width/2} ${cropArea.y + cropArea.height/2})`}
                      />
                    </mask>
                  </defs>
                  <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.3)" mask="url(#canvas-mask)" />
                </svg>
              </div>
              
              <ImprovedCropOverlay
                cropArea={cropArea}
                zoom={zoom}
                imageLoaded={imageLoaded}
                showGrid={showGrid}
                gridSize={20}
                aspectRatioLocked={aspectRatioLocked}
                onMouseDown={handleMouseDown}
                canvasWidth={canvasDimensions.width}
                canvasHeight={canvasDimensions.height}
              />

              {/* Visual indicator for invalid overlap */}
              {!hasValidOverlap(cropArea) && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium z-30">
                  ⚠️ Crop area needs more overlap with image
                </div>
              )}
            </>
          )}
          
          {!imageLoaded && (
            <div className="text-white">Loading image...</div>
          )}
        </div>
      </Card>
    </div>
  );
};
