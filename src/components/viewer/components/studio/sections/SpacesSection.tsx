
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { LightingSection } from '../../LightingSection';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LightingPreset, EnvironmentScene } from '../../../types';
import { ENVIRONMENT_SCENES } from '../../../constants';

interface SpacesSectionProps {
  selectedScene: EnvironmentScene;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const SpacesSection: React.FC<SpacesSectionProps> = ({
  selectedScene,
  isOpen,
  onToggle,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  return (
    <CollapsibleSection
      title="Spaces & Lighting"
      emoji="🌌"
      statusText={selectedScene.name}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="scene-select" className="text-white text-sm mb-2 block">
            2D Environment
          </Label>
          <Select 
            value={JSON.stringify(ENVIRONMENT_SCENES.find(s => s.id === selectedScene.id))} 
            onValueChange={(value) => onSceneChange(JSON.parse(value))}
          >
            <SelectTrigger id="scene-select" className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select a scene" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              {ENVIRONMENT_SCENES.map((scene) => (
                <SelectItem key={scene.id} value={JSON.stringify(scene)} className="text-white hover:bg-white/10">
                  {scene.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <hr className="border-white/10" />

        <LightingSection
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          onLightingChange={onLightingChange}
          onBrightnessChange={onBrightnessChange}
          onInteractiveLightingToggle={onInteractiveLightingToggle}
        />
      </div>
    </CollapsibleSection>
  );
};
