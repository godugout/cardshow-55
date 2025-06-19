
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Grid3X3, ZoomIn, ZoomOut, RotateCw, Lock, Unlock, Check, Square, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cropImageFromFile } from '@/services/imageCropper';
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
  const [cropShape, setCropShape] = useState<'square' | 'circle'>('square');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [cropBounds, setCropBounds] = useState<CropBounds>({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set smart default crop based on format
  useEffect(() => {
    if (cropFormat === 'fullCard') {
      setCropBounds({ x: 0, y: 0, width: 100, height: 100 });
      setAspectRatioLocked(true);
    } else {
      setCropBounds({ x: 15, y: 15, width: 70, height: 70 });
      setAspectRatioLocked(cropShape === 'square');
    }
  }, [cropFormat, cropShape]);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setCropBounds(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100 - prev.width, prev.x + deltaX)),
      y: Math.max(0, Math.min(100 - prev.height, prev.y + deltaY))
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  const aspectRatio = cropFormat === 'fullCard' ? 2.5 / 3.5 : 1;
  const cropWidth = Math.round((cropBounds.width / 100) * (imageRef.current?.naturalWidth || 1));
  const cropHeight = Math.round((cropBounds.height / 100) * (imageRef.current?.naturalHeight || 1));

  return (
    <div className="fixed inset-0 z-[100] bg-black/80">
      {/* Header */}
      <div className="h-16 bg-crd-darkGray border-b border-crd-mediumGray/30 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-xl font-semibold">Crop & Position</h1>
          <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
            {cropFormat === 'fullCard' ? 'Full Card' : `Cropped ${cropShape}`}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleApplyCrop}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-crd-lightGray hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-4rem)] flex">
        {/* Main Crop Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-16 bg-crd-mediumGray/20 border-b border-crd-mediumGray/30 flex items-center justify-between px-6">
            {/* Format Selection */}
            <div className="flex items-center gap-2">
              <span className="text-crd-lightGray text-sm">Format:</span>
              <div className="flex bg-crd-darkGray rounded-lg p-1">
                <button
                  onClick={() => setCropFormat('fullCard')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    cropFormat === 'fullCard'
                      ? 'bg-crd-green text-black font-medium'
                      : 'text-crd-lightGray hover:text-white'
                  }`}
                >
                  <Maximize className="w-4 h-4 mr-1 inline" />
                  Full Card
                </button>
                <button
                  onClick={() => setCropFormat('cropped')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    cropFormat === 'cropped'
                      ? 'bg-crd-green text-black font-medium'
                      : 'text-crd-lightGray hover:text-white'
                  }`}
                >
                  <Square className="w-4 h-4 mr-1 inline" />
                  Cropped
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Grid Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={`${
                  showGrid
                    ? 'bg-crd-blue/20 border-crd-blue text-crd-blue'
                    : 'border-crd-mediumGray text-crd-lightGray'
                }`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="border-crd-mediumGray text-crd-lightGray"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-crd-lightGray text-sm w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                  className="border-crd-mediumGray text-crd-lightGray"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Rotation */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation(rotation + 90)}
                className="border-crd-mediumGray text-crd-lightGray"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-crd-darker p-8 overflow-hidden">
            <div
              ref={containerRef}
              className="relative w-full h-full flex items-center justify-center"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="relative max-w-full max-h-full">
                <img
                  ref={imageRef}
                  src={selectedPhoto}
                  alt="Crop preview"
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`
                  }}
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

                {/* Crop Overlay */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div
                  className="absolute border-2 border-crd-green bg-transparent cursor-move"
                  style={{
                    left: `${cropBounds.x}%`,
                    top: `${cropBounds.y}%`,
                    width: `${cropBounds.width}%`,
                    height: `${cropBounds.height}%`,
                    borderRadius: cropShape === 'circle' && cropFormat === 'cropped' ? '50%' : '4px'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {/* Corner handles */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-crd-green rounded-full border-2 border-white cursor-nw-resize" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green rounded-full border-2 border-white cursor-ne-resize" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-crd-green rounded-full border-2 border-white cursor-sw-resize" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-crd-green rounded-full border-2 border-white cursor-se-resize" />

                  {/* Crop label */}
                  <div className="absolute -top-8 left-0 bg-crd-green text-black text-xs px-2 py-1 rounded-md font-medium flex items-center gap-2">
                    {aspectRatioLocked && <Lock className="w-3 h-3" />}
                    {cropFormat === 'fullCard' ? '2.5:3.5' : cropShape}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-crd-darkGray border-l border-crd-mediumGray/30 p-6 space-y-6">
          {/* Crop Info */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3">Crop Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-crd-lightGray">
                  <span>Dimensions:</span>
                  <span>{cropWidth} × {cropHeight}px</span>
                </div>
                <div className="flex justify-between text-crd-lightGray">
                  <span>Aspect Ratio:</span>
                  <span>{cropFormat === 'fullCard' ? '2.5:3.5' : '1:1'}</span>
                </div>
                <div className="flex justify-between text-crd-lightGray">
                  <span>Format:</span>
                  <span>{cropFormat === 'fullCard' ? 'Full Card' : `Cropped ${cropShape}`}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shape Selection (for cropped format) */}
          {cropFormat === 'cropped' && (
            <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
              <CardContent className="p-4">
                <h3 className="text-white font-medium mb-3">Crop Shape</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCropShape('square')}
                    className={`p-3 rounded-lg border transition-colors ${
                      cropShape === 'square'
                        ? 'border-crd-green bg-crd-green/20'
                        : 'border-crd-mediumGray bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40'
                    }`}
                  >
                    <Square className="w-6 h-6 mx-auto mb-1 text-white" />
                    <span className="text-xs text-white">Square</span>
                  </button>
                  <button
                    onClick={() => setCropShape('circle')}
                    className={`p-3 rounded-lg border transition-colors ${
                      cropShape === 'circle'
                        ? 'border-crd-green bg-crd-green/20'
                        : 'border-crd-mediumGray bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-white mx-auto mb-1" />
                    <span className="text-xs text-white">Circle</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

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
              <div className="flex justify-between text-xs text-crd-lightGray mt-2">
                <span>50%</span>
                <span>300%</span>
              </div>
            </CardContent>
          </Card>

          {/* Aspect Ratio Lock */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-4">
              <button
                onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                className={`w-full p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  aspectRatioLocked
                    ? 'border-crd-green bg-crd-green/20 text-crd-green'
                    : 'border-crd-mediumGray text-crd-lightGray hover:border-crd-green/50'
                }`}
              >
                {aspectRatioLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {aspectRatioLocked ? 'Ratio Locked' : 'Ratio Unlocked'}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
