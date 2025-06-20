
import React from 'react';
import { Grid3X3, ZoomIn, ZoomOut, RotateCcw, Maximize, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CropToolbarProps {
  cropFormat: 'fullCard' | 'cropped';
  showGrid: boolean;
  zoom: number;
  onFormatChange: (format: 'fullCard' | 'cropped') => void;
  onToggleGrid: () => void;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
}

export const CropToolbar = ({
  cropFormat,
  showGrid,
  zoom,
  onFormatChange,
  onToggleGrid,
  onZoomChange,
  onReset
}: CropToolbarProps) => {
  return (
    <div className="h-12 bg-crd-mediumGray/20 border-b border-crd-mediumGray/30 flex items-center justify-between px-4">
      {/* Format Selection */}
      <div className="flex bg-crd-darkGray rounded-lg p-1">
        <button
          onClick={() => onFormatChange('fullCard')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            cropFormat === 'fullCard'
              ? 'bg-crd-green text-black font-medium'
              : 'text-crd-lightGray hover:text-white'
          }`}
        >
          <Maximize className="w-3 h-3 mr-1.5 inline" />
          Full Card (2.5:3.5)
        </button>
        <button
          onClick={() => onFormatChange('cropped')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            cropFormat === 'cropped'
              ? 'bg-crd-green text-black font-medium'
              : 'text-crd-lightGray hover:text-white'
          }`}
        >
          <Square className="w-3 h-3 mr-1.5 inline" />
          Square Crop
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleGrid}
          className={`${
            showGrid
              ? 'bg-crd-blue/20 border-crd-blue text-crd-blue'
              : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white'
          }`}
        >
          <Grid3X3 className="w-3 h-3 mr-1.5" />
          Grid (G)
        </Button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-crd-lightGray text-sm w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
        >
          <RotateCcw className="w-3 h-3 mr-1.5" />
          Reset
        </Button>
      </div>
    </div>
  );
};
