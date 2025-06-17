
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { ImprovedCropOverlay } from './enhanced-crop/ImprovedCropOverlay';
import { InteractiveCropSidebar } from './enhanced-crop/InteractiveCropSidebar';
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
  const CARD_ASPECT_RATIO = 2.5 / 3.5;
  const SQUARE_ASPECT_RATIO = 1;

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

  const handleAspectRatioChange = (type: 'card' | 'square') => {
    setAspectRatio(type);
    if (aspectRatioLocked) {
      const newRatio = type === 'card' ? CARD_ASPECT_RATIO : SQUARE_ASPECT_RATIO;
      setCropArea(prev => {
        const newHeight = prev.width / newRatio;
        const newCrop = { ...prev, height: newHeight };
        saveToHistory(newCrop);
        return newCrop;
      });
    }
  };

  useEffect(() => {
    if (currentCard) {
      loadImageAndDraw();
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
      
      const scale = Math.min(containerWidth / img.naturalWidth, containerHeight / img.naturalHeight);
      
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;

      // Clear and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = currentCard.image_url || currentCard.thumbnail_url || '/placeholder.svg';
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement>, handle: string) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragHandle(handle);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !canvasRef.current || !imageRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    setCropArea(prev => {
      let newCrop = { ...prev };
      const img = imageRef.current!;
      const maxX = img.clientWidth - prev.width;
      const maxY = img.clientHeight - prev.height;

      switch (dragHandle) {
        case 'move':
          newCrop.x = Math.max(0, Math.min(maxX, prev.x + deltaX));
          newCrop.y = Math.max(0, Math.min(maxY, prev.y + deltaY));
          break;

        case 'tl':
          const newWidth = prev.width - deltaX;
          const newHeight = aspectRatioLocked ? newWidth / getCurrentAspectRatio() : prev.height - deltaY;
          if (newWidth > 30 && newHeight > 30) {
            newCrop.x = prev.x + deltaX;
            newCrop.y = prev.y + (aspectRatioLocked ? deltaY : deltaY);
            newCrop.width = newWidth;
            newCrop.height = newHeight;
          }
          break;

        case 'tr':
          const trNewWidth = prev.width + deltaX;
          const trNewHeight = aspectRatioLocked ? trNewWidth / getCurrentAspectRatio() : prev.height - deltaY;
          if (trNewWidth > 30 && trNewHeight > 30) {
            newCrop.y = prev.y + (aspectRatioLocked ? -((trNewHeight - prev.height)) : deltaY);
            newCrop.width = trNewWidth;
            newCrop.height = trNewHeight;
          }
          break;

        case 'bl':
          const blNewWidth = prev.width - deltaX;
          const blNewHeight = aspectRatioLocked ? blNewWidth / getCurrentAspectRatio() : prev.height + deltaY;
          if (blNewWidth > 30 && blNewHeight > 30) {
            newCrop.x = prev.x + deltaX;
            newCrop.width = blNewWidth;
            newCrop.height = blNewHeight;
          }
          break;

        case 'br':
          const brNewWidth = prev.width + deltaX;
          const brNewHeight = aspectRatioLocked ? brNewWidth / getCurrentAspectRatio() : prev.height + deltaY;
          if (brNewWidth > 30 && brNewHeight > 30) {
            newCrop.width = brNewWidth;
            newCrop.height = brNewHeight;
          }
          break;

        case 'rotate':
          const centerX = prev.x + prev.width / 2;
          const centerY = prev.y + prev.height / 2;
          const angle = Math.atan2(currentY - centerY, currentX - centerX);
          newCrop.rotation = Math.round((angle * 180 / Math.PI) / 15) * 15;
          break;
      }

      // Ensure bounds
      newCrop.x = Math.max(0, Math.min(newCrop.x, img.clientWidth - newCrop.width));
      newCrop.y = Math.max(0, Math.min(newCrop.y, img.clientHeight - newCrop.height));

      return newCrop;
    });

    setDragStart({ x: currentX, y: currentY });
  }, [isDragging, dragHandle, dragStart, aspectRatioLocked, getCurrentAspectRatio]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      saveToHistory(cropArea);
    }
    setIsDragging(false);
    setDragHandle(null);
  }, [isDragging, cropArea, saveToHistory]);

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

  const applyCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = aspectRatio === 'card' ? 350 : 350;
    canvas.height = aspectRatio === 'card' ? 490 : 350;

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
        <Button onClick={onBack} className="bg-crd-blue hover:bg-crd-blue/80 text-white border-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 p-6 overflow-hidden" ref={containerRef}>
          <Card className="relative h-full bg-crd-darkGray border-crd-mediumGray/30 overflow-hidden">
            <div className="relative w-full h-full">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              />
              <img
                ref={imageRef}
                className="hidden"
                alt="Source"
              />
              
              <ImprovedCropOverlay
                cropArea={cropArea}
                zoom={zoom}
                imageLoaded={true}
                showGrid={showGrid}
                gridSize={20}
                aspectRatioLocked={aspectRatioLocked}
                onMouseDown={handleMouseDown}
                canvasWidth={canvasRef.current?.width || 0}
                canvasHeight={canvasRef.current?.height || 0}
              />
            </div>
          </Card>
        </div>

        <InteractiveCropSidebar
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          currentCard={currentCard}
          zoom={zoom}
          showGrid={showGrid}
          aspectRatioLocked={aspectRatioLocked}
          aspectRatio={aspectRatio}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          cropArea={cropArea}
          onZoomChange={setZoom}
          onToggleGrid={() => setShowGrid(!showGrid)}
          onToggleAspectRatio={() => setAspectRatioLocked(!aspectRatioLocked)}
          onSetAspectRatio={handleAspectRatioChange}
          onUndo={undo}
          onRedo={redo}
          onPrevious={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
          onNext={() => setCurrentCardIndex(Math.min(cards.length - 1, currentCardIndex + 1))}
          onApplyCrop={applyCrop}
          onBack={onBack}
        />
      </div>
    </div>
  );
};
