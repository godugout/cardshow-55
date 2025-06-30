
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  Grid3X3, 
  Undo, 
  Redo,
  Crop,
  RotateCw,
  Move
} from 'lucide-react';
import { toast } from 'sonner';

interface CropArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: string;
  color: string;
  type: 'frame' | 'element';
  selected: boolean;
}

interface CropResult {
  id: string;
  croppedImageUrl: string;
  cropData: CropArea;
}

interface DemoAdvancedCropperProps {
  imageUrl: string;
  onCropComplete: (results: CropResult[]) => void;
  onCancel: () => void;
}

export const DemoAdvancedCropper: React.FC<DemoAdvancedCropperProps> = ({
  imageUrl,
  onCropComplete,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cropAreas, setCropAreas] = useState<CropArea[]>([]);
  const [selectedCropIds, setSelectedCropIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isExtracting, setIsExtracting] = useState(false);

  // Initialize with main crop area
  useEffect(() => {
    if (imageLoaded && cropAreas.length === 0) {
      const mainCrop: CropArea = {
        id: 'main',
        x: 50,
        y: 50,
        width: 300,
        height: 420,
        rotation: 0,
        label: 'Main Card',
        color: '#4ade80',
        type: 'frame',
        selected: true
      };
      setCropAreas([mainCrop]);
      setSelectedCropIds(['main']);
    }
  }, [imageLoaded, cropAreas.length]);

  // Load image
  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = img.src;
      }

      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      setImageLoaded(true);
    };

    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
  }, [imageUrl]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;
    
    if (!ctx || !img || !canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      
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
      ctx.globalAlpha = 1;
    }
    
    // Draw crop areas
    cropAreas.forEach(crop => {
      const isSelected = selectedCropIds.includes(crop.id);
      
      ctx.save();
      ctx.translate(crop.x + crop.width / 2, crop.y + crop.height / 2);
      ctx.rotate((crop.rotation * Math.PI) / 180);
      
      // Draw crop border
      ctx.strokeStyle = crop.color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash(isSelected ? [] : [5, 5]);
      ctx.strokeRect(-crop.width / 2, -crop.height / 2, crop.width, crop.height);
      
      // Draw corner handles for selected crops
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
        
        // Rotation handle
        ctx.beginPath();
        ctx.arc(0, -crop.height / 2 - 20, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      ctx.restore();
      
      // Draw label
      ctx.fillStyle = crop.color;
      ctx.fillRect(crop.x, crop.y - 25, ctx.measureText(crop.label).width + 10, 20);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(crop.label, crop.x + 5, crop.y - 10);
    });
  }, [cropAreas, selectedCropIds, showGrid]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [imageLoaded, drawCanvas]);

  const addCropArea = useCallback((type: 'frame' | 'element') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newCrop: CropArea = {
      id: `crop-${Date.now()}`,
      x: Math.random() * (canvas.width - 200) + 50,
      y: Math.random() * (canvas.height - 200) + 50,
      width: type === 'frame' ? 300 : 150,
      height: type === 'frame' ? 420 : 150,
      rotation: 0,
      label: type === 'frame' ? `Frame ${cropAreas.length}` : `Element ${cropAreas.length}`,
      color: type === 'frame' ? '#4ade80' : '#f97316',
      type,
      selected: false
    };

    setCropAreas(prev => [...prev, newCrop]);
    toast.success(`${type === 'frame' ? 'Frame' : 'Element'} crop area added`);
  }, [cropAreas.length]);

  const removeCropArea = useCallback((cropId: string) => {
    if (cropId === 'main') return; // Don't allow removing main crop
    
    setCropAreas(prev => prev.filter(crop => crop.id !== cropId));
    setSelectedCropIds(prev => prev.filter(id => id !== cropId));
    toast.success('Crop area removed');
  }, []);

  const selectCrop = useCallback((cropId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedCropIds(prev => 
        prev.includes(cropId) 
          ? prev.filter(id => id !== cropId)
          : [...prev, cropId]
      );
    } else {
      setSelectedCropIds([cropId]);
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    // Find clicked crop area
    const clickedCrop = cropAreas.find(crop => 
      x >= crop.x && x <= crop.x + crop.width &&
      y >= crop.y && y <= crop.y + crop.height
    );

    if (clickedCrop) {
      selectCrop(clickedCrop.id, e.ctrlKey || e.metaKey);
      setIsDragging(true);
      setDragStart({ x, y });
    } else {
      setSelectedCropIds([]);
    }
  }, [cropAreas, selectCrop, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedCropIds.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    setCropAreas(prev => prev.map(crop => {
      if (selectedCropIds.includes(crop.id)) {
        return {
          ...crop,
          x: Math.max(0, Math.min(crop.x + deltaX, canvas.width - crop.width)),
          y: Math.max(0, Math.min(crop.y + deltaY, canvas.height - crop.height))
        };
      }
      return crop;
    }));

    setDragStart({ x, y });
  }, [isDragging, selectedCropIds, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const extractAllCrops = useCallback(async () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || cropAreas.length === 0) return;

    setIsExtracting(true);
    const results: CropResult[] = [];

    try {
      for (const crop of cropAreas) {
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
        
        if (cropCtx) {
          cropCanvas.width = crop.width;
          cropCanvas.height = crop.height;

          const scaleX = img.naturalWidth / canvas.width;
          const scaleY = img.naturalHeight / canvas.height;

          cropCtx.drawImage(
            img,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0, 0,
            crop.width,
            crop.height
          );

          const blob = await new Promise<Blob | null>(resolve => 
            cropCanvas.toBlob(resolve, 'image/jpeg', 0.9)
          );

          if (blob) {
            results.push({
              id: crop.id,
              croppedImageUrl: URL.createObjectURL(blob),
              cropData: crop
            });
          }
        }
      }

      onCropComplete(results);
      toast.success(`${results.length} crops extracted successfully!`);
    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to extract crops');
    } finally {
      setIsExtracting(false);
    }
  }, [cropAreas, onCropComplete]);

  return (
    <div className="h-[600px] flex bg-crd-darkest">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 bg-crd-darker border-b border-crd-mediumGray/30">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-semibold">Advanced Multi-Crop</h3>
            <Badge className="bg-crd-green text-black">
              {cropAreas.length} area{cropAreas.length !== 1 ? 's' : ''}
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
              onClick={extractAllCrops}
              disabled={!imageLoaded || isExtracting}
              className="bg-crd-green hover:bg-crd-green/90 text-black ml-4"
            >
              {isExtracting ? 'Processing...' : 'Extract All'}
              <Crop className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 bg-crd-darkGray/20">
          <div 
            className="border border-crd-mediumGray/30 rounded-lg overflow-hidden bg-white"
            style={{ transform: `scale(${zoom})` }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-crosshair"
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
            {!imageLoaded && (
              <div className="w-96 h-64 flex items-center justify-center bg-crd-mediumGray/20">
                <p className="text-crd-lightGray">Loading image...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-crd-darker border-l border-crd-mediumGray/30 flex flex-col">
        <div className="p-4 border-b border-crd-mediumGray/30">
          <h3 className="text-white font-semibold mb-4">Crop Areas</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => addCropArea('frame')}
              disabled={!imageLoaded}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Frame
            </Button>
            <Button
              onClick={() => addCropArea('element')}
              disabled={!imageLoaded}
              className="bg-crd-orange hover:bg-crd-orange/90 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Element
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {cropAreas.map((crop) => (
              <Card
                key={crop.id}
                className={`p-3 cursor-pointer transition-all ${
                  selectedCropIds.includes(crop.id)
                    ? 'border-2 border-crd-green bg-crd-green/10'
                    : 'border border-crd-mediumGray bg-crd-darkGray hover:border-crd-lightGray'
                }`}
                onClick={() => selectCrop(crop.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: crop.color }}
                    />
                    <div>
                      <p className="text-white font-medium text-sm">{crop.label}</p>
                      <p className="text-crd-lightGray text-xs">
                        {Math.round(crop.width)}×{Math.round(crop.height)}
                        {crop.rotation !== 0 && ` • ${crop.rotation}°`}
                      </p>
                    </div>
                  </div>
                  
                  {crop.id !== 'main' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCropArea(crop.id);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-crd-mediumGray/30">
          <div className="bg-crd-darkGray rounded-lg p-3">
            <h4 className="text-white font-medium text-sm mb-2">Tips</h4>
            <ul className="text-crd-lightGray text-xs space-y-1">
              <li>• Click to select crop areas</li>
              <li>• Drag to move selected areas</li>
              <li>• Hold Ctrl to multi-select</li>
              <li>• Use grid for precise alignment</li>
            </ul>
          </div>
        </div>
      </div>

      <img ref={imageRef} className="hidden" alt="" />
    </div>
  );
};
