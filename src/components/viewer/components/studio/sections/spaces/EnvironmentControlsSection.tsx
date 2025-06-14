
import React from 'react';
import { Label } from '@/components/ui/label';
import { EnhancedColoredSlider } from '../../../EnhancedColoredSlider';
import type { EnvironmentControls } from '../../../../types';

interface EnvironmentControlsSectionProps {
  environmentControls: EnvironmentControls;
  onEnvironmentControlsChange: (controls: EnvironmentControls) => void;
}

export const EnvironmentControlsSection: React.FC<EnvironmentControlsSectionProps> = ({
  environmentControls,
  onEnvironmentControlsChange
}) => {
  const updateEnvironmentControl = (key: keyof EnvironmentControls, value: number) => {
    onEnvironmentControlsChange({
      ...environmentControls,
      [key]: value
    });
  };

  return (
    <div className="space-y-4 border-t border-white/10 pt-4">
      <h4 className="text-white font-medium flex items-center">
        Environment Controls
      </h4>

      {/* Depth of Field */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Depth of Field: {environmentControls.depthOfField.toFixed(1)}
        </Label>
        <EnhancedColoredSlider
          value={[environmentControls.depthOfField]}
          onValueChange={([value]) => updateEnvironmentControl('depthOfField', value)}
          min={0}
          max={5}
          step={0.1}
          isActive={environmentControls.depthOfField > 0}
          styleColor="#45B26B"
          effectName="Depth of Field"
        />
      </div>

      {/* Parallax Intensity */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Parallax Intensity: {environmentControls.parallaxIntensity.toFixed(1)}
        </Label>
        <EnhancedColoredSlider
          value={[environmentControls.parallaxIntensity]}
          onValueChange={([value]) => updateEnvironmentControl('parallaxIntensity', value)}
          min={0}
          max={3}
          step={0.1}
          isActive={environmentControls.parallaxIntensity > 0}
          styleColor="#3B82F6"
          effectName="Parallax"
        />
      </div>

      {/* Field of View */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Field of View: {environmentControls.fieldOfView}°
        </Label>
        <EnhancedColoredSlider
          value={[environmentControls.fieldOfView]}
          onValueChange={([value]) => updateEnvironmentControl('fieldOfView', value)}
          min={60}
          max={120}
          step={5}
          isActive={environmentControls.fieldOfView !== 75}
          styleColor="#8B5CF6"
          effectName="Field of View"
        />
      </div>

      {/* Atmospheric Density */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Atmospheric Density: {(environmentControls.atmosphericDensity * 100).toFixed(0)}%
        </Label>
        <EnhancedColoredSlider
          value={[environmentControls.atmosphericDensity]}
          onValueChange={([value]) => updateEnvironmentControl('atmosphericDensity', value)}
          min={0}
          max={2}
          step={0.1}
          isActive={environmentControls.atmosphericDensity !== 1}
          styleColor="#F59E0B"
          effectName="Atmospheric Density"
        />
      </div>
    </div>
  );
};
