import React, { useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Grid3x3, LayoutGrid, Grid, Diamond, Construction, Camera, X, Ruler, Move, Edit3, ChevronDown } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
}

type GridType = 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';

const gridOptions: Array<{
  value: GridType | null;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = [
  { value: null, label: 'None', icon: X, color: 'text-gray-400' },
  { value: 'standard', label: 'Standard', icon: Grid3x3, color: 'text-blue-400' },
  { value: 'print', label: 'Print', icon: LayoutGrid, color: 'text-green-400' },
  { value: 'golden', label: 'Golden', icon: Grid, color: 'text-yellow-400' },
  { value: 'isometric', label: 'Isometric', icon: Diamond, color: 'text-purple-400' },
  { value: 'blueprint', label: 'Blueprint', icon: Construction, color: 'text-cyan-400' },
  { value: 'photography', label: 'Photography', icon: Camera, color: 'text-pink-400' }
];
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
  return <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 bg-crd-darker/80 backdrop-blur-sm border border-crd-mediumGray/30 rounded-lg shadow-lg">
      <div className="px-4 py-2">
        <div className="flex items-center gap-6 h-10">
          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-crd-lightGray font-medium">View:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CRDButton variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Select Grid Type">
                    {(() => {
                      const currentOption = gridOptions.find(option => option.value === (showGrid ? gridType : null));
                      const Icon = currentOption?.icon || X;
                      return (
                        <>
                          <Icon className={`w-3 h-3 mr-1 ${currentOption?.color || 'text-gray-400'}`} />
                          {currentOption?.label || 'None'}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </>
                      );
                    })()}
                  </CRDButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-crd-darker border-crd-mediumGray/30 min-w-[140px]">
                  {gridOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <DropdownMenuItem
                        key={option.value || 'none'}
                        className="text-crd-white hover:bg-crd-mediumGray/20 cursor-pointer"
                        onClick={() => {
                          if (option.value === null) {
                            if (showGrid) onGridToggle();
                          } else {
                            if (!showGrid) onGridToggle();
                            onGridTypeChange(option.value);
                          }
                        }}
                      >
                        <Icon className={`w-4 h-4 mr-2 ${option.color}`} />
                        {option.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <CRDButton variant={showRulers ? "primary" : "ghost"} size="sm" onClick={onRulersToggle} className="h-8 w-8 p-0" title="Toggle Rulers">
                <Ruler className="w-3 h-3" />
              </CRDButton>
            </div>

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

          <div className="w-px h-6 bg-crd-mediumGray/30" />

          {/* Interaction Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-crd-lightGray font-medium">Mode:</span>
            <div className="flex bg-crd-mediumGray/10 rounded-lg p-0.5">
              <CRDButton variant={!isPanning ? "primary" : "ghost"} size="sm" onClick={() => isPanning && onPanToggle()} className="h-7 px-3 text-xs" title="Edit Mode - Modify card elements with 3D perspective (Space to toggle)">
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </CRDButton>
              <CRDButton variant={isPanning ? "primary" : "ghost"} size="sm" onClick={() => !isPanning && onPanToggle()} className="h-7 px-3 text-xs" title="Pan Mode - Drag to move canvas view (Space to toggle)">
                <Move className="w-3 h-3 mr-1" />
                Pan
              </CRDButton>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>;
};