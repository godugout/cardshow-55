
import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Crop, RotateCcw, RotateCw, ZoomIn, ZoomOut, Move, Square, Circle, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cropImageFromFile } from '@/services/imageCropper';
import type { CropBounds } from '@/services/imageCropper';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface EnhancedPhotoEditSectionProps {
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  imageFormat: 'square' | 'circle' | 'fullBleed';
  onPhotoSelect: (photo: string) => void;
  onPhotoRemove: () => void;
  onImageFormatChange: (format: 'square' | 'circle' | 'fullBleed') => void;
  isAnalyzing?: boolean;
}

export const EnhancedPhotoEditSection = ({
  selectedPhoto,
  selectedTemplate,
  imageFormat,
  onPhotoSelect,
  onPhotoRemove,
  onImageFormatChange,
  isAnalyzing = false
}: EnhancedPhotoEditSectionProps) => {
  const [editMode, setEditMode] = useState(false);
  const [cropBounds, setCropBounds] = useState<CropBounds>({ x: 0, y: 0, width: 100, height: 140 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: editMode,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setOriginalFile(file);
        const imageUrl = URL.createObjectURL(file);
        onPhotoSelect(imageUrl);
        setEditMode(true);
        
        // Set smart default crop based on template and format
        setSmartDefaultCrop();
        toast.success('Photo uploaded! Use the tools below to edit.');
      }
    }
  });

  const setSmartDefaultCrop = useCallback(() => {
    if (!selectedTemplate) return;
    
    // Get template's adaptive layout for current format
    const adaptiveLayout = selectedTemplate.template_data?.adaptiveLayout?.[imageFormat];
    if (adaptiveLayout?.imagePosition) {
      const pos = adaptiveLayout.imagePosition;
      setCropBounds({
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height
      });
    } else {
      // Default crop based on format
      switch (imageFormat) {
        case 'square':
          setCropBounds({ x: 15, y: 15, width: 70, height: 70 });
          break;
        case 'circle':
          setCropBounds({ x: 20, y: 20, width: 60, height: 60 });
          break;
        case 'fullBleed':
        default:
          setCropBounds({ x: 0, y: 0, width: 100, height: 100 });
          break;
      }
    }
  }, [selectedTemplate, imageFormat]);

  const handleCropApply = async () => {
    if (!originalFile) return;
    
    try {
      const croppedImageUrl = await cropImageFromFile(originalFile, {
        bounds: {
          x: (cropBounds.x / 100) * (imageRef.current?.naturalWidth || 1),
          y: (cropBounds.y / 100) * (imageRef.current?.naturalHeight || 1),
          width: (cropBounds.width / 100) * (imageRef.current?.naturalWidth || 1),
          height: (cropBounds.height / 100) * (imageRef.current?.naturalHeight || 1)
        },
        outputWidth: 400,
        outputHeight: 560,
        quality: 0.9
      });
      
      onPhotoSelect(croppedImageUrl);
      toast.success('Crop applied successfully!');
    } catch (error) {
      toast.error('Failed to apply crop');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;
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

  const formats = [
    { id: 'fullBleed' as const, name: 'Full', icon: Maximize },
    { id: 'square' as const, name: 'Square', icon: Square },
    { id: 'circle' as const, name: 'Circle', icon: Circle }
  ];

  if (!selectedPhoto) {
    return (
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-crd-green bg-crd-green/10'
                : 'border-crd-mediumGray hover:border-crd-green/50'
            }`}
          >
            <input {...getInputProps()} />
            <Camera className="w-12 h-12 mx-auto mb-4 text-crd-lightGray" />
            <h3 className="text-white text-lg font-medium mb-2">
              {isDragActive ? 'Drop your photo here' : 'Upload Your Photo'}
            </h3>
            <p className="text-crd-lightGray mb-4">
              Drag and drop your image here, or click to browse
            </p>
            <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold">
              <Camera className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-crd-darkGray border-crd-mediumGray/30">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Edit Photo</h3>
            <p className="text-crd-lightGray text-sm">Crop and adjust your image</p>
          </div>
          <div className="flex items-center gap-2">
            {isAnalyzing && (
              <Badge className="bg-crd-blue/20 text-crd-blue">
                AI Analyzing...
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('photo-input')?.click()}
              className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change
            </Button>
          </div>
        </div>

        {/* Image Format Selector */}
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm">Image Format</h4>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((format) => {
              const Icon = format.icon;
              const isSelected = imageFormat === format.id;
              
              return (
                <Button
                  key={format.id}
                  onClick={() => {
                    onImageFormatChange(format.id);
                    setSmartDefaultCrop();
                  }}
                  variant="outline"
                  className={`h-auto p-3 flex flex-col items-center gap-2 ${
                    isSelected 
                      ? 'bg-crd-blue/20 border-crd-blue text-crd-blue' 
                      : 'bg-crd-mediumGray/20 border-crd-mediumGray/50 text-crd-lightGray hover:bg-crd-mediumGray/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{format.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Image Preview with Crop Overlay */}
        <div className="space-y-4">
          <div 
            ref={containerRef}
            className="relative w-full aspect-[4/3] bg-crd-mediumGray/20 rounded-lg overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={selectedPhoto}
              alt="Edit preview"
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`
              }}
            />
            
            {/* Crop Overlay */}
            {editMode && (
              <>
                {/* Darkened areas outside crop */}
                <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                
                {/* Crop area */}
                <div
                  className="absolute border-2 border-crd-green bg-transparent pointer-events-none"
                  style={{
                    left: `${cropBounds.x}%`,
                    top: `${cropBounds.y}%`,
                    width: `${cropBounds.width}%`,
                    height: `${cropBounds.height}%`,
                    borderRadius: imageFormat === 'circle' ? '50%' : '4px'
                  }}
                >
                  {/* Corner handles */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-crd-green rounded-full" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green rounded-full" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-crd-green rounded-full" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-crd-green rounded-full" />
                </div>
                
                {/* Grid lines */}
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    left: `${cropBounds.x}%`,
                    top: `${cropBounds.y}%`,
                    width: `${cropBounds.width}%`,
                    height: `${cropBounds.height}%`
                  }}
                >
                  <div className="w-full h-full border border-white/30 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/20" />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Edit Controls */}
          {editMode && (
            <div className="space-y-4">
              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Zoom</span>
                  <span className="text-crd-lightGray text-sm">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setRotation(rotation - 90)}
                  className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
                
                <Button
                  onClick={handleCropApply}
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold flex-1"
                >
                  <Crop className="w-4 h-4 mr-2" />
                  Apply Crop
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Edit Mode */}
        {!editMode && (
          <Button
            onClick={() => setEditMode(true)}
            className="w-full bg-crd-blue hover:bg-crd-blue/90 text-white"
          >
            <Crop className="w-4 h-4 mr-2" />
            Edit Photo
          </Button>
        )}

        {/* Hidden file input */}
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              setOriginalFile(file);
              const imageUrl = URL.createObjectURL(file);
              onPhotoSelect(imageUrl);
              setEditMode(true);
              setSmartDefaultCrop();
            }
            e.target.value = '';
          }}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
