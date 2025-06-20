
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cropImageFromFile } from '@/services/imageCropper';
import type { CropBounds } from '@/services/imageCropper';

import { ImageLoader } from './crop-dialog/ImageLoader';
import { CropToolbar } from './crop-dialog/CropToolbar';
import { CropCanvas } from './crop-dialog/CropCanvas';
import { CropSidebar } from './crop-dialog/CropSidebar';

interface EnhancedCropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhoto: string;
  originalFile: File | null;
  onCropComplete: (croppedImageUrl: string) => void;
  initialFormat?: 'fullCard' | 'cropped';
}

export const EnhancedCropDialog = ({
  isOpen,
  onClose,
  selectedPhoto,
  originalFile,
  onCropComplete,
  initialFormat = 'fullCard'
}: EnhancedCropDialogProps) => {
  const [cropFormat, setCropFormat] = useState<'fullCard' | 'cropped'>(initialFormat);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize crop bounds based on format
  const getInitialCropBounds = useCallback((): CropBounds => {
    if (cropFormat === 'fullCard') {
      // 2.5:3.5 aspect ratio for trading cards
      const aspectRatio = 2.5 / 3.5;
      const centerX = 50;
      const centerY = 50;
      const height = 70; // 70% of image height
      const width = height * aspectRatio;
      
      return {
        x: centerX - width / 2,
        y: centerY - height / 2,
        width,
        height
      };
    } else {
      // Square crop for cropped format
      const size = 60;
      return {
        x: 20,
        y: 20,
        width: size,
        height: size
      };
    }
  }, [cropFormat]);

  const [cropBounds, setCropBounds] = useState<CropBounds>(getInitialCropBounds());

  // Update crop bounds when format changes
  useEffect(() => {
    setCropBounds(getInitialCropBounds());
  }, [cropFormat, getInitialCropBounds]);

  const handleImageLoad = useCallback((img: HTMLImageElement) => {
    const container = containerRef.current;
    if (!container) {
      console.warn('Container not available');
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width - 40; // Account for padding
    const containerHeight = containerRect.height - 40;
    
    // Calculate display size while maintaining aspect ratio
    const imageAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerWidth / containerHeight;
    
    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayWidth = containerWidth;
      displayHeight = displayWidth / imageAspect;
    } else {
      displayHeight = containerHeight;
      displayWidth = displayHeight * imageAspect;
    }
    
    setImageDimensions({ width: displayWidth, height: displayHeight });
    setImagePosition({
      x: (containerWidth - displayWidth) / 2 + 20,
      y: (containerHeight - displayHeight) / 2 + 20
    });
    
    // Update the imageRef if it exists
    if (imageRef.current) {
      imageRef.current.src = selectedPhoto;
    }
  }, [selectedPhoto]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    toast.error('Failed to load image for cropping');
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        handleApplyCrop();
      } else if (e.key === 'g') {
        setShowGrid(!showGrid);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, showGrid]);

  const handleApplyCrop = async () => {
    if (!originalFile) {
      toast.error('No original file available');
      return;
    }

    try {
      const naturalWidth = imageRef.current?.naturalWidth || 1;
      const naturalHeight = imageRef.current?.naturalHeight || 1;

      const croppedImageUrl = await cropImageFromFile(originalFile, {
        bounds: {
          x: (cropBounds.x / 100) * naturalWidth,
          y: (cropBounds.y / 100) * naturalHeight,
          width: (cropBounds.width / 100) * naturalWidth,
          height: (cropBounds.height / 100) * naturalHeight
        },
        outputWidth: cropFormat === 'fullCard' ? 400 : 400,
        outputHeight: cropFormat === 'fullCard' ? 560 : 400,
        quality: 0.9
      });

      onCropComplete(croppedImageUrl);
      onClose();
      toast.success('Crop applied successfully!');
    } catch (error) {
      toast.error('Failed to apply crop');
    }
  };

  const handleReset = () => {
    setCropBounds(getInitialCropBounds());
    setZoom(1);
    toast.success('Crop reset to default');
  };

  const handlePresetPosition = (position: 'center' | 'top' | 'bottom') => {
    const newBounds = { ...cropBounds };
    
    switch (position) {
      case 'center':
        newBounds.y = 50 - cropBounds.height / 2;
        break;
      case 'top':
        newBounds.y = 10;
        break;
      case 'bottom':
        newBounds.y = 90 - cropBounds.height;
        break;
    }
    
    setCropBounds(newBounds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[90vw] h-[85vh] bg-crd-darkGray border-crd-mediumGray/30 p-0">
        <DialogHeader className="p-6 pb-4 border-b border-crd-mediumGray/30">
          <DialogTitle className="text-xl font-semibold text-white flex items-center justify-between">
            <span>Crop & Position Your Photo</span>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleApplyCrop}
                disabled={imageLoading || imageError}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Crop
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[calc(100%-80px)]">
          {/* Main Crop Area */}
          <div className="flex-1 flex flex-col">
            <CropToolbar
              cropFormat={cropFormat}
              showGrid={showGrid}
              zoom={zoom}
              onFormatChange={setCropFormat}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onZoomChange={setZoom}
              onReset={handleReset}
            />

            <div ref={containerRef} className="flex-1 overflow-hidden">
              <ImageLoader
                selectedPhoto={selectedPhoto}
                isOpen={isOpen}
                onImageLoad={handleImageLoad}
                onImageError={handleImageError}
                onLoadingChange={setImageLoading}
              />

              <CropCanvas
                selectedPhoto={selectedPhoto}
                cropBounds={cropBounds}
                cropFormat={cropFormat}
                imageDimensions={imageDimensions}
                imagePosition={imagePosition}
                zoom={zoom}
                showGrid={showGrid}
                imageLoading={imageLoading}
                imageError={imageError}
                setCropBounds={setCropBounds}
                onZoomChange={setZoom}
              />
            </div>
          </div>

          {/* Sidebar */}
          <CropSidebar
            cropFormat={cropFormat}
            zoom={zoom}
            imageDimensions={imageDimensions}
            imageLoading={imageLoading}
            imageError={imageError}
            onZoomChange={setZoom}
            onPresetPosition={handlePresetPosition}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
