
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Square, Maximize } from 'lucide-react';
import { CropArea } from './types';

interface CropperSidebarProps {
  cropAreas: CropArea[];
  imageLoaded: boolean;
  selectedCropId: string | null;
  onAddCropArea: (type: 'frame' | 'element') => void;
  onSelectCrop: (cropId: string) => void;
  onRemoveCrop: (cropId: string) => void;
}

export const CropperSidebar: React.FC<CropperSidebarProps> = ({
  cropAreas,
  imageLoaded,
  selectedCropId,
  onAddCropArea,
  onSelectCrop,
  onRemoveCrop
}) => {
  return (
    <div className="w-80 border-l border-editor-border bg-editor-dark p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Add Crop Areas */}
        <div>
          <h4 className="text-white font-medium mb-3">Add Crop Areas</h4>
          <div className="space-y-2">
            <Button
              onClick={() => onAddCropArea('frame')}
              variant="outline"
              className="w-full bg-editor-tool border-editor-border text-gray-300 hover:bg-blue-600/20 hover:text-white hover:border-blue-400"
              disabled={!imageLoaded}
            >
              <Square className="w-4 h-4 mr-2" />
              Add Frame Element
            </Button>
            <Button
              onClick={() => onAddCropArea('element')}
              variant="outline"
              className="w-full bg-editor-tool border-editor-border text-gray-300 hover:bg-yellow-600/20 hover:text-white hover:border-yellow-400"
              disabled={!imageLoaded}
            >
              <Maximize className="w-4 h-4 mr-2" />
              Add Custom Element
            </Button>
          </div>
        </div>

        {/* Crop Areas List */}
        <div>
          <h4 className="text-white font-medium mb-3">Crop Areas ({cropAreas.length})</h4>
          <div className="space-y-2">
            {cropAreas.map((crop) => (
              <Card
                key={crop.id}
                className={`p-3 cursor-pointer transition-all bg-editor-tool ${
                  crop.selected 
                    ? 'border-2' 
                    : 'border border-editor-border hover:border-gray-500'
                }`}
                style={{ borderColor: crop.selected ? crop.color : undefined }}
                onClick={() => onSelectCrop(crop.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: crop.color }}
                    />
                    <span className="text-white text-sm font-medium">
                      {crop.label}
                    </span>
                  </div>
                  {crop.id !== 'main' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCrop(crop.id);
                      }}
                      className="p-1 h-auto text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      ×
                    </Button>
                  )}
                </div>

                <div className="text-xs text-gray-300">
                  {Math.round(crop.width)} × {Math.round(crop.height)}px
                  <br />
                  Type: {crop.type}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-editor-tool border-editor-border p-4">
          <h5 className="text-white font-medium mb-2">Instructions</h5>
          <ul className="text-gray-300 text-xs space-y-1">
            <li>• Green: Main card image (required)</li>
            <li>• Blue: Frame elements (logos, borders)</li>
            <li>• Yellow: Custom elements (text, graphics)</li>
            <li>• Click and drag to move crop areas</li>
            <li>• Drag corners to resize</li>
            <li>• Use zoom for precision</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
