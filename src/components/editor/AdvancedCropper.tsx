
import React, { useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CropperProps } from './cropper/types';
import { CropperToolbar } from './cropper/CropperToolbar';
import { CropOverlay } from './cropper/CropOverlay';
import { CropperSidebar } from './cropper/CropperSidebar';
import { useCropAreaManager } from './cropper/useCropAreaManager';

export const AdvancedCropper: React.FC<CropperProps> = ({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 2.5 / 3.5,
  className = ''
}) => {
  const {
    cropAreas,
    setCropAreas,
    selectedCropId,
    setSelectedCropId,
    isDragging,
    setIsDragging,
    dragHandle,
    setDragHandle,
    dragStart,
    setDragStart,
    imageLoaded,
    setImageLoaded,
    zoom,
    setZoom,
    showPreview,
    setShowPreview,
    isExtracting,
    setIsExtracting,
    imageRef,
    initializeCrops,
    addCropArea,
    removeCropArea,
    selectCrop
  } = useCropAreaManager(aspectRatio);

  const handleImageLoad = useCallback(() => {
    initializeCrops();
    setImageLoaded(true);
  }, [initializeCrops, setImageLoaded]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, cropId: string, handle?: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandle(handle || 'move');
    setDragStart({ x: e.clientX, y: e.clientY });
    selectCrop(cropId);
  }, [setIsDragging, setDragHandle, setDragStart, selectCrop]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedCropId || !imageRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const img = imageRef.current;

    setCropAreas(prev => prev.map(crop => {
      if (crop.id !== selectedCropId) return crop;

      let newCrop = { ...crop };

      switch (dragHandle) {
        case 'move':
          newCrop.x = Math.max(0, Math.min(crop.x + deltaX, img.clientWidth - crop.width));
          newCrop.y = Math.max(0, Math.min(crop.y + deltaY, img.clientHeight - crop.height));
          break;
        
        case 'tl':
          newCrop.x = Math.max(0, crop.x + deltaX);
          newCrop.y = Math.max(0, crop.y + deltaY);
          newCrop.width = crop.width - deltaX;
          newCrop.height = crop.height - deltaY;
          break;
        
        case 'tr':
          newCrop.y = Math.max(0, crop.y + deltaY);
          newCrop.width = crop.width + deltaX;
          newCrop.height = crop.height - deltaY;
          break;
        
        case 'bl':
          newCrop.x = Math.max(0, crop.x + deltaX);
          newCrop.width = crop.width - deltaX;
          newCrop.height = crop.height + deltaY;
          break;
        
        case 'br':
          newCrop.width = crop.width + deltaX;
          newCrop.height = crop.height + deltaY;
          break;
      }

      // Ensure minimum size
      newCrop.width = Math.max(50, newCrop.width);
      newCrop.height = Math.max(50, newCrop.height);

      // Ensure within bounds
      newCrop.width = Math.min(newCrop.width, img.clientWidth - newCrop.x);
      newCrop.height = Math.min(newCrop.height, img.clientHeight - newCrop.y);

      // Maintain aspect ratio for main card
      if (crop.type === 'main' && dragHandle !== 'move') {
        if (dragHandle?.includes('r')) {
          newCrop.height = newCrop.width / aspectRatio;
        } else {
          newCrop.width = newCrop.height * aspectRatio;
        }
      }

      return newCrop;
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, selectedCropId, dragHandle, dragStart, aspectRatio, setCropAreas, setDragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, [setIsDragging, setDragHandle]);

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

  // Extract all crops
  const extractAllCrops = useCallback(async () => {
    if (!imageRef.current || !imageLoaded) {
      toast.error('Image not ready');
      return;
    }

    setIsExtracting(true);
    
    try {
      const img = imageRef.current;
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      const results: { main?: string; frame?: string; elements?: string[] } = {};
      const elements: string[] = [];

      for (const crop of cropAreas) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) continue;

        // Convert display coordinates to natural image coordinates
        const sourceX = crop.x * scaleX;
        const sourceY = crop.y * scaleY;
        const sourceWidth = crop.width * scaleX;
        const sourceHeight = crop.height * scaleY;

        // Set output dimensions
        const outputWidth = Math.min(1200, sourceWidth);
        const outputHeight = Math.min(1600, sourceHeight);
        
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // Draw the cropped area
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, outputWidth, outputHeight
        );

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png', 0.95);

        if (crop.type === 'main') {
          results.main = dataUrl;
        } else if (crop.type === 'frame') {
          results.frame = dataUrl;
        } else {
          elements.push(dataUrl);
        }
      }

      if (elements.length > 0) {
        results.elements = elements;
      }

      onCropComplete(results);
      toast.success('All crops extracted successfully!');
    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to extract crops');
    } finally {
      setIsExtracting(false);
    }
  }, [cropAreas, imageLoaded, onCropComplete, setIsExtracting]);

  return (
    <div className={`h-full flex flex-col bg-editor-darker ${className}`}>
      <CropperToolbar
        cropCount={cropAreas.length}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        zoom={zoom}
        onZoomIn={() => setZoom(Math.min(3, zoom + 0.25))}
        onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.25))}
        onExtractAll={extractAllCrops}
        onCancel={onCancel}
        imageLoaded={imageLoaded}
        isExtracting={isExtracting}
      />

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 p-4 overflow-auto bg-editor-darker">
          <Card className="relative overflow-hidden bg-editor-dark border-editor-border max-w-fit mx-auto">
            <div className="relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop source"
                className="max-w-full max-h-[600px] w-auto h-auto"
                onLoad={handleImageLoad}
                draggable={false}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              />
              
              <CropOverlay
                cropAreas={cropAreas}
                zoom={zoom}
                imageLoaded={imageLoaded}
                onMouseDown={handleMouseDown}
              />
            </div>
          </Card>
        </div>

        <CropperSidebar
          cropAreas={cropAreas}
          imageLoaded={imageLoaded}
          selectedCropId={selectedCropId}
          onAddCropArea={addCropArea}
          onSelectCrop={selectCrop}
          onRemoveCrop={removeCropArea}
        />
      </div>
    </div>
  );
};
