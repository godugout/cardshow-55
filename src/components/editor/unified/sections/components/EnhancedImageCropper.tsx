
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
const CANVAS_MAX_WIDTH = 400;
const CANVAS_MAX_HEIGHT = 560; // Maintains card aspect ratio

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

  // Calculate optimal canvas size based on image and card proportions
  const getOptimalCanvasSize = useCallback((img: HTMLImageElement) => {
    const imageAspectRatio = img.naturalWidth / img.naturalHeight;
    
    let canvasWidth, canvasHeight;
    
    if (imageAspectRatio > CARD_ASPECT_RATIO) {
      // Image is wider than card - fit to height
      canvasHeight = Math.min(CANVAS_MAX_HEIGHT, img.naturalHeight * 0.8);
      canvasWidth = canvasHeight * CARD_ASPECT_RATIO;
    } else {
      // Image is taller than card - fit to width
      canvasWidth = Math.min(CANVAS_MAX_WIDTH, img.naturalWidth * 0.8);
      canvasHeight = canvasWidth / CARD_ASPECT_RATIO;
    }
    
    return { width: canvasWidth, height: canvasHeight };
  }, []);

  // Center and size crop area to card dimensions
  const initializeCropArea = useCallback((img: HTMLImageElement) => {
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;
    
    // Calculate crop size that matches card aspect ratio
    const maxCropSize = Math.min(displayWidth * 0.8, displayHeight * 0.8);
    let cropWidth = maxCropSize;
    let cropHeight = cropWidth / CARD_ASPECT_RATIO;
    
    // Adjust if height exceeds display bounds
    if (cropHeight > displayHeight * 0.8) {
      cropHeight = displayHeight * 0.8;
      cropWidth = cropHeight * CARD_ASPECT_RATIO;
    }
    
    // Center the crop area
    const x = (displayWidth - cropWidth) / 2;
    const y = (displayHeight - cropHeight) / 2;
    
    setCropArea({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: cropWidth,
      height: cropHeight
    });
  }, []);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      initializeCropArea(imageRef.current);
      setImageLoaded(true);
    }
  }, [initializeCropArea]);

  // Auto-fit to card edges
  const autoFitCard = useCallback(() => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;
    
    // Maximize crop area while maintaining card aspect ratio
    let cropWidth = displayWidth * 0.9;
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
      width: cropWidth,
      height: cropHeight
    });
    
    toast.success('Auto-fitted to card edges');
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
        newCrop.height = newCrop.width / CARD_ASPECT_RATIO;
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
    if (!imageRef.current || extracting) return;

    setExtracting(true);
    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');

      // Set canvas to standard card dimensions
      canvas.width = 300;
      canvas.height = 420;

      // Calculate source coordinates relative to natural image size
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;
      
      const sourceX = cropArea.x * scaleX;
      const sourceY = cropArea.y * scaleY;
      const sourceWidth = cropArea.width * scaleX;
      const sourceHeight = cropArea.height * scaleY;

      // Draw the cropped area
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, canvas.width, canvas.height
      );

      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCropComplete(croppedImageUrl);
      
      toast.success('Card crop extracted successfully!');
    } catch (error) {
      console.error('Crop extraction failed:', error);
      toast.error('Failed to extract crop');
    } finally {
      setExtracting(false);
    }
  }, [cropArea, extracting, onCropComplete]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <CRDButton
            variant="outline"
            size="sm"
            onClick={autoFitCard}
            className="border-crd-mediumGray text-crd-lightGray hover:text-white"
          >
            <Target className="w-4 h-4 mr-1" />
            Auto-Fit Card
          </CRDButton>
        </div>
        
        <div className="text-crd-lightGray text-sm">
          Card Aspect: {CARD_ASPECT_RATIO.toFixed(3)} | Size: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
        </div>
      </div>

      {/* Cropping Canvas */}
      <div 
        ref={containerRef}
        className="relative mx-auto border-2 border-crd-mediumGray rounded-lg overflow-hidden bg-crd-darkGray"
        style={{
          maxWidth: CANVAS_MAX_WIDTH,
          maxHeight: CANVAS_MAX_HEIGHT,
          aspectRatio: CARD_ASPECT_RATIO.toString()
        }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Crop preview"
          className="w-full h-full object-contain"
          onLoad={handleImageLoad}
          draggable={false}
        />
        
        {/* Crop Overlay */}
        {imageLoaded && (
          <>
            {/* Darkened areas outside crop */}
            <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />
            
            {/* Crop area */}
            <div
              className="absolute border-2 border-crd-green bg-transparent cursor-move"
              style={{
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height,
              }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
              {/* Corner handles */}
              <div
                className="absolute w-3 h-3 bg-crd-green border border-white -top-1 -left-1 cursor-nw-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'tl');
                }}
              />
              <div
                className="absolute w-3 h-3 bg-crd-green border border-white -top-1 -right-1 cursor-ne-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'tr');
                }}
              />
              <div
                className="absolute w-3 h-3 bg-crd-green border border-white -bottom-1 -left-1 cursor-sw-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'bl');
                }}
              />
              <div
                className="absolute w-3 h-3 bg-crd-green border border-white -bottom-1 -right-1 cursor-se-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'br');
                }}
              />
              
              {/* Grid lines for better alignment */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-crd-green border-opacity-30" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Instructions overlay */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              Drag to move • Corners to resize • Maintains card ratio
            </div>
          </>
        )}
      </div>

      {/* Extract Button */}
      <div className="text-center">
        <CRDButton
          onClick={extractCrop}
          disabled={!imageLoaded || extracting}
          className="bg-crd-green hover:bg-crd-green/90 text-black min-w-32"
        >
          {extracting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full mr-2" />
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
    </div>
  );
};
