import React, { useEffect } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, Grid3x3, Ruler, 
  Move, Maximize2, Edit3 
} from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomFit: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  gridType: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';
  onGridTypeChange: (type: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography') => void;
  showRulers: boolean;
  onRulersToggle: () => void;
  isPanning: boolean;
  onPanToggle: () => void;
}

export const CRDToolbar: React.FC<CRDToolbarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomFit,
  showGrid,
  onGridToggle,
  gridType,
  onGridTypeChange,
  showRulers,
  onRulersToggle,
  isPanning,
  onPanToggle
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
  return (
    <div className="border-b border-crd-mediumGray/20 bg-crd-darker/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left: View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-crd-lightGray font-medium">View:</span>
              <CRDButton
                variant={showGrid ? "primary" : "ghost"}
                size="sm"
                onClick={onGridToggle}
                className="h-8 w-8 p-0"
                title="Toggle Grid"
              >
                <Grid3x3 className="w-3 h-3" />
              </CRDButton>
              
              {showGrid && (
                <select
                  value={gridType}
                  onChange={(e) => onGridTypeChange(e.target.value as typeof gridType)}
                  className="bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1 text-xs text-crd-white h-8"
                >
                  <option value="standard">Standard</option>
                  <option value="print">Print</option>
                  <option value="golden">Golden</option>
                  <option value="isometric">Isometric</option>
                  <option value="blueprint">Blueprint</option>
                  <option value="photography">Photography</option>
                </select>
              )}
              
              <CRDButton
                variant={showRulers ? "primary" : "ghost"}
                size="sm"
                onClick={onRulersToggle}
                className="h-8 w-8 p-0"
                title="Toggle Rulers"
              >
                <Ruler className="w-3 h-3" />
              </CRDButton>
            </div>

            <div className="w-px h-6 bg-crd-mediumGray/30" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-crd-lightGray font-medium">Zoom:</span>
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                disabled={zoom <= 25}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="w-3 h-3" />
              </CRDButton>
              
              <div className="text-crd-white text-xs font-mono bg-crd-darkest px-2 py-1 rounded min-w-[50px] text-center h-8 flex items-center justify-center">
                {Math.round(zoom)}%
              </div>
              
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                disabled={zoom >= 300}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="w-3 h-3" />
              </CRDButton>
              
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={onZoomReset}
                className="h-8 px-2 text-xs"
                title="Reset zoom (100%)"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </CRDButton>
              
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={onZoomFit}
                className="h-8 px-2 text-xs"
                title="Fit to screen"
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Fit
              </CRDButton>
            </div>
          </div>

          {/* Right: Interaction Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-crd-lightGray font-medium">Mode:</span>
            <div className="flex bg-crd-mediumGray/10 rounded-lg p-0.5">
              <CRDButton
                variant={!isPanning ? "primary" : "ghost"}
                size="sm"
                onClick={() => isPanning && onPanToggle()}
                className="h-7 px-3 text-xs"
                title="Edit Mode - Modify card elements with 3D perspective (Space to toggle)"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </CRDButton>
              <CRDButton
                variant={isPanning ? "primary" : "ghost"}
                size="sm"
                onClick={() => !isPanning && onPanToggle()}
                className="h-7 px-3 text-xs"
                title="Pan Mode - Drag to move canvas view (Space to toggle)"
              >
                <Move className="w-3 h-3 mr-1" />
                Pan
              </CRDButton>
            </div>
            
            <div className="text-xs text-crd-lightGray/60 ml-2">
              {isPanning ? '🖱️ Drag to pan • Space to exit' : '✏️ Edit card • Space for pan mode'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};