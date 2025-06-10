
import React from 'react';
import { Move3D, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EnhancedColoredSlider } from '../../../EnhancedColoredSlider';
import type { SpaceControls } from '../../../../spaces/types';

interface CameraControlsSectionProps {
  spaceControls: SpaceControls;
  onControlsChange: (controls: SpaceControls) => void;
  onResetCamera: () => void;
}

export const CameraControlsSection: React.FC<CameraControlsSectionProps> = ({
  spaceControls,
  onControlsChange,
  onResetCamera
}) => {
  const updateControl = (key: keyof SpaceControls, value: number | boolean) => {
    const newControls = {
      ...spaceControls,
      [key]: value
    };
    onControlsChange(newControls);
    console.log('Camera controls updated:', key, value);
  };

  return (
    <div className="space-y-4 border-t border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium flex items-center">
          <Move3D className="w-4 h-4 text-blue-400 mr-2" />
          Camera Controls
        </h4>
        <Button
          onClick={onResetCamera}
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs bg-transparent text-white border-white/20 hover:border-white/40"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Orbit Speed */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Orbit Speed: {spaceControls.orbitSpeed.toFixed(1)}
        </Label>
        <EnhancedColoredSlider
          value={[spaceControls.orbitSpeed]}
          onValueChange={([value]) => updateControl('orbitSpeed', value)}
          min={0}
          max={2}
          step={0.1}
          isActive={spaceControls.orbitSpeed > 0}
          styleColor="#8B5CF6"
          effectName="Orbit Speed"
        />
      </div>

      {/* Camera Distance */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Camera Distance: {spaceControls.cameraDistance.toFixed(1)}
        </Label>
        <EnhancedColoredSlider
          value={[spaceControls.cameraDistance]}
          onValueChange={([value]) => updateControl('cameraDistance', value)}
          min={3}
          max={15}
          step={0.5}
          isActive={spaceControls.cameraDistance !== 8}
          styleColor="#06B6D4"
          effectName="Camera Distance"
        />
      </div>
    </div>
  );
};
