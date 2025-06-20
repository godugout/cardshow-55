
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  RotateCcw, 
  Grid3X3, 
  ZoomIn, 
  ZoomOut,
  Square,
  CreditCard,
  Check
} from 'lucide-react';

interface ProfessionalCropToolbarProps {
  cropFormat: 'fullCard' | 'cropped';
  showGrid: boolean;
  zoom: number;
  onFormatChange: (format: 'fullCard' | 'cropped') => void;
  onToggleGrid: () => void;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
  onApplyCrop: () => void;
  compact?: boolean;
}

export const ProfessionalCropToolbar = ({
  cropFormat,
  showGrid,
  zoom,
  onFormatChange,
  onToggleGrid,
  onZoomChange,
  onReset,
  onApplyCrop,
  compact = false
}: ProfessionalCropToolbarProps) => {
  const handleZoomIn = () => onZoomChange(Math.min(zoom + 0.25, 3));
  const handleZoomOut = () => onZoomChange(Math.max(zoom - 0.25, 0.5));

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Format Toggle */}
        <div className="flex bg-gray-800 rounded p-1">
          <Button
            variant={cropFormat === 'fullCard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFormatChange('fullCard')}
            className={`h-6 px-2 text-xs ${
              cropFormat === 'fullCard' 
                ? 'bg-crd-green hover:bg-crd-green/90 text-black' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Card
          </Button>
          <Button
            variant={cropFormat === 'cropped' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFormatChange('cropped')}
            className={`h-6 px-2 text-xs ${
              cropFormat === 'cropped' 
                ? 'bg-crd-blue hover:bg-crd-blue/90 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Square className="w-3 h-3 mr-1" />
            Square
          </Button>
        </div>

        {/* Quick controls */}
        <Button
          variant={showGrid ? 'default' : 'outline'}
          size="sm"
          onClick={onToggleGrid}
          className={`h-6 px-2 ${
            showGrid 
              ? 'bg-crd-blue hover:bg-crd-blue/90 text-white' 
              : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Grid3X3 className="w-3 h-3" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-6 px-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>

        <Button
          onClick={onApplyCrop}
          className="h-6 px-3 bg-crd-green hover:bg-crd-green/90 text-black text-xs font-medium"
        >
          <Check className="w-3 h-3 mr-1" />
          Apply
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-gray-800/30 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Format Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 font-medium">Format:</span>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <Button
                variant={cropFormat === 'fullCard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFormatChange('fullCard')}
                className={`${
                  cropFormat === 'fullCard' 
                    ? 'bg-crd-green hover:bg-crd-green/90 text-black' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Trading Card (2.5:3.5)
              </Button>
              <Button
                variant={cropFormat === 'cropped' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFormatChange('cropped')}
                className={`${
                  cropFormat === 'cropped' 
                    ? 'bg-crd-blue hover:bg-crd-blue/90 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Square className="w-4 h-4 mr-2" />
                Square (1:1)
              </Button>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6 bg-gray-600" />

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={showGrid ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleGrid}
              className={showGrid ? 'bg-crd-blue hover:bg-crd-blue/90 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 bg-gray-600" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Zoom:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Badge variant="secondary" className="bg-gray-700 text-white min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={onApplyCrop}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  );
};
