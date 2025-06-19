import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, ZoomIn, ZoomOut, Move, RotateCw, Crop } from 'lucide-react';
import { toast } from 'sonner';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface CropPositionStepProps {
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  onCropComplete: (croppedImage: string) => void;
  initialCrop?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scale: number;
  };
}

export const CropPositionStep = ({
  selectedPhoto,
  selectedTemplate,
  onCropComplete,
  initialCrop
}: CropPositionStepProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cropSettings, setCropSettings] = useState({
    x: initialCrop?.x || 0,
    y: initialCrop?.y || 0,
    width: initialCrop?.width || 100,
    height: initialCrop?.height || 100,
    rotation: initialCrop?.rotation || 0,
    scale: initialCrop?.scale || 1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (selectedPhoto) {
      const img = new Image();
      img.onload = () => setImageElement(img);
      img.src = selectedPhoto;
    }
  }, [selectedPhoto]);

  useEffect(() => {
    if (canvasRef.current && imageElement && selectedTemplate) {
      drawCanvas();
    }
  }, [cropSettings, imageElement, selectedTemplate]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageElement || !selectedTemplate) return;

    console.log('Drawing canvas with template:', selectedTemplate);

    // Set canvas size to match template dimensions
    const scaleFactor = 2; // Higher resolution for better quality
    canvas.width = 300 * scaleFactor;
    canvas.height = 420 * scaleFactor;
    canvas.style.width = '300px';
    canvas.style.height = '420px';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw template background
    const { colors } = selectedTemplate.template_data;
    ctx.fillStyle = colors?.background || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context for transformations
    ctx.save();

    // Calculate image region within template - handle both old and new template structures
    let imageRegion;
    
    // Try new structure first (elements)
    if (selectedTemplate.template_data.elements?.image) {
      const imageEl = selectedTemplate.template_data.elements.image;
      imageRegion = {
        x: imageEl.position?.x || 20,
        y: imageEl.position?.y || 70,
        width: imageEl.position?.width || 260,
        height: imageEl.position?.height || 180
      };
    }
    // Fallback to old structure (regions) if it exists
    else if (selectedTemplate.template_data.regions?.image) {
      imageRegion = selectedTemplate.template_data.regions.image;
    }
    // Default fallback
    else {
      imageRegion = { x: 20, y: 70, width: 260, height: 180 };
    }

    console.log('Using image region:', imageRegion);

    const regionX = imageRegion.x * scaleFactor;
    const regionY = imageRegion.y * scaleFactor;
    const regionWidth = imageRegion.width * scaleFactor;
    const regionHeight = imageRegion.height * scaleFactor;

    // Clip to image region
    ctx.beginPath();
    ctx.rect(regionX, regionY, regionWidth, regionHeight);
    ctx.clip();

    // Apply transformations
    const centerX = regionX + regionWidth / 2;
    const centerY = regionY + regionHeight / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((cropSettings.rotation * Math.PI) / 180);
    ctx.scale(cropSettings.scale, cropSettings.scale);
    ctx.translate(-centerX, -centerY);

    // Draw image with crop settings
    const sourceX = (cropSettings.x / 100) * imageElement.width;
    const sourceY = (cropSettings.y / 100) * imageElement.height;
    const sourceWidth = (cropSettings.width / 100) * imageElement.width;
    const sourceHeight = (cropSettings.height / 100) * imageElement.height;

    ctx.drawImage(
      imageElement,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      regionX,
      regionY,
      regionWidth,
      regionHeight
    );

    ctx.restore();

    // Draw template overlay elements
    drawTemplateOverlay(ctx, scaleFactor);
  };

  const drawTemplateOverlay = (ctx: CanvasRenderingContext2D, scaleFactor: number) => {
    if (!selectedTemplate) return;

    const { colors } = selectedTemplate.template_data;

    // Handle both old and new template structures for title/text areas
    let titleRegion;
    
    // Try new structure first (elements)
    if (selectedTemplate.template_data.elements?.title) {
      const titleEl = selectedTemplate.template_data.elements.title;
      titleRegion = {
        x: titleEl.position?.x || 10,
        y: titleEl.position?.y || 10,
        width: 280,
        height: 30
      };
    }
    // Fallback to old structure (regions)
    else if (selectedTemplate.template_data.regions?.title || selectedTemplate.template_data.regions?.playerName) {
      titleRegion = selectedTemplate.template_data.regions.title || selectedTemplate.template_data.regions.playerName;
    }

    // Draw title area if it exists
    if (titleRegion) {
      ctx.fillStyle = colors?.primary || '#000000';
      ctx.fillRect(
        titleRegion.x * scaleFactor,
        titleRegion.y * scaleFactor,
        titleRegion.width * scaleFactor,
        titleRegion.height * scaleFactor
      );

      // Add title text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${16 * scaleFactor}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(
        'CARD TITLE',
        (titleRegion.x + titleRegion.width / 2) * scaleFactor,
        (titleRegion.y + titleRegion.height / 2 + 6) * scaleFactor
      );
    }

    // Draw stats/footer area if it exists in old structure
    if (selectedTemplate.template_data.regions?.stats) {
      ctx.fillStyle = colors?.secondary || '#f0f0f0';
      ctx.fillRect(
        selectedTemplate.template_data.regions.stats.x * scaleFactor,
        selectedTemplate.template_data.regions.stats.y * scaleFactor,
        selectedTemplate.template_data.regions.stats.width * scaleFactor,
        selectedTemplate.template_data.regions.stats.height * scaleFactor
      );
    }

    // Draw border around image region to show crop area
    let imageRegion;
    if (selectedTemplate.template_data.elements?.image) {
      const imageEl = selectedTemplate.template_data.elements.image;
      imageRegion = {
        x: imageEl.position?.x || 20,
        y: imageEl.position?.y || 70,
        width: imageEl.position?.width || 260,
        height: imageEl.position?.height || 180
      };
    } else {
      imageRegion = { x: 20, y: 70, width: 260, height: 180 };
    }

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      imageRegion.x * scaleFactor,
      imageRegion.y * scaleFactor,
      imageRegion.width * scaleFactor,
      imageRegion.height * scaleFactor
    );
    ctx.setLineDash([]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setCropSettings(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100 - prev.width, prev.x + deltaX * 0.1)),
      y: Math.max(0, Math.min(100 - prev.height, prev.y + deltaY * 0.1))
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (value: number[]) => {
    setCropSettings(prev => ({ ...prev, scale: value[0] }));
  };

  const handleRotationChange = (value: number[]) => {
    setCropSettings(prev => ({ ...prev, rotation: value[0] }));
  };

  const handleCropSizeChange = (dimension: 'width' | 'height', value: number[]) => {
    setCropSettings(prev => ({
      ...prev,
      [dimension]: Math.min(100, Math.max(10, value[0]))
    }));
  };

  const resetCrop = () => {
    setCropSettings({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      scale: 1
    });
    toast.success('Crop settings reset');
  };

  const applyCrop = () => {
    if (!canvasRef.current) return;
    
    const croppedImageData = canvasRef.current.toDataURL('image/png', 0.9);
    onCropComplete(croppedImageData);
    toast.success('Crop applied successfully!');
  };

  if (!selectedPhoto || !selectedTemplate) {
    return (
      <div className="text-center py-12">
        <p className="text-crd-lightGray">Please upload a photo and select a template first</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview Canvas */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Position Your Photo</h3>
          <p className="text-crd-lightGray">Drag, scale, and rotate to get the perfect fit</p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="border border-crd-mediumGray rounded-lg shadow-lg cursor-move"
              style={{ width: '300px', height: '420px' }}
            />
            {isDragging && (
              <div className="absolute top-2 left-2 bg-crd-green text-black px-2 py-1 rounded text-xs font-medium">
                Drag to reposition
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            onClick={resetCrop}
            variant="outline"
            size="sm"
            className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={applyCrop}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            <Crop className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="space-y-6">
        <Card className="bg-crd-darkGray border-crd-mediumGray/30">
          <CardContent className="p-6 space-y-6">
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Move className="w-4 h-4" />
                Position & Scale
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-crd-lightGray mb-2 block">
                    Scale: {cropSettings.scale.toFixed(1)}x
                  </label>
                  <Slider
                    value={[cropSettings.scale]}
                    onValueChange={handleScaleChange}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-crd-lightGray mb-2 block">
                    Rotation: {cropSettings.rotation}°
                  </label>
                  <Slider
                    value={[cropSettings.rotation]}
                    onValueChange={handleRotationChange}
                    min={-180}
                    max={180}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Crop className="w-4 h-4" />
                Crop Area
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-crd-lightGray mb-2 block">
                    Width: {cropSettings.width}%
                  </label>
                  <Slider
                    value={[cropSettings.width]}
                    onValueChange={(value) => handleCropSizeChange('width', value)}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-crd-lightGray mb-2 block">
                    Height: {cropSettings.height}%
                  </label>
                  <Slider
                    value={[cropSettings.height]}
                    onValueChange={(value) => handleCropSizeChange('height', value)}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-crd-mediumGray/30">
              <h4 className="text-white font-medium mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setCropSettings(prev => ({ ...prev, scale: prev.scale + 0.1 }))}
                  variant="outline"
                  size="sm"
                  className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray"
                >
                  <ZoomIn className="w-4 h-4 mr-1" />
                  Zoom In
                </Button>
                <Button
                  onClick={() => setCropSettings(prev => ({ ...prev, scale: Math.max(0.5, prev.scale - 0.1) }))}
                  variant="outline"
                  size="sm"
                  className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray"
                >
                  <ZoomOut className="w-4 h-4 mr-1" />
                  Zoom Out
                </Button>
                <Button
                  onClick={() => setCropSettings(prev => ({ ...prev, rotation: prev.rotation + 90 }))}
                  variant="outline"
                  size="sm"
                  className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray"
                >
                  <RotateCw className="w-4 h-4 mr-1" />
                  Rotate
                </Button>
                <Button
                  onClick={() => setCropSettings(prev => ({ ...prev, x: 0, y: 0 }))}
                  variant="outline"
                  size="sm"
                  className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray"
                >
                  <Move className="w-4 h-4 mr-1" />
                  Center
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4">
          <h4 className="text-crd-green font-medium mb-2">Positioning Tips</h4>
          <ul className="text-sm text-crd-lightGray space-y-1">
            <li>• Drag the preview to reposition your photo</li>
            <li>• Use scale to zoom in/out on your subject</li>
            <li>• Rotate for dynamic compositions</li>
            <li>• Keep important details within the frame</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
