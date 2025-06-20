
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  ZoomIn, 
  ZoomOut,
  Move,
  RotateCcw,
  AlignCenter,
  AlignStartVertical,
  AlignEndVertical,
  Image as ImageIcon
} from 'lucide-react';

interface ProfessionalCropSidebarProps {
  cropFormat: 'fullCard' | 'cropped';
  zoom: number;
  imageDimensions: { width: number; height: number };
  imageLoading: boolean;
  imageError: boolean;
  onZoomChange: (zoom: number) => void;
  onPresetPosition: (position: 'center' | 'top' | 'bottom') => void;
  compact?: boolean;
}

export const ProfessionalCropSidebar = ({
  cropFormat,
  zoom,
  imageDimensions,
  imageLoading,
  imageError,
  onZoomChange,
  onPresetPosition,
  compact = false
}: ProfessionalCropSidebarProps) => {
  const handleZoomIn = () => onZoomChange(Math.min(zoom + 0.25, 3));
  const handleZoomOut = () => onZoomChange(Math.max(zoom - 0.25, 0.5));

  if (compact) {
    return (
      <div className="bg-gray-800/50 border-l border-gray-700 p-4 max-h-[calc(88vh-4rem)] overflow-y-auto">
        {/* Format Info */}
        <div className="mb-5">
          <h3 className="text-white text-sm font-medium mb-3">Crop Format</h3>
          <Badge 
            className={`w-full justify-center py-2 ${
              cropFormat === 'fullCard' 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white'
            }`}
          >
            {cropFormat === 'fullCard' ? 'Trading Card (2.5:3.5)' : 'Square (1:1)'}
          </Badge>
        </div>

        <Separator className="my-4 bg-gray-600" />

        {/* Zoom Controls */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm font-medium">Zoom</span>
            <Badge variant="secondary" className="bg-gray-700 text-white text-sm">
              {Math.round(zoom * 100)}%
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          <Slider
            value={[zoom]}
            onValueChange={([value]) => onZoomChange(value)}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        <Separator className="my-4 bg-gray-600" />

        {/* Quick Position */}
        <div className="mb-5">
          <h3 className="text-white text-sm font-medium mb-3">Position</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPresetPosition('top')}
              className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <AlignStartVertical className="w-4 h-4 mr-2" />
              Top
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPresetPosition('center')}
              className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <AlignCenter className="w-4 h-4 mr-2" />
              Center
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPresetPosition('bottom')}
              className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <AlignEndVertical className="w-4 h-4 mr-2" />
              Bottom
            </Button>
          </div>
        </div>

        {/* Image Info */}
        {!imageLoading && !imageError && imageDimensions.width > 0 && (
          <div className="bg-gray-900/50 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Image Info</span>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Size: {Math.round(imageDimensions.width)} × {Math.round(imageDimensions.height)}</div>
              <div>Zoom: {Math.round(zoom * 100)}%</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-800/50 border-l border-gray-700 p-6 overflow-y-auto">
      {/* Format Information */}
      <div className="mb-6">
        <h3 className="text-white font-medium mb-3">Crop Format</h3>
        <Badge 
          className={`w-full justify-center py-2 ${
            cropFormat === 'fullCard' 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-600 text-white'
          }`}
        >
          {cropFormat === 'fullCard' ? 'Trading Card (2.5:3.5)' : 'Square (1:1)'}
        </Badge>
        
        <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
          <h4 className="text-gray-300 text-sm font-medium mb-2">About this format:</h4>
          <p className="text-gray-400 text-xs leading-relaxed">
            {cropFormat === 'fullCard' 
              ? 'Standard trading card proportions. Perfect for sports cards, entertainment cards, and collectibles.'
              : 'Square format ideal for social media, profile pictures, and modern designs.'
            }
          </p>
        </div>
      </div>

      <Separator className="my-6 bg-gray-600" />

      {/* Zoom Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Zoom</h3>
          <Badge variant="secondary" className="bg-gray-700 text-white">
            {Math.round(zoom * 100)}%
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        
        <Slider
          value={[zoom]}
          onValueChange={([value]) => onZoomChange(value)}
          min={0.5}
          max={3}
          step={0.1}
          className="w-full"
        />
        
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>50%</span>
          <span>300%</span>
        </div>
      </div>

      <Separator className="my-6 bg-gray-600" />

      {/* Quick Position Presets */}
      <div className="mb-6">
        <h3 className="text-white font-medium mb-3">Quick Position</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => onPresetPosition('top')}
            className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <AlignStartVertical className="w-4 h-4 mr-2" />
            Top Aligned
          </Button>
          <Button
            variant="outline"
            onClick={() => onPresetPosition('center')}
            className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <AlignCenter className="w-4 h-4 mr-2" />
            Center
          </Button>
          <Button
            variant="outline"
            onClick={() => onPresetPosition('bottom')}
            className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <AlignEndVertical className="w-4 h-4 mr-2" />
            Bottom Aligned
          </Button>
        </div>
      </div>

      <Separator className="my-6 bg-gray-600" />

      {/* Image Information */}
      {!imageLoading && !imageError && imageDimensions.width > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-gray-400" />
            <h3 className="text-white font-medium">Image Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Display Size:</span>
              <span className="text-gray-300">
                {Math.round(imageDimensions.width)} × {Math.round(imageDimensions.height)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Zoom Level:</span>
              <span className="text-gray-300">{Math.round(zoom * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {imageLoading && (
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
            <span className="text-gray-400">Loading image...</span>
          </div>
        </div>
      )}

      {imageError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-400 text-lg">⚠</span>
            <span className="text-red-400 font-medium">Image Error</span>
          </div>
          <p className="text-red-300 text-sm">
            Failed to load the image. Please try uploading a different file.
          </p>
        </div>
      )}
    </div>
  );
};
