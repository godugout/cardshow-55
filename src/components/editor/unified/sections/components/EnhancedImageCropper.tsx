import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors, Square, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  className?: string;
}

export const EnhancedImageCropper: React.FC<EnhancedImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  aspectRatio = 5/7, // Standard trading card ratio
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 300,
    height: 420
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load and display image on canvas
  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = img.src;
      }

      // Set canvas size to image size (with max constraints)
      const maxWidth = 600;
      const maxHeight = 800;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx?.drawImage(img, 0, 0, width, height);

      // Initialize crop area to center with proper aspect ratio
      const cropWidth = Math.min(width * 0.8, 300);
      const cropHeight = cropWidth / aspectRatio;
      
      setCropArea({
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });

      setImageLoaded(true);
      drawCropOverlay(ctx, {
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      }, width, height);
    };

    img.src = imageUrl;
  }, [imageUrl, aspectRatio]);

  const drawCropOverlay = useCallback((ctx: CanvasRenderingContext2D | null, crop: typeof cropArea, canvasWidth: number, canvasHeight: number) => {
    if (!ctx) return;

    // Clear and redraw the original image first
    const img = imageRef.current;
    if (img) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    }

    // Draw dark overlay over entire canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Clear the crop area to show original image (create transparent window)
    ctx.clearRect(crop.x, crop.y, crop.width, crop.height);
    
    // Draw crop border
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

    // Draw corner handles
    ctx.fillStyle = '#4ade80';
    ctx.setLineDash([]);
    const handleSize = 8;
    
    // Corner handles
    [
      [crop.x - handleSize/2, crop.y - handleSize/2],
      [crop.x + crop.width - handleSize/2, crop.y - handleSize/2],
      [crop.x - handleSize/2, crop.y + crop.height - handleSize/2],
      [crop.x + crop.width - handleSize/2, crop.y + crop.height - handleSize/2]
    ].forEach(([x, y]) => {
      ctx.fillRect(x, y, handleSize, handleSize);
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    setCropArea(prev => {
      const newX = Math.max(0, Math.min(prev.x + deltaX, canvas.width - prev.width));
      const newY = Math.max(0, Math.min(prev.y + deltaY, canvas.height - prev.height));
      
      const newCrop = { ...prev, x: newX, y: newY };
      drawCropOverlay(ctx, newCrop, canvas.width, canvas.height);
      return newCrop;
    });

    setDragStart({ x, y });
  }, [isDragging, dragStart, drawCropOverlay]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleAutoFit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width: canvasWidth, height: canvasHeight } = canvas;

    // Calculate optimal crop size maintaining aspect ratio
    const maxWidth = canvasWidth * 0.9;
    const maxHeight = canvasHeight * 0.9;
    
    let cropWidth = maxWidth;
    let cropHeight = cropWidth / aspectRatio;

    if (cropHeight > maxHeight) {
      cropHeight = maxHeight;
      cropWidth = cropHeight * aspectRatio;
    }

    const newCrop = {
      x: (canvasWidth - cropWidth) / 2,
      y: (canvasHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight
    };

    setCropArea(newCrop);
    drawCropOverlay(ctx, newCrop, canvasWidth, canvasHeight);
    toast.success('Auto-fitted to optimal card size!');
  }, [aspectRatio, drawCropOverlay]);

  const handleExtractCrop = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    
    // Set crop canvas to standard card dimensions
    cropCanvas.width = 300;
    cropCanvas.height = 420;

    if (cropCtx) {
      // Calculate scale factors
      const scaleX = img.naturalWidth / canvas.width;
      const scaleY = img.naturalHeight / canvas.height;

      // Draw cropped portion scaled to final size
      cropCtx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0, 0,
        cropCanvas.width,
        cropCanvas.height
      );

      // Convert to blob and create URL
      cropCanvas.toBlob((blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          onCropComplete(croppedUrl);
          toast.success('Perfect crop extracted!');
        }
      }, 'image/jpeg', 0.9);
    }
  }, [cropArea, onCropComplete]);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Canvas Container */}
            <div className="flex justify-center">
              <div className="relative border border-crd-mediumGray/30 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="cursor-move max-w-full max-h-96"
                  style={{ display: imageLoaded ? 'block' : 'none' }}
                />
                {!imageLoaded && (
                  <div className="w-96 h-64 flex items-center justify-center bg-crd-mediumGray/20">
                    <p className="text-crd-lightGray">Loading image...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleAutoFit}
                className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <Square className="w-4 h-4 mr-2" />
                Auto-Fit Card
              </Button>
              
              <Button
                variant="default"
                onClick={handleExtractCrop}
                disabled={!imageLoaded}
              >
                <Scissors className="w-4 h-4 mr-2" />
                Extract Crop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden image element for calculations */}
      <img ref={imageRef} className="hidden" alt="" />
    </div>
  );
};
