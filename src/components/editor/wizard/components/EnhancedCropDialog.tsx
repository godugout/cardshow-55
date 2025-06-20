
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cropImageFromFile } from '@/services/imageCropper';
import type { CropBounds } from '@/services/imageCropper';

import { ImageLoader } from './crop-dialog/ImageLoader';
import { ProfessionalCropToolbar } from './crop-dialog/ProfessionalCropToolbar';
import { ProfessionalCropCanvas } from './crop-dialog/ProfessionalCropCanvas';
import { ProfessionalCropSidebar } from './crop-dialog/ProfessionalCropSidebar';

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
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width - 32; // Account for padding
    const containerHeight = containerRect.height - 32;
    
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
      x: (containerWidth - displayWidth) / 2 + 16,
      y: (containerHeight - displayHeight) / 2 + 16
    });
    
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
      } else if (e.key === 'g' || e.key === 'G') {
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
      <DialogContent className="max-w-5xl w-[90vw] h-[80vh] bg-gray-900 border-gray-700 p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <DialogTitle className="text-xl font-semibold text-white flex items-center justify-between">
            <span>Crop & Position Your Photo</span>
            <Button
              onClick={handleApplyCrop}
              disabled={imageLoading || imageError}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Crop
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full min-h-0">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <ProfessionalCropToolbar
              cropFormat={cropFormat}
              showGrid={showGrid}
              zoom={zoom}
              onFormatChange={setCropFormat}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onZoomChange={setZoom}
              onReset={handleReset}
            />

            <div ref={containerRef} className="flex-1 min-h-0">
              <ImageLoader
                selectedPhoto={selectedPhoto}
                isOpen={isOpen}
                onImageLoad={handleImageLoad}
                onImageError={handleImageError}
                onLoadingChange={setImageLoading}
              />

              <ProfessionalCropCanvas
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

          {/* Inspector Sidebar */}
          <ProfessionalCropSidebar
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
