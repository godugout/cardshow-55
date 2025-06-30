
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Crop, 
  ZoomIn, 
  ZoomOut,
  Grid3X3,
  Undo,
  Redo,
  Target,
  User,
  Activity,
  Eye,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import type { DesignTemplate } from '@/types/card';

interface TemplateAwareCropArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: string;
  color: string;
  type: 'main' | 'frame' | 'element';
  templateRegion?: string;
  aspectRatio?: number;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

interface CropPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  cropAreas: Omit<TemplateAwareCropArea, 'id'>[];
}

interface TemplateAwareMultiCropperProps {
  imageUrl: string;
  template: DesignTemplate;
  onCropComplete: (crops: { main?: string; frame?: string; elements?: string[]; }) => void;
  onCancel: () => void;
  className?: string;
}

export const TemplateAwareMultiCropper: React.FC<TemplateAwareMultiCropperProps> = ({
  imageUrl,
  template,
  onCropComplete,
  onCancel,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cropAreas, setCropAreas] = useState<TemplateAwareCropArea[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showTemplatePreview, setShowTemplatePreview] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('portrait');

  // Template-specific crop presets
  const cropPresets: CropPreset[] = [
    {
      id: 'portrait',
      name: 'Portrait',
      icon: <User className="w-4 h-4" />,
      description: 'Focus on face and upper body',
      cropAreas: [
        {
          x: 0.1,
          y: 0.05,
          width: 0.8,
          height: 0.9,
          rotation: 0,
          label: 'Main Photo',
          color: '#4ade80',
          type: 'main',
          templateRegion: 'photoArea',
          aspectRatio: template.template_data?.photoRegion?.width / template.template_data?.photoRegion?.height || 5/7
        }
      ]
    },
    {
      id: 'action',
      name: 'Action Shot',
      icon: <Activity className="w-4 h-4" />,
      description: 'Full body in motion',
      cropAreas: [
        {
          x: 0.05,
          y: 0.02,
          width: 0.9,
          height: 0.96,
          rotation: 0,
          label: 'Main Photo',
          color: '#4ade80',
          type: 'main',
          templateRegion: 'photoArea',
          aspectRatio: template.template_data?.photoRegion?.width / template.template_data?.photoRegion?.height || 5/7
        }
      ]
    },
    {
      id: 'multi-element',
      name: 'Multi-Element',
      icon: <Target className="w-4 h-4" />,
      description: 'Extract multiple card elements',
      cropAreas: [
        {
          x: 0.1,
          y: 0.1,
          width: 0.6,
          height: 0.8,
          rotation: 0,
          label: 'Main Photo',
          color: '#4ade80',
          type: 'main',
          templateRegion: 'photoArea',
          aspectRatio: template.template_data?.photoRegion?.width / template.template_data?.photoRegion?.height || 5/7
        },
        {
          x: 0.72,
          y: 0.1,
          width: 0.25,
          height: 0.3,
          rotation: 0,
          label: 'Logo/Badge',
          color: '#f97316',
          type: 'element',
          templateRegion: 'logoArea'
        }
      ]
    }
  ];

  // Initialize crops based on template and preset
  const initializeCrops = useCallback(() => {
    if (!imageRef.current) return;

    const preset = cropPresets.find(p => p.id === activePreset);
    if (!preset) return;

    const img = imageRef.current;
    const newCropAreas: TemplateAwareCropArea[] = preset.cropAreas.map((area, index) => ({
      ...area,
      id: `crop-${index}`,
      x: area.x * img.clientWidth,
      y: area.y * img.clientHeight,
      width: area.width * img.clientWidth,
      height: area.height * img.clientHeight,
    }));

    setCropAreas(newCropAreas);
    setSelectedCropId(newCropAreas[0]?.id || null);
  }, [activePreset, cropPresets]);

  // Load image and initialize crops
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = img.src;
      }
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (imageLoaded) {
      initializeCrops();
    }
  }, [imageLoaded, initializeCrops]);

  // Draw canvas with crops and template overlay
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;
    
    if (!ctx || !img || !canvas) return;

    // Set canvas size
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#3b82f640';
      ctx.lineWidth = 1;
      const gridSize = 20;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw template guidance overlay
    if (showTemplatePreview && template.template_data?.photoRegion) {
      const region = template.template_data.photoRegion;
      const scale = Math.min(canvas.width / 300, canvas.height / 420); // Assuming standard card size
      
      ctx.strokeStyle = '#8b5cf640';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(
        region.x * scale,
        region.y * scale,
        region.width * scale,
        region.height * scale
      );
      ctx.setLineDash([]);
    }

    // Draw crop areas
    cropAreas.forEach(crop => {
      const isSelected = selectedCropId === crop.id;
      
      ctx.save();
      ctx.translate(crop.x + crop.width / 2, crop.y + crop.height / 2);
      ctx.rotate((crop.rotation * Math.PI) / 180);
      
      // Draw crop border
      ctx.strokeStyle = crop.color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash(isSelected ? [] : [5, 5]);
      ctx.strokeRect(-crop.width / 2, -crop.height / 2, crop.width, crop.height);
      
      // Draw handles for selected crop
      if (isSelected) {
        ctx.fillStyle = crop.color;
        const handleSize = 8;
        const positions = [
          [-crop.width / 2 - handleSize / 2, -crop.height / 2 - handleSize / 2],
          [crop.width / 2 - handleSize / 2, -crop.height / 2 - handleSize / 2],
          [-crop.width / 2 - handleSize / 2, crop.height / 2 - handleSize / 2],
          [crop.width / 2 - handleSize / 2, crop.height / 2 - handleSize / 2]
        ];
        
        positions.forEach(([x, y]) => {
          ctx.fillRect(x, y, handleSize, handleSize);
        });
      }
      
      ctx.restore();
      
      // Draw label
      ctx.fillStyle = crop.color;
      ctx.fillRect(crop.x, crop.y - 25, ctx.measureText(crop.label).width + 10, 20);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(crop.label, crop.x + 5, crop.y - 10);
    });
  }, [cropAreas, selectedCropId, showGrid, showTemplatePreview, template]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [imageLoaded, drawCanvas]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const clickedCrop = cropAreas.find(crop => 
      x >= crop.x && x <= crop.x + crop.width &&
      y >= crop.y && y <= crop.y + crop.height
    );

    if (clickedCrop) {
      setSelectedCropId(clickedCrop.id);
      setIsDragging(true);
      setDragStart({ x, y });
    }
  }, [cropAreas, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedCropId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    setCropAreas(prev => prev.map(crop => {
      if (crop.id === selectedCropId) {
        return {
          ...crop,
          x: Math.max(0, Math.min(crop.x + deltaX, canvas.width - crop.width)),
          y: Math.max(0, Math.min(crop.y + deltaY, canvas.height - crop.height))
        };
      }
      return crop;
    }));

    setDragStart({ x, y });
  }, [isDragging, selectedCropId, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Extract crops with template awareness
  const extractCrops = useCallback(async () => {
    if (!imageRef.current || !imageLoaded) {
      toast.error('Image not ready');
      return;
    }

    setIsExtracting(true);
    
    try {
      const img = imageRef.current;
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      const results: { main?: string; frame?: string; elements?: string[] } = {};
      const elements: string[] = [];

      for (const crop of cropAreas) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) continue;

        // Use template-aware sizing
        const outputWidth = crop.type === 'main' ? 
          Math.min(1200, crop.width * scaleX) : 
          Math.min(600, crop.width * scaleX);
        const outputHeight = crop.type === 'main' ? 
          Math.min(1600, crop.height * scaleY) : 
          Math.min(600, crop.height * scaleY);
        
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        const sourceX = crop.x * scaleX;
        const sourceY = crop.y * scaleY;
        const sourceWidth = crop.width * scaleX;
        const sourceHeight = crop.height * scaleY;

        if (crop.rotation !== 0) {
          ctx.save();
          ctx.translate(outputWidth / 2, outputHeight / 2);
          ctx.rotate((crop.rotation * Math.PI) / 180);
          ctx.translate(-outputWidth / 2, -outputHeight / 2);
        }

        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, outputWidth, outputHeight
        );

        if (crop.rotation !== 0) {
          ctx.restore();
        }

        const dataUrl = canvas.toDataURL('image/png', 0.95);

        if (crop.type === 'main') {
          results.main = dataUrl;
        } else if (crop.type === 'frame') {
          results.frame = dataUrl;
        } else {
          elements.push(dataUrl);
        }
      }

      if (elements.length > 0) {
        results.elements = elements;
      }

      onCropComplete(results);
      toast.success(`Successfully extracted ${cropAreas.length} crops for ${template.name}!`);
    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to extract crops');
    } finally {
      setIsExtracting(false);
    }
  }, [cropAreas, imageLoaded, onCropComplete, template.name]);

  return (
    <div className={`h-full flex flex-col bg-crd-darkest ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-crd-darker border-b border-crd-mediumGray/30">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-crd-green" />
            Template-Aware Cropper
          </h3>
          <Badge className="bg-crd-green text-black">
            {template.name}
          </Badge>
          <Badge className="bg-crd-blue text-white">
            {cropAreas.length} crop{cropAreas.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? 'bg-crd-blue text-white' : 'bg-crd-darkGray border-crd-mediumGray text-white'}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplatePreview(!showTemplatePreview)}
            className={showTemplatePreview ? 'bg-crd-purple text-white' : 'bg-crd-darkGray border-crd-mediumGray text-white'}
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            disabled={zoom <= 0.5}
            className="bg-crd-darkGray border-crd-mediumGray text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <span className="text-white text-sm min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            disabled={zoom >= 3}
            className="bg-crd-darkGray border-crd-mediumGray text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={extractCrops}
            disabled={!imageLoaded || isExtracting}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-6 ml-4"
          >
            {isExtracting ? 'Processing...' : 'Extract for Template'}
            <Crop className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 p-6 overflow-auto bg-crd-darkest">
          <div className="max-w-fit mx-auto">
            <div className="relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop source"
                className="max-w-full max-h-[600px] w-auto h-auto rounded-lg shadow-xl"
                onLoad={() => setImageLoaded(true)}
                draggable={false}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              />
              
              <canvas
                ref={canvasRef}
                className="absolute inset-0 cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ 
                  transform: `scale(${zoom})`, 
                  transformOrigin: 'top left',
                  display: imageLoaded ? 'block' : 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-crd-darker border-l border-crd-mediumGray/30 flex flex-col">
          <div className="p-4 border-b border-crd-mediumGray/30">
            <h4 className="text-white font-semibold mb-4">Crop Presets</h4>
            <div className="space-y-2">
              {cropPresets.map((preset) => (
                <Button
                  key={preset.id}
                  onClick={() => setActivePreset(preset.id)}
                  variant={activePreset === preset.id ? "default" : "outline"}
                  className={`w-full justify-start ${
                    activePreset === preset.id 
                      ? 'bg-crd-green text-black hover:bg-crd-green/90' 
                      : 'bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray'
                  }`}
                >
                  {preset.icon}
                  <div className="ml-2 text-left">
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs opacity-75">{preset.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4">
            <h4 className="text-white font-semibold mb-3">Template Guide</h4>
            <div className="bg-crd-mediumGray/10 p-3 rounded-lg space-y-2">
              <div className="text-crd-lightGray text-sm">
                <strong className="text-white">Template:</strong> {template.name}
              </div>
              {template.template_data?.photoRegion && (
                <div className="text-crd-lightGray text-sm">
                  <strong className="text-white">Photo Area:</strong> {template.template_data.photoRegion.width}×{template.template_data.photoRegion.height}px
                </div>
              )}
              <div className="text-crd-lightGray text-sm">
                <strong className="text-white">Crops:</strong> {cropAreas.length} area{cropAreas.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="mt-4 bg-crd-darkGray/50 p-3 rounded-lg">
              <h5 className="text-white font-medium text-sm mb-2">Tips</h5>
              <ul className="text-crd-lightGray text-xs space-y-1">
                <li>• Purple outline shows template photo area</li>
                <li>• Click and drag to move crop areas</li>
                <li>• Use presets for optimal positioning</li>
                <li>• Grid helps with precise alignment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
