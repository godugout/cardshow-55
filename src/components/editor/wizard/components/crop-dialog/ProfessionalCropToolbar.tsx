
import React from 'react';
import { Grid3X3, ZoomIn, ZoomOut, RotateCcw, Maximize, Square, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfessionalCropToolbarProps {
  cropFormat: 'fullCard' | 'cropped';
  showGrid: boolean;
  zoom: number;
  onFormatChange: (format: 'fullCard' | 'cropped') => void;
  onToggleGrid: () => void;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
  onApplyCrop: () => void;
}

export const ProfessionalCropToolbar = ({
  cropFormat,
  showGrid,
  zoom,
  onFormatChange,
  onToggleGrid,
  onZoomChange,
  onReset,
  onApplyCrop
}: ProfessionalCropToolbarProps) => {
  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      {/* Left Section - Format Selection */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-300">Format:</span>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => onFormatChange('fullCard')}
            className={`px-3 py-1 text-sm rounded-md transition-all duration-200 flex items-center gap-1 ${
              cropFormat === 'fullCard'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Maximize className="w-3 h-3" />
            Trading Card
          </button>
          <button
            onClick={() => onFormatChange('cropped')}
            className={`px-3 py-1 text-sm rounded-md transition-all duration-200 flex items-center gap-1 ${
              cropFormat === 'cropped'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Square className="w-3 h-3" />
            Square
          </button>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-2">
        {/* Grid Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleGrid}
          className={`h-8 px-3 text-xs transition-all duration-200 ${
            showGrid
              ? 'bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30'
              : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500'
          }`}
        >
          <Grid3X3 className="w-3 h-3 mr-1" />
          Grid
        </Button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded h-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            className="h-6 w-6 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-xs font-medium text-gray-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            className="h-6 w-6 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
            disabled={zoom >= 3}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8 px-3 text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>

        {/* Apply Crop Button */}
        <Button
          onClick={onApplyCrop}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 h-8 text-xs"
        >
          <Check className="w-3 h-3 mr-1" />
          Apply Crop
        </Button>
      </div>
    </div>
  );
};
