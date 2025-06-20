
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
    <div className="w-80 bg-crd-darkGray border-l border-crd-mediumGray/30 p-6 space-y-6">
      {/* Zoom Slider */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Zoom</h3>
            <span className="text-crd-lightGray text-sm">{Math.round(zoom * 100)}%</span>
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
        <CardContent className="p-4">
          <h3 className="text-white font-medium mb-3">Quick Position</h3>
          <div className="grid grid-cols-3 gap-2">
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
                className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Format Info */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardContent className="p-4">
          <h3 className="text-white font-medium mb-3">Format Info</h3>
          <div className="space-y-2 text-sm">
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

      {/* Debug Info */}
      {imageDimensions.width > 0 && (
        <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-3">Debug Info</h3>
            <div className="space-y-1 text-xs text-crd-lightGray">
              <div>Image: {imageDimensions.width}×{imageDimensions.height}</div>
              <div>Loading: {imageLoading ? 'Yes' : 'No'}</div>
              <div>Error: {imageError ? 'Yes' : 'No'}</div>
              <div>Zoom: {zoom.toFixed(1)}x</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyboard Shortcuts */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardContent className="p-4">
          <h3 className="text-white font-medium mb-3">Shortcuts</h3>
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
