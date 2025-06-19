
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Palette, Sun, Contrast, Zap } from 'lucide-react';

interface FineTuneTabProps {
  color: {
    saturation: number;
    contrast: number;
    brightness: number;
    hue: number;
  };
  onUpdate: (color: FineTuneTabProps['color']) => void;
}

export const FineTuneTab = ({ color, onUpdate }: FineTuneTabProps) => {
  const updateProperty = (property: keyof typeof color, value: number) => {
    onUpdate({ ...color, [property]: value });
  };

  const resetAll = () => {
    onUpdate({ saturation: 0, contrast: 0, brightness: 0, hue: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">Color Adjustments</h4>
        <button
          onClick={resetAll}
          className="text-xs text-crd-lightGray hover:text-white transition-colors"
        >
          Reset All
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Palette className="w-4 h-4 text-crd-lightGray" />
          <div className="flex-1">
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Saturation: {color.saturation > 0 ? '+' : ''}{color.saturation}%
            </Label>
            <Slider
              value={[color.saturation]}
              onValueChange={([value]) => updateProperty('saturation', value)}
              min={-50}
              max={50}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Contrast className="w-4 h-4 text-crd-lightGray" />
          <div className="flex-1">
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Contrast: {color.contrast > 0 ? '+' : ''}{color.contrast}%
            </Label>
            <Slider
              value={[color.contrast]}
              onValueChange={([value]) => updateProperty('contrast', value)}
              min={-30}
              max={30}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Sun className="w-4 h-4 text-crd-lightGray" />
          <div className="flex-1">
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Brightness: {color.brightness > 0 ? '+' : ''}{color.brightness}%
            </Label>
            <Slider
              value={[color.brightness]}
              onValueChange={([value]) => updateProperty('brightness', value)}
              min={-20}
              max={20}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-crd-lightGray" />
          <div className="flex-1">
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Hue Shift: {color.hue > 0 ? '+' : ''}{color.hue}°
            </Label>
            <Slider
              value={[color.hue]}
              onValueChange={([value]) => updateProperty('hue', value)}
              min={-180}
              max={180}
              step={15}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
