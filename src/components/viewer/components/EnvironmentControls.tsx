
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EnvironmentScene, LightingPreset } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

interface EnvironmentControlsProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const EnvironmentControls: React.FC<EnvironmentControlsProps> = ({
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="scene-select" className="text-white text-sm mb-2 block">
          Scene
        </Label>
        <Select onValueChange={(value) => onSceneChange(JSON.parse(value))}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue placeholder={selectedScene.name} />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/20">
            {ENVIRONMENT_SCENES.map((scene) => (
              <SelectItem key={scene.name} value={JSON.stringify(scene)} className="text-white hover:bg-white/10">
                {scene.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="lighting-select" className="text-white text-sm mb-2 block">
          Lighting
        </Label>
        <Select onValueChange={(value) => onLightingChange(JSON.parse(value))}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue placeholder={selectedLighting.name} />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/20">
            {LIGHTING_PRESETS.map((lighting) => (
              <SelectItem key={lighting.name} value={JSON.stringify(lighting)} className="text-white hover:bg-white/10">
                {lighting.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="brightness-slider" className="text-white text-sm mb-2 block">
          Brightness: {overallBrightness[0]}%
        </Label>
        <Slider
          id="brightness-slider"
          value={overallBrightness}
          max={200}
          step={1}
          onValueChange={onBrightnessChange}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="interactive-lighting" className="text-white text-sm">
          Interactive Lighting
        </Label>
        <Switch
          id="interactive-lighting"
          checked={interactiveLighting}
          onCheckedChange={onInteractiveLightingToggle}
        />
      </div>
    </div>
  );
};
