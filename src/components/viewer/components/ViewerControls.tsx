
import React from 'react';
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Sun, Info } from 'lucide-react';

interface ViewerControlsProps {
  showEffects: boolean;
  showBackgroundInfo: boolean;
  interactiveLighting: boolean;
  onToggleEffects: () => void;
  onToggleBackgroundInfo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  showEffects,
  showBackgroundInfo,
  interactiveLighting,
  onToggleEffects,
  onToggleBackgroundInfo,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-2">
        {/* Effects Toggle */}
        <button
          onClick={onToggleEffects}
          className={`p-2 rounded-md transition-colors ${
            showEffects 
              ? 'bg-white/20 text-white' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title={showEffects ? "Hide Effects" : "Show Effects"}
        >
          {showEffects ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Background Info Toggle */}
        <button
          onClick={onToggleBackgroundInfo}
          className={`p-2 rounded-md transition-colors ${
            showBackgroundInfo 
              ? 'bg-white/20 text-white' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title={showBackgroundInfo ? "Hide Background Info" : "Show Background Info"}
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Interactive Lighting Indicator */}
        {interactiveLighting && (
          <div className="p-2 text-yellow-400" title="Interactive Lighting Active">
            <Sun className="w-4 h-4" />
          </div>
        )}

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Zoom Controls */}
        <button
          onClick={onZoomIn}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={onZoomOut}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
