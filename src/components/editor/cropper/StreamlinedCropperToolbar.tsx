
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  ZoomIn, 
  ZoomOut,
  Eye,
  EyeOff,
  Undo,
  Redo,
  Grid3X3,
  ArrowLeft,
  Square,
  Layers
} from 'lucide-react';

interface StreamlinedCropperToolbarProps {
  cropCount: number;
  showPreview: boolean;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onTogglePreview: () => void;
  onToggleGrid: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExtractAll: () => void;
  onCancel: () => void;
  onAddFrame: () => void;
  onAddElement: () => void;
  imageLoaded: boolean;
  isExtracting: boolean;
}

export const StreamlinedCropperToolbar: React.FC<StreamlinedCropperToolbarProps> = ({
  cropCount,
  showPreview,
  showGrid,
  canUndo,
  canRedo,
  onTogglePreview,
  onToggleGrid,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onUndo,
  onRedo,
  onExtractAll,
  onCancel,
  onAddFrame,
  onAddElement,
  imageLoaded,
  isExtracting
}) => {
  return (
    <div className="bg-crd-darkest border-b border-crd-mediumGray/30">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between p-4">
        {/* Left: Title and Big Action Buttons */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-semibold text-lg">Template-Aware Cropper</h3>
            <Badge className="bg-crd-green text-black font-medium">
              {cropCount} layer{cropCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          {/* Big Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onAddFrame}
              disabled={!imageLoaded}
              className="bg-crd-blue hover:bg-crd-blue/90 text-white font-semibold px-6 py-3 h-12"
            >
              <Square className="w-5 h-5 mr-2" />
              Frame
            </Button>
            
            <Button
              onClick={onAddElement}
              disabled={!imageLoaded}
              className="bg-crd-orange hover:bg-crd-orange/90 text-white font-semibold px-6 py-3 h-12"
            >
              <Layers className="w-5 h-5 mr-2" />
              Element
            </Button>
          </div>
        </div>

        {/* Right: Controls and Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Controls */}
          <div className="flex items-center gap-2 mr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleGrid}
              className={`${showGrid ? 'bg-crd-blue text-white border-crd-blue' : 'bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray'}`}
              title="Toggle Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onTogglePreview}
              className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray"
              title="Toggle Card Preview"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 mr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomOut}
              disabled={zoom <= 0.5}
              className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <button
              onClick={onZoomFit}
              className="text-white text-sm hover:text-crd-green transition-colors min-w-[60px] font-medium"
              title="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={onZoomIn}
              disabled={zoom >= 3}
              className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Primary Actions */}
          <Button
            onClick={onExtractAll}
            disabled={!imageLoaded || isExtracting}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-6"
          >
            {isExtracting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Crop className="w-4 h-4 mr-2" />
                Extract Cards
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onCancel}
            className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};
