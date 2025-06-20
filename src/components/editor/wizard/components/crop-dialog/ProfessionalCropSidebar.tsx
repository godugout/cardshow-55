
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, AlignCenter, MoveUp, MoveDown } from 'lucide-react';

interface ProfessionalCropSidebarProps {
  cropFormat: 'fullCard' | 'cropped';
  zoom: number;
  imageDimensions: { width: number; height: number };
  imageLoading: boolean;
  imageError: boolean;
  onZoomChange: (zoom: number) => void;
  onPresetPosition: (position: 'center' | 'top' | 'bottom') => void;
}

export const ProfessionalCropSidebar = ({
  cropFormat,
  zoom,
  imageDimensions,
  imageLoading,
  imageError,
  onZoomChange,
  onPresetPosition
}: ProfessionalCropSidebarProps) => {
  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
      {/* Format Info */}
      <div>
        <h3 className="text-white font-medium text-sm mb-2">Crop Format</h3>
        <Badge className={`${
          cropFormat === 'fullCard' 
            ? 'bg-green-600/20 text-green-400 border-green-500/30' 
            : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
        }`}>
          {cropFormat === 'fullCard' ? 'Trading Card (2.5:3.5)' : 'Square (1:1)'}
        </Badge>
      </div>

      {/* Zoom Control */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white font-medium text-sm">Zoom</label>
          <span className="text-xs text-gray-400">{Math.round(zoom * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={zoom}
          onChange={(e) => onZoomChange(parseFloat(e.target.value))}
          className="w-full accent-green-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>50%</span>
          <span>300%</span>
        </div>
      </div>

      {/* Quick Position Presets */}
      <div>
        <h3 className="text-white font-medium text-sm mb-2">Quick Position</h3>
        <div className="space-y-2">
          <Button
            onClick={() => onPresetPosition('center')}
            variant="outline"
            size="sm"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-xs"
          >
            <AlignCenter className="w-3 h-3 mr-2" />
            Center
          </Button>
          <Button
            onClick={() => onPresetPosition('top')}
            variant="outline"
            size="sm"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-xs"
          >
            <MoveUp className="w-3 h-3 mr-2" />
            Top
          </Button>
          <Button
            onClick={() => onPresetPosition('bottom')}
            variant="outline"
            size="sm"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-xs"
          >
            <MoveDown className="w-3 h-3 mr-2" />
            Bottom
          </Button>
        </div>
      </div>

      {/* Image Info */}
      {!imageLoading && !imageError && (
        <div>
          <h3 className="text-white font-medium text-sm mb-2">Image Info</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Display: {Math.round(imageDimensions.width)}×{Math.round(imageDimensions.height)}</div>
            <div>Zoom: {Math.round(zoom * 100)}%</div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-700/50 p-3 rounded-lg">
        <h4 className="text-white font-medium text-xs mb-2">Crop Tips</h4>
        <ul className="text-gray-400 text-xs space-y-1">
          <li>• Drag corners to resize</li>
          <li>• Drag inside to move</li>
          <li>• Scroll to zoom</li>
          <li>• Press G for grid</li>
        </ul>
      </div>
    </div>
  );
};
