import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  RotateCw, 
  Download, 
  Target, 
  ZoomIn, 
  ZoomOut,
  Square,
  Maximize,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface CropArea {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'main' | 'frame' | 'element';
  color: string;
  selected: boolean;
}

interface AdvancedCropperProps {
  imageUrl: string;
  onCropComplete: (crops: { main?: string; frame?: string; elements?: string[] }) => void;
  onCancel: () => void;
  aspectRatio?: number;
  className?: string;
}

export const AdvancedCropper: React.FC<AdvancedCropperProps> = ({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 2.5 / 3.5,
  className = ''
}) => {
  const [cropAreas, setCropAreas] = useState<CropArea[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with a main crop area
  const initializeCrops = useCallback(() => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    const cropWidth = Math.min(displayWidth * 0.7, displayHeight * aspectRatio * 0.7);
    const cropHeight = cropWidth / aspectRatio;

    const mainCrop: CropArea = {
      id: 'main',
      label: 'Main Card Image',
      x: (displayWidth - cropWidth) / 2,
      y: (displayHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
      type: 'main',
      color: '#10b981',
      selected: true
    };

    setCropAreas([mainCrop]);
    setSelectedCropId('main');
  }, [aspectRatio]);

  const handleImageLoad = useCallback(() => {
    initializeCrops();
    setImageLoaded(true);
  }, [initializeCrops]);

  // Add new crop area
  const addCropArea = useCallback((type: 'frame' | 'element') => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    const newId = `${type}_${Date.now()}`;
    const size = type === 'frame' ? 0.4 : 0.3;
    const cropWidth = displayWidth * size;
    const cropHeight = displayHeight * size;

    const newCrop: CropArea = {
      id: newId,
      label: type === 'frame' ? 'Frame Element' : 'Custom Element',
      x: Math.random() * (displayWidth - cropWidth),
      y: Math.random() * (displayHeight - cropHeight),
      width: cropWidth,
      height: cropHeight,
      type,
      color: type === 'frame' ? '#3b82f6' : '#f59e0b',
      selected: false
    };

    setCropAreas(prev => [...prev, newCrop]);
    setSelectedCropId(newId);
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, cropId: string, handle?: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandle(handle || 'move');
    setDragStart({ x: e.clientX, y: e.clientY });
    setSelectedCropId(cropId);
    
    // Update selected state
    setCropAreas(prev => prev.map(crop => ({
      ...crop,
      selected: crop.id === cropId
    })));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedCropId || !imageRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const img = imageRef.current;

    setCropAreas(prev => prev.map(crop => {
      if (crop.id !== selectedCropId) return crop;

      let newCrop = { ...crop };

      switch (dragHandle) {
        case 'move':
          newCrop.x = Math.max(0, Math.min(crop.x + deltaX, img.clientWidth - crop.width));
          newCrop.y = Math.max(0, Math.min(crop.y + deltaY, img.clientHeight - crop.height));
          break;
        
        case 'tl':
          newCrop.x = Math.max(0, crop.x + deltaX);
          newCrop.y = Math.max(0, crop.y + deltaY);
          newCrop.width = crop.width - deltaX;
          newCrop.height = crop.height - deltaY;
          break;
        
        case 'tr':
          newCrop.y = Math.max(0, crop.y + deltaY);
          newCrop.width = crop.width + deltaX;
          newCrop.height = crop.height - deltaY;
          break;
        
        case 'bl':
          newCrop.x = Math.max(0, crop.x + deltaX);
          newCrop.width = crop.width - deltaX;
          newCrop.height = crop.height + deltaY;
          break;
        
        case 'br':
          newCrop.width = crop.width + deltaX;
          newCrop.height = crop.height + deltaY;
          break;
      }

      // Ensure minimum size
      newCrop.width = Math.max(50, newCrop.width);
      newCrop.height = Math.max(50, newCrop.height);

      // Ensure within bounds
      newCrop.width = Math.min(newCrop.width, img.clientWidth - newCrop.x);
      newCrop.height = Math.min(newCrop.height, img.clientHeight - newCrop.y);

      // Maintain aspect ratio for main card
      if (crop.type === 'main' && dragHandle !== 'move') {
        if (dragHandle?.includes('r')) {
          newCrop.height = newCrop.width / aspectRatio;
        } else {
          newCrop.width = newCrop.height * aspectRatio;
        }
      }

      return newCrop;
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, selectedCropId, dragHandle, dragStart, aspectRatio]);

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

  // Extract all crops
  const extractAllCrops = useCallback(async () => {
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

        // Convert display coordinates to natural image coordinates
        const sourceX = crop.x * scaleX;
        const sourceY = crop.y * scaleY;
        const sourceWidth = crop.width * scaleX;
        const sourceHeight = crop.height * scaleY;

        // Set output dimensions
        const outputWidth = Math.min(1200, sourceWidth);
        const outputHeight = Math.min(1600, sourceHeight);
        
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // Draw the cropped area
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, outputWidth, outputHeight
        );

        // Convert to data URL
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
      toast.success('All crops extracted successfully!');
    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to extract crops');
    } finally {
      setIsExtracting(false);
    }
  }, [cropAreas, imageLoaded, onCropComplete]);

  // Remove crop area
  const removeCropArea = useCallback((cropId: string) => {
    if (cropId === 'main') {
      toast.error('Cannot remove main card image');
      return;
    }
    setCropAreas(prev => prev.filter(crop => crop.id !== cropId));
    if (selectedCropId === cropId) {
      setSelectedCropId('main');
    }
  }, [selectedCropId]);

  return (
    <div className={`h-full flex flex-col bg-editor-darker ${className}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-editor-border bg-editor-dark">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-medium">Advanced Cropping Tool</h3>
          <Badge variant="secondary" className="bg-crd-green text-black">
            {cropAreas.length} crop{cropAreas.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-gray-300 border-editor-border hover:bg-editor-tool hover:text-white"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            disabled={zoom <= 0.5}
            className="text-gray-300 border-editor-border hover:bg-editor-tool hover:text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          <span className="text-gray-300 text-sm">{Math.round(zoom * 100)}%</span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            disabled={zoom >= 3}
            className="text-gray-300 border-editor-border hover:bg-editor-tool hover:text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            onClick={extractAllCrops}
            disabled={!imageLoaded || isExtracting}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            {isExtracting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Extracting...
              </>
            ) : (
              <>
                <Crop className="w-4 h-4 mr-2" />
                Extract All Crops
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onCancel}
            className="border-editor-border text-gray-300 hover:bg-editor-tool hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 p-4 overflow-auto bg-editor-darker" ref={containerRef}>
          <Card className="relative overflow-hidden bg-editor-dark border-editor-border max-w-fit mx-auto">
            <div className="relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop source"
                className="max-w-full max-h-[600px] w-auto h-auto"
                onLoad={handleImageLoad}
                draggable={false}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              />
              
              {/* Crop Areas Overlay */}
              {imageLoaded && (
                <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                  {cropAreas.map((crop) => (
                    <div
                      key={crop.id}
                      className={`absolute border-2 cursor-move ${crop.selected ? 'border-4' : ''}`}
                      style={{
                        left: crop.x,
                        top: crop.y,
                        width: crop.width,
                        height: crop.height,
                        borderColor: crop.color,
                        boxShadow: crop.selected ? `0 0 0 2px ${crop.color}40` : 'none',
                      }}
                      onMouseDown={(e) => handleMouseDown(e, crop.id, 'move')}
                    >
                      {/* Corner handles */}
                      {crop.selected && ['tl', 'tr', 'bl', 'br'].map((handle) => (
                        <div
                          key={handle}
                          className="absolute w-3 h-3 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            backgroundColor: crop.color,
                            top: handle.includes('t') ? -6 : 'auto',
                            bottom: handle.includes('b') ? -6 : 'auto',
                            left: handle.includes('l') ? -6 : 'auto',
                            right: handle.includes('r') ? -6 : 'auto',
                            cursor: handle === 'tl' || handle === 'br' ? 'nw-resize' : 'ne-resize'
                          }}
                          onMouseDown={(e) => handleMouseDown(e, crop.id, handle)}
                        />
                      ))}
                      
                      {/* Label */}
                      <div 
                        className="absolute top-1 left-1 text-white text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: crop.color }}
                      >
                        {crop.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="w-80 border-l border-editor-border bg-editor-dark p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Add Crop Areas */}
            <div>
              <h4 className="text-white font-medium mb-3">Add Crop Areas</h4>
              <div className="space-y-2">
                <Button
                  onClick={() => addCropArea('frame')}
                  variant="outline"
                  className="w-full bg-editor-tool border-editor-border text-gray-300 hover:bg-blue-600/20 hover:text-white hover:border-blue-400"
                  disabled={!imageLoaded}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Add Frame Element
                </Button>
                <Button
                  onClick={() => addCropArea('element')}
                  variant="outline"
                  className="w-full bg-editor-tool border-editor-border text-gray-300 hover:bg-yellow-600/20 hover:text-white hover:border-yellow-400"
                  disabled={!imageLoaded}
                >
                  <Maximize className="w-4 h-4 mr-2" />
                  Add Custom Element
                </Button>
              </div>
            </div>

            {/* Crop Areas List */}
            <div>
              <h4 className="text-white font-medium mb-3">Crop Areas ({cropAreas.length})</h4>
              <div className="space-y-2">
                {cropAreas.map((crop) => (
                  <Card
                    key={crop.id}
                    className={`p-3 cursor-pointer transition-all bg-editor-tool ${
                      crop.selected 
                        ? 'border-2' 
                        : 'border border-editor-border hover:border-gray-500'
                    }`}
                    style={{ borderColor: crop.selected ? crop.color : undefined }}
                    onClick={() => {
                      setSelectedCropId(crop.id);
                      setCropAreas(prev => prev.map(c => ({ ...c, selected: c.id === crop.id })));
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: crop.color }}
                        />
                        <span className="text-white text-sm font-medium">
                          {crop.label}
                        </span>
                      </div>
                      {crop.id !== 'main' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCropArea(crop.id);
                          }}
                          className="p-1 h-auto text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          ×
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-gray-300">
                      {Math.round(crop.width)} × {Math.round(crop.height)}px
                      <br />
                      Type: {crop.type}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <Card className="bg-editor-tool border-editor-border p-4">
              <h5 className="text-white font-medium mb-2">Instructions</h5>
              <ul className="text-gray-300 text-xs space-y-1">
                <li>• Green: Main card image (required)</li>
                <li>• Blue: Frame elements (logos, borders)</li>
                <li>• Yellow: Custom elements (text, graphics)</li>
                <li>• Click and drag to move crop areas</li>
                <li>• Drag corners to resize</li>
                <li>• Use zoom for precision</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
