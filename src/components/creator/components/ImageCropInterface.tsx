
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, RotateCw, Move, ZoomIn, ZoomOut, Crop, X } from 'lucide-react';

interface ImageCropInterfaceProps {
  imageUrl: string;
  onComplete: (croppedImageData: string) => void;
  onCancel: () => void;
}

export const ImageCropInterface = ({ imageUrl, onComplete, onCancel }: ImageCropInterfaceProps) => {
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '4:3' | '3:4' | '16:9'>('3:4');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCropComplete = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a new image element
    const img = new Image();
    img.onload = () => {
      // Set canvas size to match crop area
      const cropWidth = (cropArea.width / 100) * img.width;
      const cropHeight = (cropArea.height / 100) * img.height;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      // Apply transformations and draw cropped image
      ctx.save();
      ctx.translate(cropWidth / 2, cropHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom / 100, zoom / 100);
      
      const sourceX = (cropArea.x / 100) * img.width;
      const sourceY = (cropArea.y / 100) * img.height;
      
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        -cropWidth / 2,
        -cropHeight / 2,
        cropWidth,
        cropHeight
      );
      
      ctx.restore();
      
      // Convert to data URL and complete
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onComplete(croppedDataUrl);
    };
    
    img.src = imageUrl;
  }, [imageUrl, cropArea, zoom, rotation, onComplete]);

  const handleAspectRatioChange = (ratio: typeof aspectRatio) => {
    setAspectRatio(ratio);
    
    // Update crop area based on aspect ratio
    let newCropArea = { ...cropArea };
    
    switch (ratio) {
      case '1:1':
        newCropArea.width = Math.min(cropArea.width, cropArea.height);
        newCropArea.height = newCropArea.width;
        break;
      case '4:3':
        newCropArea.height = (cropArea.width * 3) / 4;
        break;
      case '3:4':
        newCropArea.width = (cropArea.height * 3) / 4;
        break;
      case '16:9':
        newCropArea.height = (cropArea.width * 9) / 16;
        break;
    }
    
    setCropArea(newCropArea);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-crd-darkest border-b border-crd-mediumGray/20 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Crop Image</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/20"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleCropComplete}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            >
              <Crop className="w-4 h-4 mr-2" />
              Apply Crop
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Crop Area */}
        <div className="flex-1 relative bg-black/50 flex items-center justify-center p-8">
          <div className="relative max-w-4xl max-h-full">
            {/* Image with crop overlay */}
            <div className="relative">
              <img
                src={imageUrl}
                alt="Crop preview"
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
                  transition: 'transform 0.2s ease'
                }}
              />
              
              {/* Crop overlay */}
              <div 
                className="absolute border-2 border-crd-green bg-crd-green/10"
                style={{
                  left: `${cropArea.x}%`,
                  top: `${cropArea.y}%`,
                  width: `${cropArea.width}%`,
                  height: `${cropArea.height}%`
                }}
              >
                {/* Crop handles */}
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-crd-green cursor-nw-resize"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green cursor-ne-resize"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-crd-green cursor-sw-resize"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-crd-green cursor-se-resize"></div>
              </div>
            </div>
          </div>
          
          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 bg-crd-darkGray border-l border-crd-mediumGray/20 p-6 space-y-6">
          {/* Aspect Ratio */}
          <Card className="bg-crd-darker border-crd-mediumGray/30 p-4">
            <h3 className="text-white font-medium mb-3">Aspect Ratio</h3>
            <div className="grid grid-cols-2 gap-2">
              {['free', '1:1', '4:3', '3:4', '16:9'].map((ratio) => (
                <Button
                  key={ratio}
                  variant={aspectRatio === ratio ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAspectRatioChange(ratio as typeof aspectRatio)}
                  className={`${
                    aspectRatio === ratio
                      ? 'bg-crd-green text-black'
                      : 'border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20'
                  }`}
                >
                  {ratio === 'free' ? 'Free' : ratio}
                </Button>
              ))}
            </div>
          </Card>

          {/* Zoom */}
          <Card className="bg-crd-darker border-crd-mediumGray/30 p-4">
            <h3 className="text-white font-medium mb-3">Zoom: {zoom}%</h3>
            <div className="space-y-3">
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={50}
                max={200}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="border-crd-mediumGray/30 text-crd-lightGray"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(100)}
                  className="border-crd-mediumGray/30 text-crd-lightGray"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  className="border-crd-mediumGray/30 text-crd-lightGray"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Rotation */}
          <Card className="bg-crd-darker border-crd-mediumGray/30 p-4">
            <h3 className="text-white font-medium mb-3">Rotation: {rotation}°</h3>
            <div className="space-y-3">
              <Slider
                value={[rotation]}
                onValueChange={([value]) => setRotation(value)}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(rotation - 90)}
                  className="border-crd-mediumGray/30 text-crd-lightGray"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(0)}
                  className="border-crd-mediumGray/30 text-crd-lightGray"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(rotation + 90)}
                  className="border-crd-mediumGray/30 text-crd-lightGray"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-crd-darker border-crd-mediumGray/30 p-4">
            <h3 className="text-white font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setZoom(100);
                  setRotation(0);
                  setCropArea({ x: 10, y: 10, width: 80, height: 80 });
                }}
                className="w-full border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20"
              >
                Reset All
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
