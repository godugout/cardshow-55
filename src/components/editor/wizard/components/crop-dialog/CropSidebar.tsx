
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

interface CropSidebarProps {
  cropFormat: 'fullCard' | 'cropped';
  zoom: number;
  imageDimensions: { width: number; height: number };
  imageLoading: boolean;
  imageError: boolean;
  onZoomChange: (zoom: number) => void;
  onPresetPosition: (position: 'center' | 'top' | 'bottom') => void;
}

export const CropSidebar = ({
  cropFormat,
  zoom,
  imageDimensions,
  imageLoading,
  imageError,
  onZoomChange,
  onPresetPosition
}: CropSidebarProps) => {
  return (
    <div className="w-64 bg-crd-darkGray border-l border-crd-mediumGray/30 p-4 space-y-4 overflow-y-auto">
      {/* Zoom Slider */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium text-sm">Zoom</h3>
            <span className="text-crd-lightGray text-xs">{Math.round(zoom * 100)}%</span>
          </div>
          <Slider
            value={[zoom]}
            onValueChange={(value) => onZoomChange(value[0])}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Preset Positions */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardContent className="p-3">
          <h3 className="text-white font-medium mb-2 text-sm">Quick Position</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'top', label: 'Top' },
              { id: 'center', label: 'Center' },
              { id: 'bottom', label: 'Bottom' }
            ].map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => onPresetPosition(preset.id as any)}
                className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white text-xs py-1.5"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Format Info */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardContent className="p-3">
          <h3 className="text-white font-medium mb-2 text-sm">Format Info</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-crd-lightGray">
              <span>Type:</span>
              <span>{cropFormat === 'fullCard' ? 'Trading Card' : 'Square Crop'}</span>
            </div>
            <div className="flex justify-between text-crd-lightGray">
              <span>Aspect Ratio:</span>
              <span>{cropFormat === 'fullCard' ? '2.5:3.5' : '1:1'}</span>
            </div>
            <div className="flex justify-between text-crd-lightGray">
              <span>Output Size:</span>
              <span>{cropFormat === 'fullCard' ? '400×560' : '400×400'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardContent className="p-3">
          <h3 className="text-white font-medium mb-2 text-sm">Shortcuts</h3>
          <div className="space-y-1 text-xs text-crd-lightGray">
            <div className="flex justify-between">
              <span>Apply crop:</span>
              <span>Enter</span>
            </div>
            <div className="flex justify-between">
              <span>Cancel:</span>
              <span>Escape</span>
            </div>
            <div className="flex justify-between">
              <span>Toggle grid:</span>
              <span>G</span>
            </div>
            <div className="flex justify-between">
              <span>Zoom:</span>
              <span>Mouse wheel</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
