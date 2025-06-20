
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cropImageFromFile } from '@/services/imageCropper';
import type { CropBounds } from '@/services/imageCropper';

import { ProfessionalCropToolbar } from './crop-dialog/ProfessionalCropToolbar';
import { ProfessionalCropSidebar } from './crop-dialog/ProfessionalCropSidebar';
import { InteractiveCropArea } from './InteractiveCropArea';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Initialize crop bounds based on format
  const getInitialCropBounds = useCallback((): CropBounds => {
    if (cropFormat === 'fullCard') {
      const aspectRatio = 2.5 / 3.5;
      const height = 80;
      const width = height * aspectRatio;
      
      return {
        x: (100 - width) / 2,
        y: (100 - height) / 2,
        width,
        height
      };
    } else {
      const size = 70;
      return {
        x: (100 - size) / 2,
        y: (100 - size) / 2,
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

  // Handle image loading and positioning
  useEffect(() => {
    if (!selectedPhoto || !isOpen) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const canvasWidth = canvasRect.width - 32;
      const canvasHeight = canvasRect.height - 32;
      
      const imageAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvasWidth / canvasHeight;
      
      let displayWidth, displayHeight;
      if (imageAspect > canvasAspect) {
        displayWidth = canvasWidth * 0.8;
        displayHeight = displayWidth / imageAspect;
      } else {
        displayHeight = canvasHeight * 0.8;
        displayWidth = displayHeight * imageAspect;
      }
      
      setImageDimensions({ width: displayWidth, height: displayHeight });
      setImagePosition({
        x: (canvasWidth - displayWidth) / 2 + 16,
        y: (canvasHeight - displayHeight) / 2 + 16
      });
      
      setImageLoaded(true);
      setImageError(false);
      
      if (imageRef.current) {
        imageRef.current.src = selectedPhoto;
      }
    };
    
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
      toast.error('Failed to load image');
    };
    
    img.src = selectedPhoto;
  }, [selectedPhoto, isOpen]);

  // Centralized scroll-to-zoom handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      handleApplyCrop();
    } else if (e.key === 'g' || e.key === 'G') {
      setShowGrid(!showGrid);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setZoom(prev => Math.min(3, prev + 0.25));
    } else if (e.key === '-') {
      e.preventDefault();
      setZoom(prev => Math.max(0.5, prev - 0.25));
    }
  }, [isOpen, onClose, showGrid]);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && isOpen) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleWheel, handleKeyDown, isOpen]);

  const handleApplyCrop = async () => {
    if (!originalFile) {
      toast.error('No original file available');
      return;
    }

    try {
      const img = imageRef.current;
      if (!img) return;

      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

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
        newBounds.y = (100 - cropBounds.height) / 2;
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
      <DialogContent className="max-w-4xl w-[90vw] h-[80vh] bg-gray-900 border-gray-700 p-0 gap-0">
        {/* Compact Header - Remove excessive padding */}
        <div className="px-6 py-3 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-lg font-semibold text-white">Crop & Position Your Photo</h2>
        </div>

        <div className="flex h-full min-h-0">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Compact Toolbar - Moved closer to header */}
            <ProfessionalCropToolbar
              cropFormat={cropFormat}
              showGrid={showGrid}
              zoom={zoom}
              onFormatChange={setCropFormat}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onZoomChange={setZoom}
              onReset={handleReset}
              onApplyCrop={handleApplyCrop}
            />

            {/* Canvas Area - Reduced padding */}
            <div 
              ref={canvasRef}
              className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 overflow-hidden relative"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {!imageLoaded && !imageError && (
                  <div className="flex items-center justify-center text-white">
                    <div className="animate-pulse text-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg mb-4 mx-auto"></div>
                      <div>Loading image...</div>
                    </div>
                  </div>
                )}
                
                {imageError && (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-red-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-red-400 text-2xl">⚠</span>
                    </div>
                    <div className="text-red-400 font-medium">Failed to load image</div>
                    <div className="text-gray-400 text-sm mt-2">Please try uploading a different image</div>
                  </div>
                )}
                
                {imageLoaded && !imageError && imageDimensions.width > 0 && (
                  <>
                    {/* Single Background Image with Simple Overlay */}
                    <div
                      className="absolute"
                      style={{
                        left: imagePosition.x,
                        top: imagePosition.y,
                        width: imageDimensions.width * zoom,
                        height: imageDimensions.height * zoom,
                        transition: 'all 0.2s ease-out'
                      }}
                    >
                      <img
                        ref={imageRef}
                        src={selectedPhoto}
                        alt="Crop preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      {/* Simple dark overlay with transparent crop window */}
                      <div
                        className="absolute inset-0 bg-black/50"
                        style={{
                          maskImage: `
                            linear-gradient(transparent, transparent),
                            polygon(
                              0% 0%, 
                              ${cropBounds.x}% 0%, 
                              ${cropBounds.x}% ${cropBounds.y}%, 
                              ${cropBounds.x + cropBounds.width}% ${cropBounds.y}%, 
                              ${cropBounds.x + cropBounds.width}% ${cropBounds.y + cropBounds.height}%, 
                              ${cropBounds.x}% ${cropBounds.y + cropBounds.height}%, 
                              ${cropBounds.x}% 100%, 
                              0% 100%
                            ),
                            polygon(
                              ${cropBounds.x + cropBounds.width}% 0%, 
                              100% 0%, 
                              100% 100%, 
                              ${cropBounds.x + cropBounds.width}% 100%, 
                              ${cropBounds.x + cropBounds.width}% ${cropBounds.y + cropBounds.height}%, 
                              ${cropBounds.x + cropBounds.width}% ${cropBounds.y}%
                            ),
                            polygon(
                              ${cropBounds.x}% ${cropBounds.y + cropBounds.height}%, 
                              ${cropBounds.x + cropBounds.width}% ${cropBounds.y + cropBounds.height}%, 
                              ${cropBounds.x + cropBounds.width}% 100%, 
                              ${cropBounds.x}% 100%
                            )
                          `,
                          maskComposite: 'add'
                        }}
                      />
                    </div>

                    {/* Interactive Crop Area */}
                    <InteractiveCropArea
                      cropBounds={cropBounds}
                      setCropBounds={setCropBounds}
                      imageDimensions={imageDimensions}
                      imagePosition={imagePosition}
                      zoom={zoom}
                      aspectRatio={cropFormat === 'fullCard' ? 2.5 / 3.5 : 1}
                      showGrid={showGrid}
                    />
                  </>
                )}
              </div>
              
              {/* Compact controls hint */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg border border-gray-600">
                <div className="flex items-center gap-3">
                  <span>🖱️ Scroll: zoom</span>
                  <span>G: grid</span>
                  <span>+/-: zoom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspector Sidebar */}
          <ProfessionalCropSidebar
            cropFormat={cropFormat}
            zoom={zoom}
            imageDimensions={imageDimensions}
            imageLoading={!imageLoaded}
            imageError={imageError}
            onZoomChange={setZoom}
            onPresetPosition={handlePresetPosition}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
