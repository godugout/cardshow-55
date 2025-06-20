
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
    <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      {/* Left Section - Format Selection */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-300">Format:</span>
        <div className="flex bg-gray-700 rounded p-0.5 h-7">
          <button
            onClick={() => onFormatChange('fullCard')}
            className={`px-2 py-1 text-xs rounded transition-all duration-200 flex items-center gap-1 ${
              cropFormat === 'fullCard'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Maximize className="w-3 h-3" />
            Card
          </button>
          <button
            onClick={() => onFormatChange('cropped')}
            className={`px-2 py-1 text-xs rounded transition-all duration-200 flex items-center gap-1 ${
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
          className={`h-7 px-2 text-xs transition-all duration-200 ${
            showGrid
              ? 'bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30'
              : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500'
          }`}
        >
          <Grid3X3 className="w-3 h-3 mr-1" />
          Grid
        </Button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded h-7">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            className="h-5 w-5 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-xs font-medium text-gray-300 w-8 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            className="h-5 w-5 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
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
          className="h-7 px-2 text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>

        {/* Apply Crop Button - SINGLE INSTANCE */}
        <Button
          onClick={onApplyCrop}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 h-7 text-xs"
        >
          <Check className="w-3 h-3 mr-1" />
          Apply
        </Button>
      </div>
    </div>
  );
};
