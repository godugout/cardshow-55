
import React, { useCallback, useRef, useState } from 'react';
import type { CropBounds } from '@/services/imageCropper';

interface InteractiveCropAreaProps {
  cropBounds: CropBounds;
  setCropBounds: (bounds: CropBounds) => void;
  imageDimensions: { width: number; height: number };
  imagePosition: { x: number; y: number };
  zoom: number;
  aspectRatio?: number;
  showGrid?: boolean;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | 'move';

export const InteractiveCropArea = ({
  cropBounds,
  setCropBounds,
  imageDimensions,
  imagePosition,
  zoom,
  aspectRatio,
  showGrid = true
}: InteractiveCropAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, bounds: cropBounds });
  const cropRef = useRef<HTMLDivElement>(null);

  // Calculate crop area position and size in pixels
  const cropPixels = {
    left: imagePosition.x + (cropBounds.x / 100) * imageDimensions.width * zoom,
    top: imagePosition.y + (cropBounds.y / 100) * imageDimensions.height * zoom,
    width: (cropBounds.width / 100) * imageDimensions.width * zoom,
    height: (cropBounds.height / 100) * imageDimensions.height * zoom
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      bounds: { ...cropBounds }
    });
  }, [cropBounds]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragHandle) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Convert pixel deltas to percentage
    const deltaXPercent = (deltaX / (imageDimensions.width * zoom)) * 100;
    const deltaYPercent = (deltaY / (imageDimensions.height * zoom)) * 100;

    let newBounds = { ...dragStart.bounds };

    switch (dragHandle) {
      case 'move':
        newBounds.x = Math.max(0, Math.min(100 - newBounds.width, dragStart.bounds.x + deltaXPercent));
        newBounds.y = Math.max(0, Math.min(100 - newBounds.height, dragStart.bounds.y + deltaYPercent));
        break;

      case 'nw':
        newBounds.x = Math.max(0, dragStart.bounds.x + deltaXPercent);
        newBounds.y = Math.max(0, dragStart.bounds.y + deltaYPercent);
        newBounds.width = dragStart.bounds.width - deltaXPercent;
        newBounds.height = dragStart.bounds.height - deltaYPercent;
        break;

      case 'ne':
        newBounds.y = Math.max(0, dragStart.bounds.y + deltaYPercent);
        newBounds.width = dragStart.bounds.width + deltaXPercent;
        newBounds.height = dragStart.bounds.height - deltaYPercent;
        break;

      case 'sw':
        newBounds.x = Math.max(0, dragStart.bounds.x + deltaXPercent);
        newBounds.width = dragStart.bounds.width - deltaXPercent;
        newBounds.height = dragStart.bounds.height + deltaYPercent;
        break;

      case 'se':
        newBounds.width = dragStart.bounds.width + deltaXPercent;
        newBounds.height = dragStart.bounds.height + deltaYPercent;
        break;

      case 'n':
        newBounds.y = Math.max(0, dragStart.bounds.y + deltaYPercent);
        newBounds.height = dragStart.bounds.height - deltaYPercent;
        break;

      case 's':
        newBounds.height = dragStart.bounds.height + deltaYPercent;
        break;

      case 'e':
        newBounds.width = dragStart.bounds.width + deltaXPercent;
        break;

      case 'w':
        newBounds.x = Math.max(0, dragStart.bounds.x + deltaXPercent);
        newBounds.width = dragStart.bounds.width - deltaXPercent;
        break;
    }

    // Apply aspect ratio constraint if specified
    if (aspectRatio && dragHandle !== 'move') {
      if (dragHandle.includes('e') || dragHandle.includes('w')) {
        newBounds.height = newBounds.width / aspectRatio;
      } else if (dragHandle.includes('n') || dragHandle.includes('s')) {
        newBounds.width = newBounds.height * aspectRatio;
      }
    }

    // Ensure bounds stay within image
    newBounds.width = Math.max(5, Math.min(100 - newBounds.x, newBounds.width));
    newBounds.height = Math.max(5, Math.min(100 - newBounds.y, newBounds.height));
    
    if (newBounds.x + newBounds.width > 100) {
      newBounds.x = 100 - newBounds.width;
    }
    if (newBounds.y + newBounds.height > 100) {
      newBounds.y = 100 - newBounds.height;
    }

    setCropBounds(newBounds);
  }, [isDragging, dragHandle, dragStart, imageDimensions, zoom, aspectRatio, setCropBounds]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = dragHandle === 'move' ? 'move' : 
        dragHandle?.includes('n') || dragHandle?.includes('s') ? 'ns-resize' :
        dragHandle?.includes('e') || dragHandle?.includes('w') ? 'ew-resize' :
        dragHandle === 'nw' || dragHandle === 'se' ? 'nwse-resize' :
        'nesw-resize';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, dragHandle]);

  return (
    <>
      {/* Crop Overlay */}
      <div
        ref={cropRef}
        className="absolute border-2 border-crd-green bg-transparent cursor-move group"
        style={{
          left: cropPixels.left,
          top: cropPixels.top,
          width: cropPixels.width,
          height: cropPixels.height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)', // Dark overlay outside crop
          borderRadius: aspectRatio === 1 ? '8px' : '4px'
        }}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
        {/* Grid Lines */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-50">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-white/30" />
              ))}
            </div>
          </div>
        )}

        {/* Resize Handles */}
        {[
          { handle: 'nw', className: 'top-0 left-0 cursor-nw-resize' },
          { handle: 'ne', className: 'top-0 right-0 cursor-ne-resize' },
          { handle: 'sw', className: 'bottom-0 left-0 cursor-sw-resize' },
          { handle: 'se', className: 'bottom-0 right-0 cursor-se-resize' },
          { handle: 'n', className: 'top-0 left-1/2 -translate-x-1/2 cursor-n-resize' },
          { handle: 's', className: 'bottom-0 left-1/2 -translate-x-1/2 cursor-s-resize' },
          { handle: 'e', className: 'top-1/2 right-0 -translate-y-1/2 cursor-e-resize' },
          { handle: 'w', className: 'top-1/2 left-0 -translate-y-1/2 cursor-w-resize' }
        ].map(({ handle, className }) => (
          <div
            key={handle}
            className={`absolute w-3 h-3 bg-crd-green border border-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-125 transform -translate-x-1/2 -translate-y-1/2 ${className}`}
            onMouseDown={(e) => handleMouseDown(e, handle as ResizeHandle)}
          />
        ))}

        {/* Format Label */}
        <div className="absolute -top-8 left-0 bg-crd-green text-black text-xs px-2 py-1 rounded-md font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {aspectRatio ? (aspectRatio === 1 ? 'Square' : '2.5:3.5') : 'Free'}
        </div>
      </div>
    </>
  );
};
