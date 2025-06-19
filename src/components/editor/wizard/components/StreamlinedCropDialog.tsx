
import React, { useState, useRef, useCallback } from 'react';
import { X, Grid3X3, ZoomIn, ZoomOut, RotateCw, Check, Square, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cropImageFromFile } from '@/services/imageCropper';
import type { CropBounds } from '@/services/imageCropper';

interface StreamlinedCropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhoto: string;
  originalFile: File | null;
  onCropComplete: (croppedImageUrl: string) => void;
  initialFormat?: 'fullCard' | 'cropped';
}

export const StreamlinedCropDialog = ({
  isOpen,
  onClose,
  selectedPhoto,
  originalFile,
  onCropComplete,
  initialFormat = 'fullCard'
}: StreamlinedCropDialogProps) => {
  const [cropFormat, setCropFormat] = useState<'fullCard' | 'cropped'>(initialFormat);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [cropBounds, setCropBounds] = useState<CropBounds>({ x: 10, y: 10, width: 80, height: 80 });

  const imageRef = useRef<HTMLImageElement>(null);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80">
      {/* Streamlined Header */}
      <div className="h-16 bg-crd-darkGray border-b border-crd-mediumGray/30 flex items-center justify-between px-6">
        <h1 className="text-white text-xl font-semibold">Crop & Position</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleApplyCrop}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-4rem)] flex">
        {/* Main Crop Area */}
        <div className="flex-1 flex flex-col">
          {/* Essential Toolbar Only */}
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
                Full Card
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
                Cropped
              </button>
            </div>

            {/* Essential Controls */}
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
                Grid
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
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-crd-darker p-8 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative max-w-full max-h-full">
                <img
                  ref={imageRef}
                  src={selectedPhoto}
                  alt="Crop preview"
                  className="max-w-full max-h-full object-contain"
                  style={{ transform: `scale(${zoom})` }}
                />

                {/* Grid Overlay */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border border-white/20 grid grid-cols-3 grid-rows-3">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="border border-white/10" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Simplified Crop Overlay */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div
                  className="absolute border-2 border-crd-green bg-transparent"
                  style={{
                    left: `${cropBounds.x}%`,
                    top: `${cropBounds.y}%`,
                    width: `${cropBounds.width}%`,
                    height: `${cropBounds.height}%`,
                    borderRadius: cropFormat === 'cropped' ? '8px' : '4px'
                  }}
                >
                  <div className="absolute -top-8 left-0 bg-crd-green text-black text-xs px-2 py-1 rounded-md font-medium">
                    {cropFormat === 'fullCard' ? '2.5:3.5' : 'Square'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Sidebar */}
        <div className="w-72 bg-crd-darkGray border-l border-crd-mediumGray/30 p-6 space-y-6">
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

          {/* Format Info */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3">Format Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-crd-lightGray">
                  <span>Type:</span>
                  <span>{cropFormat === 'fullCard' ? 'Full Card' : 'Cropped Square'}</span>
                </div>
                <div className="flex justify-between text-crd-lightGray">
                  <span>Aspect Ratio:</span>
                  <span>{cropFormat === 'fullCard' ? '2.5:3.5' : '1:1'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
