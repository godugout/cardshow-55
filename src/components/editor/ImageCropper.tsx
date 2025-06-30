
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Crop, Target, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  aspectRatio = 2.5 / 3.5, // Default to trading card ratio
  className = ''
}) => {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize crop area centered and sized for card aspect ratio
  const initializeCropArea = useCallback(() => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;
    
    // Calculate optimal crop size maintaining aspect ratio
    let cropWidth = Math.min(displayWidth * 0.7, displayHeight * aspectRatio * 0.7);
    let cropHeight = cropWidth / aspectRatio;
    
    // Adjust if height exceeds bounds
    if (cropHeight > displayHeight * 0.8) {
      cropHeight = displayHeight * 0.8;
      cropWidth = cropHeight * aspectRatio;
    }
    
    // Center the crop
    const x = (displayWidth - cropWidth) / 2;
    const y = (displayHeight - cropHeight) / 2;
    
    setCropArea({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: cropWidth,
      height: cropHeight
    });
  }, [aspectRatio]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    initializeCropArea();
  }, [initializeCropArea]);

  // Auto-fit to maximize crop area
  const handleAutoFit = useCallback(() => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;
    
    // Maximize area while maintaining aspect ratio
    let cropWidth = displayWidth * 0.9;
    let cropHeight = cropWidth / aspectRatio;
    
    if (cropHeight > displayHeight * 0.9) {
      cropHeight = displayHeight * 0.9;
      cropWidth = cropHeight * aspectRatio;
    }
    
    const x = (displayWidth - cropWidth) / 2;
    const y = (displayHeight - cropHeight) / 2;
    
    setCropArea({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: cropWidth,
      height: cropHeight
    });
    
    toast.success('Auto-fitted to optimal size');
  }, [aspectRatio]);

  // Mouse event handlers
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
        
        case 'br':
          newCrop.width = prev.width + deltaX;
          newCrop.height = newCrop.width / aspectRatio;
          break;
      }

      // Maintain minimum size
      newCrop.width = Math.max(80, newCrop.width);
      newCrop.height = Math.max(80, newCrop.height);

      // Ensure within bounds
      newCrop.width = Math.min(newCrop.width, img.clientWidth - newCrop.x);
      newCrop.height = Math.min(newCrop.height, img.clientHeight - newCrop.y);

      return newCrop;
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragHandle, dragStart, aspectRatio]);

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

  // Process the crop
  const handleCropConfirm = useCallback(async () => {
    if (!imageRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');

      // Standard card output dimensions
      canvas.width = 300;
      canvas.height = 420;

      // Calculate source coordinates
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;
      
      const sourceX = cropArea.x * scaleX;
      const sourceY = cropArea.y * scaleY;
      const sourceWidth = cropArea.width * scaleX;
      const sourceHeight = cropArea.height * scaleY;

      // Draw cropped image
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, canvas.width, canvas.height
      );

      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCropComplete(croppedImageUrl);
      
    } catch (error) {
      console.error('Crop failed:', error);
      toast.error('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  }, [cropArea, onCropComplete, isProcessing]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoFit}
          className="border-gray-600 text-white"
        >
          <Target className="w-4 h-4 mr-2" />
          Auto-Fit
        </Button>
        
        <div className="text-gray-400 text-sm">
          {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
        </div>
      </div>

      {/* Crop Canvas */}
      <div 
        ref={containerRef}
        className="relative mx-auto bg-gray-800 rounded-lg overflow-hidden border border-gray-600"
        style={{ 
          maxWidth: '500px',
          aspectRatio: aspectRatio.toString()
        }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Crop source"
          className="w-full h-full object-contain"
          onLoad={handleImageLoad}
          draggable={false}
        />
        
        {imageLoaded && (
          <>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none" />
            
            {/* Crop Area */}
            <div
              className="absolute border-2 border-green-500 bg-transparent cursor-move"
              style={{
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height,
              }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
              {/* Resize handle */}
              <div
                className="absolute w-3 h-3 bg-green-500 border border-white -bottom-1 -right-1 cursor-se-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'br');
                }}
              />
              
              {/* Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-50">
                <div className="w-full h-full border border-green-400" />
                <div className="absolute top-1/3 left-0 right-0 border-t border-green-400" />
                <div className="absolute top-2/3 left-0 right-0 border-t border-green-400" />
                <div className="absolute left-1/3 top-0 bottom-0 border-l border-green-400" />
                <div className="absolute left-2/3 top-0 bottom-0 border-l border-green-400" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirm Button */}
      <div className="text-center">
        <Button
          onClick={handleCropConfirm}
          disabled={!imageLoaded || isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Crop className="w-4 h-4 mr-2" />
              Confirm Crop
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
