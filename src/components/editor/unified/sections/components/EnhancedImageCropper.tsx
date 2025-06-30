
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Crop, RotateCw, Target, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EnhancedImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  className?: string;
}

const CARD_ASPECT_RATIO = 2.5 / 3.5; // Trading card aspect ratio

export const EnhancedImageCropper: React.FC<EnhancedImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  className = ''
}) => {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [extracting, setExtracting] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-detect initial crop area
  const detectInitialCrop = useCallback((img: HTMLImageElement) => {
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    // Calculate optimal crop dimensions for card aspect ratio
    let cropWidth = Math.min(displayWidth * 0.7, displayHeight * CARD_ASPECT_RATIO * 0.7);
    let cropHeight = cropWidth / CARD_ASPECT_RATIO;
    
    // Adjust if height is too large
    if (cropHeight > displayHeight * 0.8) {
      cropHeight = displayHeight * 0.8;
      cropWidth = cropHeight * CARD_ASPECT_RATIO;
    }

    // Center the crop
    const x = (displayWidth - cropWidth) / 2;
    const y = (displayHeight - cropHeight) / 2;

    setCropArea({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(cropWidth, displayWidth),
      height: Math.min(cropHeight, displayHeight)
    });
  }, []);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      detectInitialCrop(imageRef.current);
      setImageLoaded(true);
    }
  }, [detectInitialCrop]);

  // Auto-fit functionality
  const autoFitCard = useCallback(() => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    // Smart card detection - maximize area while maintaining aspect ratio
    let cropWidth = Math.min(displayWidth * 0.85, displayHeight * CARD_ASPECT_RATIO * 0.85);
    let cropHeight = cropWidth / CARD_ASPECT_RATIO;

    if (cropHeight > displayHeight * 0.9) {
      cropHeight = displayHeight * 0.9;
      cropWidth = cropHeight * CARD_ASPECT_RATIO;
    }

    const x = (displayWidth - cropWidth) / 2;
    const y = (displayHeight - cropHeight) / 2;

    setCropArea({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(cropWidth, displayWidth),
      height: Math.min(cropHeight, displayHeight)
    });

    toast.success('Auto-fitted to optimal card dimensions');
  }, []);

  // Mouse event handlers for crop manipulation
  const handleMouseDown = useCallback((e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandle(handle || 'move');
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const img = imageRef.current;

    setCropArea(prev => {
      let newCrop = { ...prev };

      switch (dragHandle) {
        case 'move':
          newCrop.x = Math.max(0, Math.min(prev.x + deltaX, img.clientWidth - prev.width));
          newCrop.y = Math.max(0, Math.min(prev.y + deltaY, img.clientHeight - prev.height));
          break;
        
        case 'tl':
          newCrop.x = Math.max(0, prev.x + deltaX);
          newCrop.y = Math.max(0, prev.y + deltaY);
          newCrop.width = prev.width - deltaX;
          newCrop.height = prev.height - deltaY;
          break;
        
        case 'tr':
          newCrop.y = Math.max(0, prev.y + deltaY);
          newCrop.width = prev.width + deltaX;
          newCrop.height = prev.height - deltaY;
          break;
        
        case 'bl':
          newCrop.x = Math.max(0, prev.x + deltaX);
          newCrop.width = prev.width - deltaX;
          newCrop.height = prev.height + deltaY;
          break;
        
        case 'br':
          newCrop.width = prev.width + deltaX;
          newCrop.height = prev.height + deltaY;
          break;
      }

      // Maintain minimum size
      newCrop.width = Math.max(100, newCrop.width);
      newCrop.height = Math.max(100, newCrop.height);

      // Maintain card aspect ratio for corner handles
      if (dragHandle !== 'move') {
        if (dragHandle?.includes('r')) {
          newCrop.height = newCrop.width / CARD_ASPECT_RATIO;
        } else {
          newCrop.width = newCrop.height * CARD_ASPECT_RATIO;
        }
      }

      // Ensure within bounds
      newCrop.width = Math.min(newCrop.width, img.clientWidth - newCrop.x);
      newCrop.height = Math.min(newCrop.height, img.clientHeight - newCrop.y);

      return newCrop;
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragHandle, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

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

  // Extract the cropped area
  const extractCrop = useCallback(async () => {
    if (!imageRef.current || !imageLoaded) {
      toast.error('Image not ready');
      return;
    }

    setExtracting(true);
    
    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Calculate scale factors
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      // Convert display coordinates to natural image coordinates
      const sourceX = cropArea.x * scaleX;
      const sourceY = cropArea.y * scaleY;
      const sourceWidth = cropArea.width * scaleX;
      const sourceHeight = cropArea.height * scaleY;

      // Set canvas to high quality card dimensions
      const outputWidth = Math.min(600, sourceWidth);  // Good quality for cards
      const outputHeight = Math.min(840, sourceHeight); // Maintain aspect ratio
      
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Draw the cropped area
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, outputWidth, outputHeight
      );

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          onCropComplete(croppedUrl);
          toast.success('Perfect crop extracted for your card!');
        }
      }, 'image/jpeg', 0.95);

    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to extract crop');
    } finally {
      setExtracting(false);
    }
  }, [cropArea, imageLoaded, onCropComplete]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetCrop = () => {
    if (imageRef.current) {
      detectInitialCrop(imageRef.current);
      toast.success('Crop area reset');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Crop Controls */}
      <div className="flex items-center gap-3 flex-wrap bg-crd-darker p-4 rounded-lg border border-crd-mediumGray/30">
        <CRDButton
          onClick={autoFitCard}
          variant="outline"
          size="sm"
          disabled={!imageLoaded}
          className="border-crd-green/50 text-crd-green hover:bg-crd-green/10"
        >
          <Target className="w-4 h-4 mr-2" />
          Auto-Fit Card
        </CRDButton>
        
        <div className="flex items-center gap-1">
          <CRDButton
            onClick={handleZoomOut}
            variant="ghost"
            size="sm"
            disabled={!imageLoaded}
          >
            <ZoomOut className="w-4 h-4" />
          </CRDButton>
          <span className="text-crd-lightGray text-sm px-2">{Math.round(zoom * 100)}%</span>
          <CRDButton
            onClick={handleZoomIn}
            variant="ghost"
            size="sm"
            disabled={!imageLoaded}
          >
            <ZoomIn className="w-4 h-4" />
          </CRDButton>
        </div>

        <CRDButton
          onClick={resetCrop}
          variant="ghost"
          size="sm"
          disabled={!imageLoaded}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </CRDButton>

        <CRDButton
          onClick={extractCrop}
          disabled={!imageLoaded || extracting}
          className="bg-crd-green hover:bg-crd-green/90 text-crd-darkest font-medium ml-auto"
        >
          {extracting ? (
            <>
              <div className="w-4 h-4 border-2 border-crd-darkest border-t-transparent rounded-full animate-spin mr-2" />
              Extracting...
            </>
          ) : (
            <>
              <Crop className="w-4 h-4 mr-2" />
              Extract Card Crop
            </>
          )}
        </CRDButton>
      </div>

      {/* Image Cropping Area with 2.5 x 3.5 Dotted Placeholder */}
      <Card className="relative overflow-hidden bg-crd-darker border-crd-mediumGray/30">
        <CardContent className="p-0">
          <div ref={containerRef} className="relative">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop your card image"
              className="max-w-full max-h-[70vh] w-auto h-auto block mx-auto"
              style={{ transform: `scale(${zoom})` }}
              onLoad={handleImageLoad}
              draggable={false}
            />
            
            {/* Crop Overlay */}
            {imageLoaded && (
              <div className="absolute inset-0">
                {/* Darkened areas outside crop */}
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                
                {/* Dotted placeholder guide */}
                <div
                  className="absolute border-2 border-dashed border-crd-green/40 pointer-events-none"
                  style={{
                    left: cropArea.x - 10,
                    top: cropArea.y - 10,
                    width: cropArea.width + 20,
                    height: cropArea.height + 20,
                  }}
                />
                
                {/* Actual crop area */}
                <div
                  className="absolute border-2 border-crd-green cursor-move bg-transparent"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                  {/* Corner handles */}
                  {['tl', 'tr', 'bl', 'br'].map((handle) => (
                    <div
                      key={handle}
                      className="absolute w-4 h-4 bg-crd-green border-2 border-white cursor-pointer hover:bg-crd-green/80"
                      style={{
                        top: handle.includes('t') ? -8 : 'auto',
                        bottom: handle.includes('b') ? -8 : 'auto',
                        left: handle.includes('l') ? -8 : 'auto',
                        right: handle.includes('r') ? -8 : 'auto',
                        cursor: handle === 'tl' || handle === 'br' ? 'nw-resize' : 'ne-resize'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, handle)}
                    />
                  ))}
                  
                  {/* Crop info */}
                  <div className="absolute -top-8 left-0 bg-crd-green text-crd-darkest text-xs px-3 py-1 rounded font-medium">
                    Card: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                  </div>
                  
                  {/* Aspect ratio indicator */}
                  <div className="absolute -bottom-8 right-0 bg-crd-green/80 text-crd-darkest text-xs px-3 py-1 rounded font-medium">
                    2.5 × 3.5 Ratio
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center text-crd-lightGray text-sm">
        <p>Drag to move • Use corners to resize • Auto-fit for best results • Extract when ready</p>
      </div>
    </div>
  );
};
