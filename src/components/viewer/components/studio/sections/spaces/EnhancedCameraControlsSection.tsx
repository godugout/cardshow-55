
import React, { useCallback } from 'react';
import { Move3D, RotateCcw, Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EnhancedColoredSlider } from '../../../EnhancedColoredSlider';
import type { SpaceControls } from '../../../../spaces/types';

interface EnhancedCameraControlsSectionProps {
  spaceControls: SpaceControls;
  onControlsChange: (controls: SpaceControls) => void;
  onResetCamera: () => void;
}

export const EnhancedCameraControlsSection: React.FC<EnhancedCameraControlsSectionProps> = ({
  spaceControls,
  onControlsChange,
  onResetCamera
}) => {
  const updateControl = useCallback((key: keyof SpaceControls, value: number | boolean) => {
    console.log('🎥 Camera control update:', key, value);
    onControlsChange({
      ...spaceControls,
      [key]: value
    });
  }, [spaceControls, onControlsChange]);

  const handleResetCamera = useCallback(() => {
    console.log('🔄 Resetting camera to defaults');
    onResetCamera();
    onControlsChange({
      ...spaceControls,
      cameraDistance: 8,
      orbitSpeed: 0.5
    });
  }, [onResetCamera, onControlsChange, spaceControls]);

  return (
    <div className="space-y-4 border-t border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium flex items-center">
          <Camera className="w-4 h-4 text-blue-400 mr-2" />
          Camera Controls
        </h4>
        <Button
          onClick={handleResetCamera}
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs bg-transparent text-white border-white/20 hover:border-white/40 hover:bg-white/10"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Orbit Speed with enhanced feedback */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Orbit Speed: {spaceControls.orbitSpeed.toFixed(1)}x
          {spaceControls.orbitSpeed > 0 && (
            <span className="text-blue-400 text-xs ml-2">● Active</span>
          )}
        </Label>
        <EnhancedColoredSlider
          value={[spaceControls.orbitSpeed]}
          onValueChange={([value]) => updateControl('orbitSpeed', value)}
          min={0}
          max={2}
          step={0.1}
          isActive={spaceControls.orbitSpeed > 0}
          styleColor="#3B82F6"
          effectName="Orbit Speed"
        />
      </div>

      {/* Camera Distance with enhanced feedback */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Distance: {spaceControls.cameraDistance.toFixed(1)} units
          {spaceControls.cameraDistance !== 8 && (
            <span className="text-cyan-400 text-xs ml-2">● Modified</span>
          )}
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
        <div className="flex justify-between text-xs text-white/60 mt-1">
          <span>Close</span>
          <span>Default (8)</span>
          <span>Far</span>
        </div>
      </div>
    </div>
  );
};
