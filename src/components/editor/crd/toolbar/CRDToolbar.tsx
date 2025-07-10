import React, { useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Camera, Crop } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDMoreMenu } from './CRDMoreMenu';
interface CRDToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  gridType: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';
  onGridTypeChange: (type: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography') => void;
  showRulers: boolean;
  onRulersToggle: () => void;
  isPanning: boolean;
  onPanToggle: () => void;
  // New crop and upload props
  hasImage: boolean;
  isCropping: boolean;
  onImageUpload: () => void;
  onCropToggle: () => void;
}
export const CRDToolbar: React.FC<CRDToolbarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  showGrid,
  onGridToggle,
  gridType,
  onGridTypeChange,
  showRulers,
  onRulersToggle,
  isPanning,
  onPanToggle,
  hasImage,
  isCropping,
  onImageUpload,
  onCropToggle
}) => {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        onPanToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPanToggle]);
  return <div className="border-b border-crd-mediumGray/20 bg-crd-darker/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left: Primary Tools */}
          <div className="flex items-center gap-4">
            {/* Image Upload */}
            <CRDButton 
              variant="primary" 
              size="sm" 
              onClick={onImageUpload}
              className="h-8 px-3 text-xs"
              title="Upload image"
            >
              <Camera className="w-3 h-3 mr-1" />
              Upload
            </CRDButton>

            {/* Crop Tool - only visible when image is present */}
            {hasImage && (
              <CRDButton 
                variant={isCropping ? "primary" : "ghost"} 
                size="sm" 
                onClick={onCropToggle}
                className="h-8 px-3 text-xs"
                title="Crop image"
              >
                <Crop className="w-3 h-3 mr-1" />
                Crop
              </CRDButton>
            )}

            <div className="w-px h-6 bg-crd-mediumGray/30" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-crd-lightGray font-medium">Zoom:</span>
              <CRDButton variant="ghost" size="sm" onClick={onZoomOut} disabled={zoom <= 25} className="h-8 w-8 p-0">
                <ZoomOut className="w-3 h-3" />
              </CRDButton>
              
              <div className="text-crd-white text-xs font-mono bg-crd-darkest px-2 py-1 rounded min-w-[50px] text-center h-8 flex items-center justify-center">
                {Math.round(zoom)}%
              </div>
              
              <CRDButton variant="ghost" size="sm" onClick={onZoomIn} disabled={zoom >= 300} className="h-8 w-8 p-0">
                <ZoomIn className="w-3 h-3" />
              </CRDButton>
              
              <CRDButton variant="ghost" size="sm" onClick={onZoomReset} className="h-8 px-2 text-xs" title="Reset zoom (125%)">
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </CRDButton>
            </div>
          </div>

          {/* Right: More Menu */}
          <div className="flex items-center gap-2">
            <CRDMoreMenu
              showGrid={showGrid}
              onGridToggle={onGridToggle}
              gridType={gridType}
              onGridTypeChange={onGridTypeChange}
              showRulers={showRulers}
              onRulersToggle={onRulersToggle}
              isPanning={isPanning}
              onPanToggle={onPanToggle}
            />
          </div>
        </div>
      </div>
    </div>;
};