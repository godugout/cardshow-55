
import React from 'react';
import { CropArea, DragHandle } from './types';
import { RotateCw, Move, X } from 'lucide-react';
import type { DesignTemplate } from '@/types/card';

interface StreamlinedCropOverlayProps {
  cropAreas: CropArea[];
  selectedCropIds: string[];
  zoom: number;
  imageLoaded: boolean;
  showGrid: boolean;
  gridSize: number;
  template?: DesignTemplate;
  showTemplateguide?: boolean;
  onMouseDown: (e: React.MouseEvent, cropId: string, handle?: DragHandle) => void;
  onCropSelect: (cropId: string, multiSelect?: boolean) => void;
  onRemoveCrop?: (cropId: string) => void;
}

export const StreamlinedCropOverlay: React.FC<StreamlinedCropOverlayProps> = ({
  cropAreas,
  selectedCropIds,
  zoom,
  imageLoaded,
  showGrid,
  gridSize,
  template,
  showTemplateguide = true,
  onMouseDown,
  onCropSelect,
  onRemoveCrop
}) => {
  if (!imageLoaded) return null;

  const isSelected = (cropId: string) => selectedCropIds.includes(cropId);

  return (
    <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
      {/* Background Dimming Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Template Guide Overlay */}
      {showTemplateguide && template && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="template-outline" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2,2"/>
              </pattern>
            </defs>
            {/* Standard 2.5x3.5 card outline centered on image */}
            <rect
              x="20%"
              y="10%"
              width="60%"
              height="80%"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeDasharray="8,4"
              rx="8"
              opacity="0.7"
            />
            <text
              x="50%"
              y="5%"
              textAnchor="middle"
              fill="#8b5cf6"
              fontSize="12"
              opacity="0.8"
            >
              2.5" × 3.5" Card Template
            </text>
          </svg>
        </div>
      )}

      {/* Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Crop Areas */}
      {cropAreas.map((crop) => {
        if (crop.visible === false) return null;
        
        const selected = isSelected(crop.id);
        const handleSize = 10;
        
        return (
          <div key={crop.id}>
            {/* Clear area showing the actual crop */}
            <div
              className="absolute bg-transparent"
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                transform: `rotate(${crop.rotation}deg)`,
                transformOrigin: 'center',
                borderRadius: crop.cornerRadius || 4,
                backdropFilter: 'none',
                backgroundColor: 'transparent',
                mixBlendMode: 'screen'
              }}
            />
            
            {/* Crop Border and Controls */}
            <div
              className={`absolute border-2 cursor-move transition-all duration-200 ${
                selected ? 'border-4 shadow-lg' : 'border-2 hover:border-4'
              }`}
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                borderColor: crop.color,
                boxShadow: selected ? `0 0 0 2px ${crop.color}40, 0 4px 12px rgba(0,0,0,0.25)` : `0 0 0 1px ${crop.color}80`,
                transform: `rotate(${crop.rotation}deg)`,
                transformOrigin: 'center',
                borderRadius: crop.cornerRadius || 4,
                backgroundColor: selected ? `${crop.color}10` : 'transparent',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onCropSelect(crop.id, e.ctrlKey || e.metaKey);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                onMouseDown(e, crop.id, 'move');
              }}
            >
              {/* Label */}
              <div 
                className="absolute -top-8 left-0 text-white text-xs font-medium px-3 py-1 rounded-full pointer-events-none flex items-center gap-2 shadow-lg"
                style={{ 
                  backgroundColor: crop.color,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                {crop.label}
                {crop.rotation !== 0 && <span>({crop.rotation}°)</span>}
                {crop.id !== 'main' && onRemoveCrop && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCrop(crop.id);
                    }}
                    className="pointer-events-auto hover:bg-black/20 rounded-full p-1 transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Selection Handles - Only show when selected */}
              {selected && (
                <>
                  {/* Corner Handles */}
                  {['tl', 'tr', 'bl', 'br'].map((handle) => (
                    <div
                      key={handle}
                      className="absolute border-2 cursor-pointer hover:scale-125 transition-transform bg-white rounded-sm shadow-lg"
                      style={{
                        width: handleSize,
                        height: handleSize,
                        backgroundColor: crop.color,
                        borderColor: 'white',
                        top: handle.includes('t') ? -handleSize/2 : 'auto',
                        bottom: handle.includes('b') ? -handleSize/2 : 'auto',
                        left: handle.includes('l') ? -handleSize/2 : 'auto',
                        right: handle.includes('r') ? -handleSize/2 : 'auto',
                        cursor: handle === 'tl' || handle === 'br' ? 'nw-resize' : 'ne-resize'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMouseDown(e, crop.id, handle as DragHandle);
                      }}
                    />
                  ))}

                  {/* Rotation Handle */}
                  <div
                    className="absolute flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-white border-2 rounded-full shadow-lg"
                    style={{
                      width: handleSize + 2,
                      height: handleSize + 2,
                      backgroundColor: crop.color,
                      borderColor: 'white',
                      top: -handleSize * 2.5,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMouseDown(e, crop.id, 'rotate');
                    }}
                  >
                    <RotateCw className="w-3 h-3 text-white" />
                  </div>

                  {/* Move Handle (center) */}
                  <div
                    className="absolute flex items-center justify-center cursor-move hover:scale-110 transition-transform bg-white border-2 rounded shadow-lg"
                    style={{
                      width: handleSize + 4,
                      height: handleSize + 4,
                      backgroundColor: `${crop.color}E6`,
                      borderColor: 'white',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMouseDown(e, crop.id, 'move');
                    }}
                  >
                    <Move className="w-3 h-3 text-white" />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
