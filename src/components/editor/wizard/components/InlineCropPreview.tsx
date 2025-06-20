
import React, { useState, useRef, useCallback } from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CropBounds } from '@/services/imageCropper';

interface InlineCropPreviewProps {
  selectedPhoto: string;
  onCropChange: (bounds: CropBounds) => void;
  aspectRatio?: number;
}

export const InlineCropPreview = ({
  selectedPhoto,
  onCropChange,
  aspectRatio = 2.5 / 3.5
}: InlineCropPreviewProps) => {
  const [cropBounds, setCropBounds] = useState<CropBounds>({
    x: 15,
    y: 10,
    width: 70,
    height: 70 / aspectRatio
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setCropBounds(prev => {
      const newBounds = {
        ...prev,
        x: Math.max(0, Math.min(100 - prev.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(100 - prev.height, prev.y + deltaY))
      };
      onCropChange(newBounds);
      return newBounds;
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, onCropChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="space-y-3">
      {/* Inline Crop Preview */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] bg-crd-mediumGray/20 rounded-lg overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
      >
        <img
          src={selectedPhoto}
          alt="Crop preview"
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Dark overlay with crop window cutout */}
        <div
          className="absolute inset-0 bg-black/60 pointer-events-none"
          style={{
            clipPath: `polygon(
              0% 0%, 
              ${cropBounds.x}% 0%, 
              ${cropBounds.x}% ${cropBounds.y}%, 
              ${cropBounds.x + cropBounds.width}% ${cropBounds.y}%, 
              ${cropBounds.x + cropBounds.width}% ${cropBounds.y + cropBounds.height}%, 
              ${cropBounds.x}% ${cropBounds.y + cropBounds.height}%, 
              ${cropBounds.x}% 100%, 
              0% 100%, 
              0% 0%, 
              100% 0%, 
              100% 100%, 
              ${cropBounds.x + cropBounds.width}% 100%, 
              ${cropBounds.x + cropBounds.width}% ${cropBounds.y + cropBounds.height}%, 
              ${cropBounds.x + cropBounds.width}% ${cropBounds.y}%, 
              100% ${cropBounds.y}%, 
              100% 0%
            )`
          }}
        />

        {/* Crop area border */}
        <div
          className="absolute border-2 border-crd-green pointer-events-none"
          style={{
            left: `${cropBounds.x}%`,
            top: `${cropBounds.y}%`,
            width: `${cropBounds.width}%`,
            height: `${cropBounds.height}%`,
            boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.3)'
          }}
        >
          {/* Grid overlay */}
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-50">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-crd-green/30" />
            ))}
          </div>
        </div>

        {/* Aspect ratio indicator */}
        <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded text-xs font-medium">
          2.5:3.5 Card
        </div>
      </div>

      {/* Simple controls */}
      <div className="flex items-center justify-between">
        <span className="text-crd-lightGray text-sm">Drag to adjust crop area</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newBounds = { x: 15, y: 10, width: 70, height: 70 / aspectRatio };
              setCropBounds(newBounds);
              onCropChange(newBounds);
            }}
            className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40"
          >
            <RotateCw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
