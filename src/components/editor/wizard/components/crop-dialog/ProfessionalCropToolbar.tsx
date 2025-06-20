
import React from 'react';
import { Grid3X3, ZoomIn, ZoomOut, RotateCcw, Maximize, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfessionalCropToolbarProps {
  cropFormat: 'fullCard' | 'cropped';
  showGrid: boolean;
  zoom: number;
  onFormatChange: (format: 'fullCard' | 'cropped') => void;
  onToggleGrid: () => void;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
}

export const ProfessionalCropToolbar = ({
  cropFormat,
  showGrid,
  zoom,
  onFormatChange,
  onToggleGrid,
  onZoomChange,
  onReset
}: ProfessionalCropToolbarProps) => {
  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Left Section - Format Selection */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-300">Format:</span>
        <div className="flex bg-gray-700 rounded-lg p-1 h-9">
          <button
            onClick={() => onFormatChange('fullCard')}
            className={`px-4 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-2 h-7 ${
              cropFormat === 'fullCard'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Maximize className="w-3.5 h-3.5" />
            Trading Card
          </button>
          <button
            onClick={() => onFormatChange('cropped')}
            className={`px-4 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-2 h-7 ${
              cropFormat === 'cropped'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            Square
          </button>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-4">
        {/* View Options Group */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleGrid}
            className={`h-9 transition-all duration-200 ${
              showGrid
                ? 'bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30'
                : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500'
            }`}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Grid
          </Button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-600" />

        {/* Zoom Controls Group */}
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-lg h-9">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-gray-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-600" />

        {/* Action Group */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-9 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
