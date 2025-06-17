
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCw, 
  Move, 
  Square, 
  Check, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Grid3X3, 
  Lock,
  Unlock,
  Undo,
  Redo,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import type { Card as CardType } from '@/types/card';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface EnhancedBulkRecropInterfaceProps {
  cards: CardType[];
  onComplete: (croppedCards: { card: CardType; croppedImageUrl: string }[]) => void;
  onBack: () => void;
}

export const EnhancedBulkRecropInterface = ({ cards, onComplete, onBack }: EnhancedBulkRecropInterfaceProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 50,
    y: 50,
    width: 250,
    height: 350,
    rotation: 0
  });
  const [croppedResults, setCroppedResults] = useState<{ card: CardType; croppedImageUrl: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<'card' | 'square'>('card');
  const [history, setHistory] = useState<CropArea[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCard = cards[currentCardIndex];
  const CARD_ASPECT_RATIO = 2.5 / 3.5; // Standard card ratio
  const SQUARE_ASPECT_RATIO = 1; // Square ratio

  const saveToHistory = useCallback((cropState: CropArea) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...cropState });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCropArea({ ...history[historyIndex - 1] });
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCropArea({ ...history[historyIndex + 1] });
    }
  }, [history, historyIndex]);

  const getCurrentAspectRatio = () => {
    return aspectRatio === 'card' ? CARD_ASPECT_RATIO : SQUARE_ASPECT_RATIO;
  };

  const setAspectRatioPreset = (type: 'card' | 'square') => {
    setAspectRatio(type);
    if (aspectRatioLocked) {
      const currentRatio = getCurrentAspectRatio();
      setCropArea(prev => {
        const newHeight = prev.width / (type === 'card' ? CARD_ASPECT_RATIO : SQUARE_ASPECT_RATIO);
        const newCrop = { ...prev, height: newHeight };
        saveToHistory(newCrop);
        return newCrop;
      });
    }
  };

  useEffect(() => {
    if (currentCard) {
      loadImageAndDraw();
      // Reset crop area for new card
      const initialCrop = {
        x: 50,
        y: 50,
        width: 250,
        height: aspectRatio === 'card' ? 350 : 250,
        rotation: 0
      };
      setCropArea(initialCrop);
      setHistory([initialCrop]);
      setHistoryIndex(0);
    }
  }, [currentCard, aspectRatio]);

  useEffect(() => {
    loadImageAndDraw();
  }, [cropArea, zoom, showGrid]);

  const loadImageAndDraw = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    img.onload = () => {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const containerHeight = containerRef.current?.clientHeight || 600;
      
      // Scale image to fit container while maintaining aspect ratio
      const scale = Math.min(containerWidth / img.naturalWidth, containerHeight / img.naturalHeight) * zoom;
      
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw grid if enabled
      if (showGrid) {
        drawGrid(ctx, canvas.width, canvas.height);
      }

      // Draw crop overlay
      drawCropOverlay(ctx, canvas.width, canvas.height);
    };

    img.src = currentCard.image_url || currentCard.thumbnail_url || '/placeholder.svg';
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCropOverlay = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Clear crop area
    ctx.save();
    ctx.translate(cropArea.x + cropArea.width / 2, cropArea.y + cropArea.height / 2);
    ctx.rotate((cropArea.rotation * Math.PI) / 180);
    ctx.clearRect(-cropArea.width / 2, -cropArea.height / 2, cropArea.width, cropArea.height);
    ctx.restore();

    // Draw crop rectangle border
    ctx.save();
    ctx.translate(cropArea.x + cropArea.width / 2, cropArea.y + cropArea.height / 2);
    ctx.rotate((cropArea.rotation * Math.PI) / 180);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(-cropArea.width / 2, -cropArea.height / 2, cropArea.width, cropArea.height);

    // Draw corner handles
    const handleSize = 12;
    ctx.fillStyle = '#10b981';
    const positions = [
      [-cropArea.width / 2, -cropArea.height / 2], // top-left
      [cropArea.width / 2, -cropArea.height / 2],  // top-right
      [-cropArea.width / 2, cropArea.height / 2],  // bottom-left
      [cropArea.width / 2, cropArea.height / 2]    // bottom-right
    ];
    
    positions.forEach(([x, y]) => {
      ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
    });

    // Draw rotation handle
    ctx.beginPath();
    ctx.arc(0, -cropArea.height / 2 - 20, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();

    // Draw aspect ratio indicator
    ctx.fillStyle = '#10b981';
    ctx.font = '12px monospace';
    const ratioText = aspectRatio === 'card' ? '2.5:3.5' : '1:1';
    ctx.fillText(ratioText, cropArea.x, cropArea.y - 10);
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setDragStart(pos);
    
    // Determine what's being dragged
    const centerX = cropArea.x + cropArea.width / 2;
    const centerY = cropArea.y + cropArea.height / 2;
    
    // Check rotation handle
    if (Math.abs(pos.x - centerX) < 10 && Math.abs(pos.y - (centerY - cropArea.height / 2 - 20)) < 10) {
      setDragHandle('rotate');
    } else {
      setDragHandle('move');
    }
    
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imageRef.current) return;

    const pos = getMousePos(e);
    const deltaX = pos.x - dragStart.x;
    const deltaY = pos.y - dragStart.y;
    const img = imageRef.current;

    setCropArea(prev => {
      let newCrop = { ...prev };

      switch (dragHandle) {
        case 'move':
          newCrop.x = Math.max(0, Math.min(prev.x + deltaX, img.naturalWidth - prev.width));
          newCrop.y = Math.max(0, Math.min(prev.y + deltaY, img.naturalHeight - prev.height));
          break;
        
        case 'rotate':
          const centerX = prev.x + prev.width / 2;
          const centerY = prev.y + prev.height / 2;
          const angle = Math.atan2(pos.y - centerY, pos.x - centerX);
          newCrop.rotation = Math.round((angle * 180 / Math.PI) / 15) * 15;
          break;
      }

      return newCrop;
    });

    setDragStart(pos);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      saveToHistory(cropArea);
    }
    setIsDragging(false);
    setDragHandle(null);
  };

  const applyCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard card dimensions
    canvas.width = aspectRatio === 'card' ? 350 : 350;
    canvas.height = aspectRatio === 'card' ? 490 : 350;

    // Draw cropped and rotated image
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((cropArea.rotation * Math.PI) / 180);
    
    ctx.drawImage(
      imageRef.current,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height
    );
    
    ctx.restore();

    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    setCroppedResults(prev => [
      ...prev.filter(result => result.card.id !== currentCard.id),
      { card: currentCard, croppedImageUrl }
    ]);

    // Move to next card or complete
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      const allResults = [
        ...croppedResults.filter(result => result.card.id !== currentCard.id),
        { card: currentCard, croppedImageUrl }
      ];
      onComplete(allResults);
    }
  };

  const skipCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      onComplete(croppedResults);
    }
  };

  const goToPrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-crd-darkest">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-crd-mediumGray/30">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Enhanced Crop Interface</h2>
          <Badge className="bg-crd-green text-black font-medium">
            Card {currentCardIndex + 1} of {cards.length}
          </Badge>
          <span className="text-crd-lightGray">{currentCard?.title}</span>
        </div>
        <Button onClick={onBack} variant="outline" className="text-white border-crd-mediumGray">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 bg-crd-darker border-b border-crd-mediumGray/30">
        <div className="flex justify-between text-sm text-crd-lightGray mb-2">
          <span>Progress</span>
          <span>{croppedResults.length} completed, {cards.length - croppedResults.length} remaining</span>
        </div>
        <div className="w-full bg-crd-mediumGray rounded-full h-2">
          <div 
            className="bg-crd-green h-2 rounded-full transition-all"
            style={{ width: `${(croppedResults.length / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 p-6 overflow-hidden" ref={containerRef}>
          <Card className="relative h-full bg-crd-darkGray border-crd-mediumGray/30 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
            <img
              ref={imageRef}
              className="hidden"
              alt="Source"
            />
          </Card>
        </div>

        {/* Enhanced Controls Sidebar */}
        <div className="w-80 bg-crd-darker border-l border-crd-mediumGray/30 p-4 space-y-6">
          {/* Aspect Ratio Presets */}
          <div>
            <h3 className="text-white font-semibold mb-3">Aspect Ratio</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button
                onClick={() => setAspectRatioPreset('card')}
                variant={aspectRatio === 'card' ? 'default' : 'outline'}
                className={aspectRatio === 'card' ? 'bg-crd-green text-black' : 'text-white border-crd-mediumGray'}
                size="sm"
              >
                Card (2.5:3.5)
              </Button>
              <Button
                onClick={() => setAspectRatioPreset('square')}
                variant={aspectRatio === 'square' ? 'default' : 'outline'}
                className={aspectRatio === 'square' ? 'bg-crd-green text-black' : 'text-white border-crd-mediumGray'}
                size="sm"
              >
                Square (1:1)
              </Button>
            </div>
            <Button
              onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
              variant="outline"
              size="sm"
              className="w-full text-white border-crd-mediumGray"
            >
              {aspectRatioLocked ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
              {aspectRatioLocked ? 'Locked' : 'Unlocked'}
            </Button>
          </div>

          {/* View Controls */}
          <div>
            <h3 className="text-white font-semibold mb-3">View Controls</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-crd-lightGray text-sm">Zoom</span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    variant="outline"
                    size="sm"
                    className="text-white border-crd-mediumGray"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-white text-sm min-w-[50px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                    variant="outline"
                    size="sm"
                    className="text-white border-crd-mediumGray"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant="outline"
                size="sm"
                className={`w-full ${showGrid ? 'bg-crd-blue text-white border-crd-blue' : 'text-white border-crd-mediumGray'}`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                {showGrid ? 'Hide Grid' : 'Show Grid'}
              </Button>
            </div>
          </div>

          {/* History Controls */}
          <div>
            <h3 className="text-white font-semibold mb-3">History</h3>
            <div className="flex gap-2">
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="outline"
                size="sm"
                className="flex-1 text-white border-crd-mediumGray disabled:opacity-50"
              >
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="outline"
                size="sm"
                className="flex-1 text-white border-crd-mediumGray disabled:opacity-50"
              >
                <Redo className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </div>
          </div>

          {/* Navigation & Actions */}
          <div className="pt-4 border-t border-crd-mediumGray/30">
            <div className="flex gap-2 mb-4">
              <Button
                onClick={goToPrevious}
                disabled={currentCardIndex === 0}
                variant="outline"
                size="sm"
                className="flex-1 text-white border-crd-mediumGray disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={skipCard}
                variant="outline"
                size="sm"
                className="flex-1 text-white border-crd-mediumGray"
              >
                Skip
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <Button
              onClick={applyCrop}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Crop & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
