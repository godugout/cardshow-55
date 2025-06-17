
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
  const [cropArea, setCropArea] = useState<CropArea>(
    file.editData?.cropArea || {
      x: 50,
      y: 50,
      width: 250,
      height: 350,
      rotation: 0
    }
  );
  const [zoom, setZoom] = useState(file.editData?.zoom || 1);
  const [showGrid, setShowGrid] = useState(true);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<CropArea[]>([cropArea]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const CARD_ASPECT_RATIO = 2.5 / 3.5;

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

  useEffect(() => {
    loadImageAndDraw();
  }, [cropArea, zoom, showGrid]);

  const loadImageAndDraw = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    img.onload = () => {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const containerHeight = containerRef.current?.clientHeight || 600;
      
      const scale = Math.min(containerWidth / img.naturalWidth, containerHeight / img.naturalHeight);
      
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = file.preview;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement>, handle: string) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragHandle(handle);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !canvasRef.current || !imageRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    setCropArea(prev => {
      let newCrop = { ...prev };
      const img = imageRef.current!;
      const maxX = img.clientWidth - prev.width;
      const maxY = img.clientHeight - prev.height;

      switch (dragHandle) {
        case 'move':
          newCrop.x = Math.max(0, Math.min(maxX, prev.x + deltaX));
          newCrop.y = Math.max(0, Math.min(maxY, prev.y + deltaY));
          break;

        case 'tl':
          const newWidth = prev.width - deltaX;
          const newHeight = aspectRatioLocked ? newWidth / CARD_ASPECT_RATIO : prev.height - deltaY;
          if (newWidth > 30 && newHeight > 30) {
            newCrop.x = prev.x + deltaX;
            newCrop.y = prev.y + (aspectRatioLocked ? deltaY : deltaY);
            newCrop.width = newWidth;
            newCrop.height = newHeight;
          }
          break;

        case 'br':
          const brNewWidth = prev.width + deltaX;
          const brNewHeight = aspectRatioLocked ? brNewWidth / CARD_ASPECT_RATIO : prev.height + deltaY;
          if (brNewWidth > 30 && brNewHeight > 30) {
            newCrop.width = brNewWidth;
            newCrop.height = brNewHeight;
          }
          break;

        case 'rotate':
          const centerX = prev.x + prev.width / 2;
          const centerY = prev.y + prev.height / 2;
          const angle = Math.atan2(currentY - centerY, currentX - centerX);
          newCrop.rotation = Math.round((angle * 180 / Math.PI) / 15) * 15;
          break;
      }

      // Ensure bounds
      newCrop.x = Math.max(0, Math.min(newCrop.x, img.clientWidth - newCrop.width));
      newCrop.y = Math.max(0, Math.min(newCrop.y, img.clientHeight - newCrop.height));

      return newCrop;
    });

    setDragStart({ x: currentX, y: currentY });
  }, [isDragging, dragHandle, dragStart, aspectRatioLocked]);

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
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 350;
    canvas.height = 490;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((cropArea.rotation * Math.PI) / 180);
    
    ctx.drawImage(
      imageRef.current,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height
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
        <div className="relative w-full h-full" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          />
          <img
            ref={imageRef}
            className="hidden"
            alt="Source"
          />
          
          <ImprovedCropOverlay
            cropArea={cropArea}
            zoom={zoom}
            imageLoaded={true}
            showGrid={showGrid}
            gridSize={20}
            aspectRatioLocked={aspectRatioLocked}
            onMouseDown={handleMouseDown}
            canvasWidth={canvasRef.current?.width || 0}
            canvasHeight={canvasRef.current?.height || 0}
          />
        </div>
      </Card>
    </div>
  );
};
