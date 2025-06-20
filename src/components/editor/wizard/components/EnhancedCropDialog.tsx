
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Grid3X3, ZoomIn, ZoomOut, RotateCw, Check, Square, Maximize, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cropImageFromFile } from '@/services/imageCropper';
import { InteractiveCropArea } from './InteractiveCropArea';
import type { CropBounds } from '@/services/imageCropper';

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

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update crop bounds when format changes
  useEffect(() => {
    setCropBounds(getInitialCropBounds());
  }, [cropFormat, getInitialCropBounds]);

  // Handle image load to get natural dimensions
  useEffect(() => {
    if (selectedPhoto && isOpen) {
      console.log('Loading image:', selectedPhoto);
      setImageLoading(true);
      setImageError(false);
      
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded successfully:', img.naturalWidth, 'x', img.naturalHeight);
        
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
        setImageLoading(false);
        
        // Update the imageRef if it exists
        if (imageRef.current) {
          imageRef.current.src = selectedPhoto;
        }
      };
      
      img.onerror = (error) => {
        console.error('Image failed to load:', error);
        setImageError(true);
        setImageLoading(false);
        toast.error('Failed to load image for cropping');
      };
      
      img.src = selectedPhoto;
    }
  }, [selectedPhoto, isOpen]);

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container && isOpen) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel, isOpen]);

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
            {/* Toolbar */}
            <div className="h-16 bg-crd-mediumGray/20 border-b border-crd-mediumGray/30 flex items-center justify-between px-6">
              {/* Format Selection */}
              <div className="flex bg-crd-darkGray rounded-lg p-1">
                <button
                  onClick={() => setCropFormat('fullCard')}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    cropFormat === 'fullCard'
                      ? 'bg-crd-green text-black font-medium'
                      : 'text-crd-lightGray hover:text-white'
                  }`}
                >
                  <Maximize className="w-4 h-4 mr-2 inline" />
                  Full Card (2.5:3.5)
                </button>
                <button
                  onClick={() => setCropFormat('cropped')}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    cropFormat === 'cropped'
                      ? 'bg-crd-green text-black font-medium'
                      : 'text-crd-lightGray hover:text-white'
                  }`}
                >
                  <Square className="w-4 h-4 mr-2 inline" />
                  Square Crop
                </button>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`${
                    showGrid
                      ? 'bg-crd-blue/20 border-crd-blue text-crd-blue'
                      : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid (G)
                </Button>

                {/* Zoom Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-crd-lightGray text-sm w-16 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                    className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Canvas Area */}
            <div 
              ref={containerRef}
              className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-800 p-5 overflow-hidden relative"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {imageLoading && (
                  <div className="text-white text-center">
                    <div className="animate-pulse">Loading image...</div>
                  </div>
                )}
                
                {imageError && (
                  <div className="text-red-400 text-center">
                    <div>Failed to load image</div>
                    <div className="text-sm mt-2">Please try uploading a different image</div>
                  </div>
                )}
                
                {!imageLoading && !imageError && imageDimensions.width > 0 && (
                  <>
                    {/* Hidden image element for natural dimensions */}
                    <img
                      ref={imageRef}
                      src={selectedPhoto}
                      alt="Source"
                      className="hidden"
                      onLoad={() => console.log('Hidden image ref loaded')}
                      onError={() => console.error('Hidden image ref failed')}
                    />

                    {/* Background Image with Darkening */}
                    <img
                      src={selectedPhoto}
                      alt="Crop preview background"
                      className="absolute"
                      style={{
                        width: imageDimensions.width * zoom,
                        height: imageDimensions.height * zoom,
                        left: imagePosition.x,
                        top: imagePosition.y,
                        filter: 'brightness(0.3)' // Darken the background image
                      }}
                    />

                    {/* Bright crop area */}
                    <div
                      className="absolute overflow-hidden"
                      style={{
                        left: imagePosition.x + (cropBounds.x / 100) * imageDimensions.width * zoom,
                        top: imagePosition.y + (cropBounds.y / 100) * imageDimensions.height * zoom,
                        width: (cropBounds.width / 100) * imageDimensions.width * zoom,
                        height: (cropBounds.height / 100) * imageDimensions.height * zoom,
                        borderRadius: cropFormat === 'cropped' ? '8px' : '4px'
                      }}
                    >
                      <img
                        src={selectedPhoto}
                        alt="Crop area"
                        className="absolute"
                        style={{
                          width: imageDimensions.width * zoom,
                          height: imageDimensions.height * zoom,
                          left: -(cropBounds.x / 100) * imageDimensions.width * zoom,
                          top: -(cropBounds.y / 100) * imageDimensions.height * zoom,
                          filter: 'brightness(1) contrast(1.1)' // Bright and enhanced
                        }}
                      />
                    </div>

                    {/* Interactive Crop Area Component */}
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
              
              {/* Scroll to zoom hint */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-md">
                Scroll to zoom • Drag crop area to move
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-crd-darkGray border-l border-crd-mediumGray/30 p-6 space-y-6">
            {/* Zoom Slider */}
            <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">Zoom</h3>
                  <span className="text-crd-lightGray text-sm">{Math.round(zoom * 100)}%</span>
                </div>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Preset Positions */}
            <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
              <CardContent className="p-4">
                <h3 className="text-white font-medium mb-3">Quick Position</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top', label: 'Top' },
                    { id: 'center', label: 'Center' },
                    { id: 'bottom', label: 'Bottom' }
                  ].map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetPosition(preset.id as any)}
                      className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Format Info */}
            <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
              <CardContent className="p-4">
                <h3 className="text-white font-medium mb-3">Format Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-crd-lightGray">
                    <span>Type:</span>
                    <span>{cropFormat === 'fullCard' ? 'Trading Card' : 'Square Crop'}</span>
                  </div>
                  <div className="flex justify-between text-crd-lightGray">
                    <span>Aspect Ratio:</span>
                    <span>{cropFormat === 'fullCard' ? '2.5:3.5' : '1:1'}</span>
                  </div>
                  <div className="flex justify-between text-crd-lightGray">
                    <span>Output Size:</span>
                    <span>{cropFormat === 'fullCard' ? '400×560' : '400×400'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debug Info */}
            {imageDimensions.width > 0 && (
              <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
                <CardContent className="p-4">
                  <h3 className="text-white font-medium mb-3">Debug Info</h3>
                  <div className="space-y-1 text-xs text-crd-lightGray">
                    <div>Image: {imageDimensions.width}×{imageDimensions.height}</div>
                    <div>Loading: {imageLoading ? 'Yes' : 'No'}</div>
                    <div>Error: {imageError ? 'Yes' : 'No'}</div>
                    <div>Zoom: {zoom.toFixed(1)}x</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Keyboard Shortcuts */}
            <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
              <CardContent className="p-4">
                <h3 className="text-white font-medium mb-3">Shortcuts</h3>
                <div className="space-y-1 text-xs text-crd-lightGray">
                  <div className="flex justify-between">
                    <span>Apply crop:</span>
                    <span>Enter</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancel:</span>
                    <span>Escape</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle grid:</span>
                    <span>G</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zoom:</span>
                    <span>Mouse wheel</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
