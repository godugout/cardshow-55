
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Move, Square, Check, X, Download } from 'lucide-react';
import type { Card as CardType } from '@/types/card';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface BulkRecropInterfaceProps {
  cards: CardType[];
  onComplete: (croppedCards: { card: CardType; croppedImageUrl: string }[]) => void;
  onBack: () => void;
}

export const BulkRecropInterface = ({ cards, onComplete, onBack }: BulkRecropInterfaceProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 50,
    y: 50,
    width: 200,
    height: 280,
    rotation: 0
  });
  const [croppedResults, setCroppedResults] = useState<{ card: CardType; croppedImageUrl: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentCard = cards[currentCardIndex];

  useEffect(() => {
    if (currentCard) {
      loadImageAndDraw();
    }
  }, [currentCard, cropArea]);

  const loadImageAndDraw = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Draw crop overlay
      drawCropOverlay(ctx, canvas.width, canvas.height);
    };

    img.src = currentCard.image_url || currentCard.thumbnail_url || '/placeholder.svg';
  };

  const drawCropOverlay = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
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
    ctx.lineWidth = 3;
    ctx.strokeRect(-cropArea.width / 2, -cropArea.height / 2, cropArea.width, cropArea.height);

    // Draw corner handles
    ctx.fillStyle = '#10b981';
    const handleSize = 8;
    ctx.fillRect(-cropArea.width / 2 - handleSize/2, -cropArea.height / 2 - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.width / 2 - handleSize/2, -cropArea.height / 2 - handleSize/2, handleSize, handleSize);
    ctx.fillRect(-cropArea.width / 2 - handleSize/2, cropArea.height / 2 - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.width / 2 - handleSize/2, cropArea.height / 2 - handleSize/2, handleSize, handleSize);

    ctx.restore();
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
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const pos = getMousePos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;

    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, prev.x + dx),
      y: Math.max(0, prev.y + dy)
    }));

    setDragStart(pos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const applyCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard card dimensions
    canvas.width = 350;
    canvas.height = 490;

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
      // Reset crop area for next card
      setCropArea({
        x: 50,
        y: 50,
        width: 200,
        height: 280,
        rotation: 0
      });
    } else {
      // All cards processed
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Re-crop Cards</h2>
          <p className="text-crd-lightGray">
            Card {currentCardIndex + 1} of {cards.length}: {currentCard?.title}
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="text-white border-crd-mediumGray">
          Back
        </Button>
      </div>

      {/* Progress */}
      <div className="bg-crd-darker rounded-lg p-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card className="bg-crd-darker border-crd-mediumGray/20 p-4">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto border border-crd-mediumGray rounded cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ maxHeight: '60vh' }}
            />
            <img
              ref={imageRef}
              className="hidden"
              alt="Source"
            />
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Crop Controls */}
          <Card className="bg-crd-darker border-crd-mediumGray/20 p-4">
            <h3 className="text-white font-semibold mb-4">Crop Controls</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-crd-lightGray text-sm">Width</label>
                <Slider
                  value={[cropArea.width]}
                  onValueChange={([value]) => setCropArea(prev => ({ ...prev, width: value }))}
                  min={50}
                  max={500}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-crd-lightGray text-sm">Height</label>
                <Slider
                  value={[cropArea.height]}
                  onValueChange={([value]) => setCropArea(prev => ({ ...prev, height: value }))}
                  min={50}
                  max={500}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-crd-lightGray text-sm">Rotation</label>
                <Slider
                  value={[cropArea.rotation]}
                  onValueChange={([value]) => setCropArea(prev => ({ ...prev, rotation: value }))}
                  min={-45}
                  max={45}
                  step={5}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => setCropArea(prev => ({ ...prev, rotation: 0 }))}
                variant="outline"
                size="sm"
                className="w-full text-white border-crd-mediumGray"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Reset Rotation
              </Button>
            </div>
          </Card>

          {/* Actions */}
          <Card className="bg-crd-darker border-crd-mediumGray/20 p-4">
            <div className="space-y-3">
              <Button
                onClick={applyCrop}
                className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Crop & Next
              </Button>
              
              <Button
                onClick={skipCard}
                variant="outline"
                className="w-full text-white border-crd-mediumGray"
              >
                <X className="w-4 h-4 mr-2" />
                Skip This Card
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
