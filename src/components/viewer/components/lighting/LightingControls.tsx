
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sun, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LightingControlsProps {
  overallBrightness: number[];
  interactiveLighting: boolean;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const LightingControls: React.FC<LightingControlsProps> = ({
  overallBrightness,
  interactiveLighting,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  return (
    <div className="space-y-4">
      {/* Overall Brightness */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">Brightness</span>
          </div>
          <span className="text-yellow-400 text-sm font-medium">
            {overallBrightness[0]}%
          </span>
        </div>
        <Slider
          value={overallBrightness}
          onValueChange={onBrightnessChange}
          min={50}
          max={200}
          step={5}
          className="w-full"
        />
      </div>

      {/* Interactive Lighting Toggle */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Interactive Lighting</span>
          </div>
          <Button
            onClick={onInteractiveLightingToggle}
            variant="outline"
            size="sm"
            className={cn(
              "h-8 px-3 text-xs transition-all",
              interactiveLighting 
                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600" 
                : "bg-transparent text-white border-white/20 hover:border-white/40"
            )}
          >
            {interactiveLighting ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
    </div>
  );
};
