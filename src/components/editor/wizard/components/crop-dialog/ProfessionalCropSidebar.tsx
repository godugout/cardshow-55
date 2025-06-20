
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="w-72 bg-gray-900 border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Inspector</h3>
        <p className="text-sm text-gray-400">Fine-tune your crop settings</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Zoom Control */}
        <Card className="bg-gray-950 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Zoom Level</h4>
              <span className="text-green-400 font-semibold text-sm bg-green-400/10 px-2 py-1 rounded">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(value) => onZoomChange(value[0])}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>50%</span>
              <span>300%</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Position Controls - Dark Theme */}
        <Card className="bg-gray-950 border-gray-700">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-3">Quick Position</h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'top', label: 'Top Focus', desc: 'Position crop at top' },
                { id: 'center', label: 'Center Focus', desc: 'Center the crop' },
                { id: 'bottom', label: 'Bottom Focus', desc: 'Position crop at bottom' }
              ].map((preset) => (
                <Button
                  key={preset.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onPresetPosition(preset.id as any)}
                  className="bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600 justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{preset.label}</div>
                    <div className="text-xs text-gray-400">{preset.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Format Information */}
        <Card className="bg-gray-950 border-gray-700">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-3">Format Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Type:</span>
                <span className="text-white font-medium">
                  {cropFormat === 'fullCard' ? 'Trading Card' : 'Square Crop'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Aspect Ratio:</span>
                <span className="text-green-400 font-mono text-sm">
                  {cropFormat === 'fullCard' ? '2.5:3.5' : '1:1'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Output Size:</span>
                <span className="text-blue-400 font-mono text-sm">
                  {cropFormat === 'fullCard' ? '400×560px' : '400×400px'}
                </span>
              </div>
              {imageDimensions.width > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Source:</span>
                  <span className="text-gray-300 font-mono text-sm">
                    {Math.round(imageDimensions.width)}×{Math.round(imageDimensions.height)}px
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="bg-gray-950 border-gray-700">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-3">Shortcuts</h4>
            <div className="space-y-2">
              {[
                { key: 'Enter', action: 'Apply crop' },
                { key: 'Esc', action: 'Cancel' },
                { key: 'G', action: 'Toggle grid' },
                { key: 'Scroll', action: 'Zoom in/out' }
              ].map((shortcut) => (
                <div key={shortcut.key} className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{shortcut.action}:</span>
                  <kbd className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-mono border border-gray-600">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
