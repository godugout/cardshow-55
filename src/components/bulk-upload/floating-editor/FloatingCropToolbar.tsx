
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  Move, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Undo, 
  Redo, 
  Check, 
  X,
  Grid3X3,
  Lock,
  Unlock,
  RectangleHorizontal,
  RectangleVertical,
  Square
} from 'lucide-react';

interface FloatingCropToolbarProps {
  fileName: string;
  zoom: number;
  showGrid: boolean;
  aspectRatioLocked: boolean;
  aspectRatioMode: 'free' | 'landscape' | 'portrait' | 'square' | 'card';
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onToggleAspectRatio: () => void;
  onSetAspectRatio: (mode: 'free' | 'landscape' | 'portrait' | 'square' | 'card') => void;
  onUndo: () => void;
  onRedo: () => void;
  onApply: () => void;
  onCancel: () => void;
}

export const FloatingCropToolbar: React.FC<FloatingCropToolbarProps> = ({
  fileName,
  zoom,
  showGrid,
  aspectRatioLocked,
  aspectRatioMode,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onToggleAspectRatio,
  onSetAspectRatio,
  onUndo,
  onRedo,
  onApply,
  onCancel
}) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-crd-darker border border-crd-mediumGray/30 rounded-lg shadow-2xl p-4 animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Crop className="w-5 h-5 text-crd-green" />
          <div>
            <h3 className="text-white font-medium text-sm">Crop Image</h3>
            <p className="text-crd-lightGray text-xs truncate max-w-40">{fileName}</p>
          </div>
        </div>
        <Badge className="bg-crd-green text-black text-xs font-medium">
          {Math.round(zoom * 100)}%
        </Badge>
      </div>

      {/* Tools */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Aspect Ratio Presets */}
        <div className="flex items-center gap-1 bg-crd-darkGray rounded-md p-1">
          <Button
            onClick={() => onSetAspectRatio('card')}
            className={`h-8 w-8 p-0 border-0 ${
              aspectRatioMode === 'card' 
                ? 'bg-crd-green text-black' 
                : 'bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray'
            }`}
            title="Card Ratio (2.5:3.5)"
          >
            <RectangleVertical className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onSetAspectRatio('landscape')}
            className={`h-8 w-8 p-0 border-0 ${
              aspectRatioMode === 'landscape' 
                ? 'bg-crd-blue text-white' 
                : 'bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray'
            }`}
            title="Landscape (3:2)"
          >
            <RectangleHorizontal className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onSetAspectRatio('portrait')}
            className={`h-8 w-8 p-0 border-0 ${
              aspectRatioMode === 'portrait' 
                ? 'bg-crd-blue text-white' 
                : 'bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray'
            }`}
            title="Portrait (2:3)"
          >
            <RectangleVertical className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onSetAspectRatio('square')}
            className={`h-8 w-8 p-0 border-0 ${
              aspectRatioMode === 'square' 
                ? 'bg-crd-blue text-white' 
                : 'bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray'
            }`}
            title="Square (1:1)"
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onSetAspectRatio('free')}
            className={`h-8 w-8 p-0 border-0 ${
              aspectRatioMode === 'free' 
                ? 'bg-orange-500 text-white' 
                : 'bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray'
            }`}
            title="Free Form"
          >
            {aspectRatioMode === 'free' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-crd-darkGray rounded-md p-1">
          <Button
            onClick={onZoomOut}
            disabled={zoom <= 0.5}
            className="bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray border-0 h-8 w-8 p-0"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            onClick={onZoomIn}
            disabled={zoom >= 3}
            className="bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray border-0 h-8 w-8 p-0"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Grid Toggle */}
        <Button
          onClick={onToggleGrid}
          className={`h-8 w-8 p-0 border-0 ${
            showGrid 
              ? 'bg-crd-blue text-white' 
              : 'bg-crd-darkGray hover:bg-crd-mediumGray/20 text-crd-lightGray'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>

        {/* History Controls */}
        <div className="flex items-center gap-1 bg-crd-darkGray rounded-md p-1">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            className="bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray border-0 h-8 w-8 p-0 disabled:opacity-30"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            className="bg-transparent hover:bg-crd-mediumGray/20 text-crd-lightGray border-0 h-8 w-8 p-0 disabled:opacity-30"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-crd-mediumGray/30" />

        {/* Action Buttons */}
        <Button
          onClick={onCancel}
          className="bg-crd-mediumGray hover:bg-crd-mediumGray/80 text-white border-0 h-8 px-3 text-xs"
        >
          <X className="w-3 h-3 mr-1" />
          Cancel
        </Button>
        <Button
          onClick={onApply}
          className="bg-crd-green hover:bg-crd-green/90 text-black border-0 h-8 px-3 text-xs font-medium"
        >
          <Check className="w-3 h-3 mr-1" />
          Apply
        </Button>
      </div>
    </div>
  );
};
